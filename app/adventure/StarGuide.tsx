"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import hygCatalog from "./hyg-bright-stars-v41.json";
import { islandDeepKnowledge } from "./islandKnowledge";
import { calculateSky, cardinal, deviceViewFromOrientation, isHeadingReliable, normalizeDegrees, normalizeSigned, projectStar, sensorSmoothingAmount, sideLabel, smoothHeading, type CatalogStar } from "./starMath";
import styles from "./star-guide.module.css";

const localizedNames: Record<string, string> = {
  Polaris: "北極星", Vega: "ベガ（織姫星）", Altair: "アルタイル（彦星）", Deneb: "デネブ",
  Arcturus: "アークトゥルス", Spica: "スピカ", Antares: "アンタレス", Capella: "カペラ",
  Betelgeuse: "ベテルギウス", Rigel: "リゲル", Sirius: "シリウス", Procyon: "プロキオン",
};
const constellationNames: Record<string, string> = {
  UMi: "こぐま座", Lyr: "こと座", Aql: "わし座", Cyg: "はくちょう座", Boo: "うしかい座",
  Vir: "おとめ座", Sco: "さそり座", Aur: "ぎょしゃ座", Ori: "オリオン座", CMa: "おおいぬ座",
  CMi: "こいぬ座", UMa: "おおぐま座", Cas: "カシオペヤ座", And: "アンドロメダ座", Peg: "ペガスス座",
  Sgr: "いて座", Cap: "やぎ座", Aqr: "みずがめ座", Psc: "うお座", Cet: "くじら座",
};
const stars: CatalogStar[] = hygCatalog.stars.map((star) => ({
  name: star.name,
  japanese: localizedNames[star.proper || star.name] ?? (star.proper || star.designation || star.name),
  constellation: constellationNames[star.constellation] ?? `${star.constellation || "不明"}座域`,
  constellationCode: star.constellation,
  raHours: star.raHours,
  decDegrees: star.decDegrees,
  magnitude: star.magnitude,
}));

const constellationLines = [
  ["Betelgeuse", "Bellatrix", "Mintaka", "Alnilam", "Alnitak", "Saiph", "Rigel", "Bellatrix"],
  ["Dubhe", "Merak", "Phecda", "Megrez", "Alioth", "Mizar", "Alkaid"],
  ["Caph", "Schedar", "Cih", "Ruchbah", "Segin"],
  ["Deneb", "Sadr", "Albireo"], ["Vega", "Sheliak", "Sulafat", "Vega"], ["Tarazed", "Altair", "Alshain"],
];

type OrientationEventWithCompass = DeviceOrientationEvent & { webkitCompassHeading?: number; webkitCompassAccuracy?: number };
type OrientationConstructorWithPermission = typeof DeviceOrientationEvent & { requestPermission?: (absolute?: boolean) => Promise<"granted" | "denied"> };

export default function StarGuide({ active, fallbackPosition, islandName }: { active: boolean; fallbackPosition: [number, number]; islandName: string }) {
  const [heading, setHeading] = useState(0);
  const [viewAltitude, setViewAltitude] = useState(35);
  const [sensorEnabled, setSensorEnabled] = useState(false);
  const [sensorStatus, setSensorStatus] = useState("センサーは未開始。手動方位・高度でも使えます。");
  const [position, setPosition] = useState<[number, number]>(fallbackPosition);
  const [locationStatus, setLocationStatus] = useState(`${islandName}の中心を仮位置にしています`);
  const [clockBase, setClockBase] = useState<Date | null>(null);
  const [offsetHours, setOffsetHours] = useState(0);
  const [nightRed, setNightRed] = useState(true);
  const [magnitudeLimit, setMagnitudeLimit] = useState(4);
  const [nightBrightness, setNightBrightness] = useState(56);
  const [search, setSearch] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [showLines, setShowLines] = useState(true);
  const [headingOffset, setHeadingOffset] = useState(0);
  const absoluteSensorSeen = useRef(false);
  const dragStart = useRef<{ x: number; y: number; heading: number; altitude: number } | null>(null);
  const latestSensorSample = useRef<{ heading: number; altitude: number; headingReliable: boolean; source: "absolute" | "relative" | "iphone"; accuracy?: number } | null>(null);
  const lastSensorAt = useRef(0);
  const lastSensorFlushAt = useRef(0);
  const lastSensorSource = useRef("");
  const rawSensorHeading = useRef<number | null>(null);
  const headingOffsetRef = useRef(0);
  const latestHeadingReliable = useRef(true);
  const locationWatch = useRef<number | null>(null);
  const locationTimer = useRef<number | null>(null);

  useEffect(() => {
    const initialSync = window.setTimeout(() => setClockBase(new Date()), 0);
    const timer = window.setInterval(() => setClockBase(new Date()), 60_000);
    return () => { window.clearTimeout(initialSync); window.clearInterval(timer); };
  }, []);

  useEffect(() => {
    if (!sensorEnabled || !active) return;
    absoluteSensorSeen.current = false;
    let relativeListening = false;
    let frame = 0;
    let fallbackTimer = 0;
    let staleTimer = 0;

    const flushLatest = (now: number) => {
      frame = 0;
      const sample = latestSensorSample.current;
      if (!sample || now - lastSensorFlushAt.current < 45) return;
      const elapsedMs = lastSensorFlushAt.current ? now - lastSensorFlushAt.current : 45;
      lastSensorFlushAt.current = now;
      latestHeadingReliable.current = sample.headingReliable;
      if (sample.headingReliable) rawSensorHeading.current = sample.heading;
      setHeading((previous) => {
        const next = normalizeDegrees(sample.heading + headingOffsetRef.current);
        return smoothHeading(previous, next, sensorSmoothingAmount(normalizeSigned(next - previous), elapsedMs, sample.accuracy));
      });
      setViewAltitude((previous) => previous + (sample.altitude - previous) * sensorSmoothingAmount(sample.altitude - previous, elapsedMs, sample.accuracy));
      const sourceKey = `${sample.source}-${sample.headingReliable}-${sample.accuracy === undefined ? "" : Math.round(sample.accuracy / 5)}`;
      if (sourceKey !== lastSensorSource.current) {
        lastSensorSource.current = sourceKey;
        if (!sample.headingReliable) setSensorStatus("天頂・天底付近では方位が定まらないため、直前の方位を保持しています");
        else if (sample.source === "iphone") setSensorStatus(`iPhone方位センサーを使用中${sample.accuracy === undefined ? "" : `（精度 ±${Math.round(sample.accuracy)}°）`}`);
        else if (sample.source === "absolute") setSensorStatus("絶対方位センサーを使用中");
        else setSensorStatus("相対方位のみです。北極星などで手動補正してください");
      }
    };

    const onOrientation = (raw: Event) => {
      const event = raw as OrientationEventWithCompass;
      const isAbsolute = event.type === "deviceorientationabsolute" || event.absolute || typeof event.webkitCompassHeading === "number";
      if (isAbsolute) absoluteSensorSeen.current = true;
      if (!isAbsolute && absoluteSensorSeen.current) return;
      if (typeof event.alpha !== "number" || typeof event.beta !== "number" || typeof event.gamma !== "number") return;
      const headingReliable = isHeadingReliable(event.beta, event.gamma);
      const fallbackHeading = rawSensorHeading.current ?? 0;
      const view = deviceViewFromOrientation({ alpha: event.alpha, beta: event.beta, gamma: event.gamma, fallbackHeading });
      latestSensorSample.current = {
        heading: headingReliable && typeof event.webkitCompassHeading === "number" ? normalizeDegrees(event.webkitCompassHeading) : view.heading,
        altitude: view.altitude,
        headingReliable,
        source: typeof event.webkitCompassHeading === "number" ? "iphone" : isAbsolute ? "absolute" : "relative",
        accuracy: typeof event.webkitCompassAccuracy === "number" ? event.webkitCompassAccuracy : undefined,
      };
      lastSensorAt.current = performance.now();
      if (!frame) frame = window.requestAnimationFrame(flushLatest);
    };

    const addRelativeListener = () => {
      if (relativeListening) return;
      relativeListening = true;
      window.addEventListener("deviceorientation", onOrientation);
    };
    window.addEventListener("deviceorientationabsolute", onOrientation);
    const constructor = window.DeviceOrientationEvent as OrientationConstructorWithPermission | undefined;
    if (constructor?.requestPermission) addRelativeListener();
    else fallbackTimer = window.setTimeout(() => { if (!absoluteSensorSeen.current) addRelativeListener(); }, 1200);
    staleTimer = window.setInterval(() => {
      if (lastSensorAt.current && performance.now() - lastSensorAt.current > 2500) setSensorStatus("センサー更新が止まりました。端末を動かすか、手動操作を使ってください");
    }, 1000);
    return () => {
      window.removeEventListener("deviceorientationabsolute", onOrientation);
      if (relativeListening) window.removeEventListener("deviceorientation", onOrientation);
      window.clearTimeout(fallbackTimer);
      window.clearInterval(staleTimer);
      if (frame) window.cancelAnimationFrame(frame);
      latestSensorSample.current = null;
    };
  }, [active, sensorEnabled]);

  useEffect(() => {
    if (!active) stopLocationRefinement();
    return () => stopLocationRefinement();
  }, [active]);

  const displayedTime = useMemo(() => clockBase ? new Date(clockBase.getTime() + offsetHours * 3_600_000) : null, [clockBase, offsetHours]);
  const sky = useMemo(() => displayedTime ? calculateSky(stars, displayedTime, position[0], position[1], heading) : [], [displayedTime, heading, position]);
  const projected = useMemo(() => sky.map((star) => projectStar(star, viewAltitude)), [sky, viewAltitude]);
  const visibleStars = projected.filter((star) => star.inView && star.altitude > -3 && star.magnitude <= magnitudeLimit).sort((a, b) => a.magnitude - b.magnitude);
  const searchNeedle = search.trim().toLowerCase();
  const searchedTarget = searchNeedle ? sky.find((star) => `${star.japanese} ${star.name} ${star.constellation}`.toLowerCase().includes(searchNeedle)) : undefined;
  const selectedTarget = sky.find((star) => star.name === selectedName);
  const reticleTarget = [...visibleStars].sort((a, b) => Math.hypot(a.delta, a.altitude - viewAltitude) - Math.hypot(b.delta, b.altitude - viewAltitude))[0];
  const target = searchedTarget ?? selectedTarget ?? reticleTarget;
  const projectedByName = new Map(projected.map((star) => [star.name, star]));

  async function startSensors() {
    try {
      const constructor = window.DeviceOrientationEvent as OrientationConstructorWithPermission | undefined;
      if (constructor?.requestPermission) {
        const permission = await constructor.requestPermission(true);
        if (permission !== "granted") { setSensorStatus("方位センサーは許可されませんでした。手動操作を使えます。"); return; }
      }
      setSensorEnabled(true);
      setSensorStatus("センサー読み取り待ち。端末を8の字に動かすと補正しやすくなります。");
    } catch { setSensorStatus("方位センサーを開始できません。手動操作を使えます。"); }

    if (!navigator.geolocation) return;
    stopLocationRefinement();
    let bestAccuracy = Number.POSITIVE_INFINITY;
    locationWatch.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        if (!Number.isFinite(coords.accuracy) || coords.accuracy >= bestAccuracy) return;
        bestAccuracy = coords.accuracy;
        setPosition([coords.latitude, coords.longitude]);
        setLocationStatus(`現在地を精度約${Math.round(coords.accuracy)}mで端末内計算に使用中`);
        if (coords.accuracy <= 20) stopLocationRefinement();
      },
      () => { stopLocationRefinement(); setLocationStatus(`${islandName}の中心を仮位置として使用中`); },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 5_000 },
    );
    locationTimer.current = window.setTimeout(() => stopLocationRefinement(), 12_000);
  }

  function stopLocationRefinement() {
    if (locationWatch.current !== null && navigator.geolocation) navigator.geolocation.clearWatch(locationWatch.current);
    if (locationTimer.current !== null) window.clearTimeout(locationTimer.current);
    locationWatch.current = null;
    locationTimer.current = null;
  }

  function toggleSensors() {
    if (sensorEnabled) {
      setSensorEnabled(false);
      stopLocationRefinement();
      setSensorStatus("センサーを停止しました。手動操作を使えます。");
      return;
    }
    void startSensors();
  }

  function calibrateToTarget() {
    if (!target || rawSensorHeading.current === null || !latestHeadingReliable.current) return;
    const correction = normalizeSigned(target.azimuth - rawSensorHeading.current);
    headingOffsetRef.current = correction;
    setHeadingOffset(correction);
    setHeading(normalizeDegrees(rawSensorHeading.current + correction));
    setSensorStatus(`${target.japanese}を基準に方位を補正しました（${correction >= 0 ? "+" : ""}${Math.round(correction)}°、この画面だけ）`);
  }

  function resetCalibration() {
    headingOffsetRef.current = 0;
    setHeadingOffset(0);
    if (rawSensorHeading.current !== null) setHeading(rawSensorHeading.current);
    setSensorStatus("方位補正を解除しました。端末の絶対方位を使用します。");
  }

  function startSkyDrag(event: React.PointerEvent<HTMLDivElement>) {
    dragStart.current = { x: event.clientX, y: event.clientY, heading, altitude: viewAltitude };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveSkyDrag(event: React.PointerEvent<HTMLDivElement>) {
    const start = dragStart.current;
    if (!start) return;
    setHeading(normalizeDegrees(start.heading - (event.clientX - start.x) * 0.28));
    setViewAltitude(clamp(start.altitude + (event.clientY - start.y) * 0.2, -10, 90));
  }

  return (
    <section className={`${styles.starGuide} ${nightRed ? styles.nightRed : ""}`} style={{ "--night-dim": String(nightBrightness / 100) } as React.CSSProperties} aria-labelledby="star-guide-title">
      <header className={styles.starHeader}>
        <div><small>HYG 4.1 · {hygCatalog.starCount.toLocaleString("ja-JP")} REAL STARS</small><h2 id="star-guide-title">潮星スカイ・ファインダー</h2><p>{islandName}の空へスマートフォンを向けると、実星データ・時刻・方位・端末の上下角から端末内で再構成します。検索した星へ左右・上下の誘導を表示します。</p></div>
        <div className={styles.starActions}>
          <button type="button" aria-pressed={sensorEnabled} onClick={toggleSensors}>{sensorEnabled ? "センサー停止" : "センサー開始"}</button>
          <button type="button" aria-pressed={showLines} onClick={() => setShowLines((value) => !value)}>{showLines ? "星座線を隠す" : "星座線を表示"}</button>
          <button type="button" aria-pressed={nightRed} onClick={() => setNightRed((value) => !value)}>{nightRed ? "通常色へ" : "暗所用の赤へ"}</button>
        </div>
      </header>

      <div className={styles.starWorkspace}>
        <div className={styles.skyColumn}>
          <div className={styles.searchRail}>
            <label>星・星座を探す<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} list="star-search-list" placeholder="例：北極星、オリオン座、Vega" /></label>
            <datalist id="star-search-list">{stars.filter((star) => star.magnitude <= 2.5).slice(0, 180).map((star) => <option key={star.name} value={star.japanese}>{star.constellation}</option>)}</datalist>
            <div className={styles.timeMachine} aria-label="星空の時間移動">
              <button type="button" aria-label="1時間戻す" onClick={() => setOffsetHours((value) => clamp(value - 1, -12, 24))}>−1h</button>
              <input aria-label={`時間移動 ${offsetHours}時間`} type="range" min="-12" max="24" value={offsetHours} onChange={(event) => setOffsetHours(Number(event.target.value))} />
              <button type="button" aria-label="1時間進める" onClick={() => setOffsetHours((value) => clamp(value + 1, -12, 24))}>＋1h</button>
              <button type="button" onClick={() => setOffsetHours(0)}>現在</button>
              <strong>{displayedTime ? displayedTime.toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "時刻同期中"}</strong>
            </div>
          </div>

          <div className={styles.skyViewport} aria-label={`方位${Math.round(heading)}度・高度${Math.round(viewAltitude)}度の星空`} onPointerDown={startSkyDrag} onPointerMove={moveSkyDrag} onPointerUp={() => { dragStart.current = null; }} onPointerCancel={() => { dragStart.current = null; }}>
            <div className={styles.mobileSkyHint}>満月直後 · {sensorEnabled ? "端末を空へ向ける" : "指で空を動かせます"}</div>
            <div className={styles.compassLine}><span>左</span><strong>{Math.round(heading)}° · {cardinal(heading)} / 高度 {Math.round(viewAltitude)}°</strong><span>右</span></div>
            {showLines && <svg className={styles.constellationLayer} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{constellationLines.flatMap((line, lineIndex) => line.slice(1).map((name, index) => { const from = projectedByName.get(line[index]); const to = projectedByName.get(name); return from?.inView && to?.inView ? <line key={`${lineIndex}-${name}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} /> : null; }))}</svg>}
            {visibleStars.slice(0, 260).map((star) => {
              const selected = selectedName === star.name;
              const selectable = selected || star.magnitude <= 2.5;
              const showLabel = star.magnitude <= 2.2 && star.x >= 13 && star.x <= 87 && star.y >= 8 && star.y <= 88;
              const className = `${styles.star} ${star.magnitude <= 1.7 ? styles.majorStar : ""}`;
              const style = { left: `${star.x}%`, top: `${star.y}%`, "--star-size": `${Math.max(3, 11 - star.magnitude * 1.55)}px` } as React.CSSProperties;
              if (!selectable) return <span aria-hidden="true" className={`${className} ${styles.decorativeStar}`} key={`${star.name}-${star.raHours}`} style={style}><b /></span>;
              return <button type="button" className={className} aria-label={`${star.japanese}、${star.constellation}、高度${Math.round(star.altitude)}度`} aria-pressed={selected} onClick={() => setSelectedName(star.name)} key={`${star.name}-${star.raHours}`} style={style}><b /><span>{showLabel ? star.japanese : ""}<small>{showLabel && star.magnitude <= 1.7 ? star.constellation : ""}</small></span></button>;
            })}
            <div className={styles.reticle}><span /><span /></div>
            {target && (!projectStar(target, viewAltitude).inView || searchedTarget) && <div className={styles.locateArrow} style={{ "--arrow-angle": `${Math.atan2(target.delta, target.altitude - viewAltitude) * 180 / Math.PI}deg` } as React.CSSProperties}><b>↑</b><span>{target.japanese}<small>{directionText(target.delta, target.altitude - viewAltitude)}</small></span></div>}
          </div>
        </div>

        <aside className={styles.controlDock}>
          <article className={styles.tripSkyCard}>
            <small>TRIP SKY · 8/29—9/1</small>
            <strong>満月直後の空</strong>
            <p>{islandDeepKnowledge.tripContext.nightSky}</p>
          </article>
          <article className={styles.targetCard} aria-live="polite">
            <small>あれが何座？</small>
            {target ? <><h3>{sideLabel(target.delta)}に {target.japanese}</h3><strong>{target.constellation}</strong><p>見かけ高度 約{Math.round(target.altitude)}°・方位 {Math.round(target.azimuth)}°。{directionText(target.delta, target.altitude - viewAltitude)}。標準大気差を補正し、雲・障害物・局地的な磁気ずれは含みません。</p></> : <><h3>星空を同期しています</h3><p>現在時刻の端末計算を準備中です。</p></>}
            {sensorEnabled && target && <div className={styles.calibrationActions}><button type="button" onClick={calibrateToTarget}>中央の星で方位補正</button>{headingOffset !== 0 && <button type="button" onClick={resetCalibration}>補正を解除</button>}</div>}
          </article>

          <div className={styles.sensorReadout} role="status"><p><strong>方位</strong>{sensorStatus}</p><p><strong>位置</strong>{locationStatus}。緯度・経度の数値は保存・送信しません。</p></div>

          <details className={styles.manualPanel}>
            <summary><span><small>MANUAL CONTROLS</small><strong>手動調整と暗所輝度</strong></span><b>開く</b></summary>
            <div>
              <label>手動方位<input type="range" min="0" max="359" value={Math.round(heading)} onChange={(event) => setHeading(Number(event.target.value))} /><span>{Math.round(heading)}°</span></label>
              <label>見る高さ<input type="range" min="-10" max="90" value={Math.round(viewAltitude)} onChange={(event) => setViewAltitude(Number(event.target.value))} /><span>{Math.round(viewAltitude)}°</span></label>
              <label>肉眼等級<input type="range" min="1" max="5" step="0.5" value={magnitudeLimit} onChange={(event) => setMagnitudeLimit(Number(event.target.value))} /><span>≤ {magnitudeLimit.toFixed(1)}</span></label>
              <label>暗所輝度<input type="range" min="18" max="70" value={nightBrightness} onChange={(event) => setNightBrightness(Number(event.target.value))} /><span>{nightBrightness}%</span></label>
            </div>
          </details>
        </aside>
      </div>

      <footer>安全な場所で立ち止まって使用してください。歩行中、運転中、崖・海岸・車道では画面を見続けないでください。星座線は主要星を結ぶ簡易表示で、IAU星座境界ではありません。HYG Database v4.1 / astronexus, CC BY-SA 4.0。</footer>
    </section>
  );
}

function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }
function directionText(horizontal: number, vertical: number) { const horizontalText = Math.abs(horizontal) < 6 ? "左右はほぼ中央" : horizontal > 0 ? `右へ約${Math.round(Math.abs(horizontal))}°` : `左へ約${Math.round(Math.abs(horizontal))}°`; const verticalText = Math.abs(vertical) < 6 ? "上下もほぼ中央" : vertical > 0 ? `上へ約${Math.round(Math.abs(vertical))}°` : `下へ約${Math.round(Math.abs(vertical))}°`; return `${horizontalText}、${verticalText}`; }
