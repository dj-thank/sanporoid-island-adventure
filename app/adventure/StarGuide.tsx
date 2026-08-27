"use client";

import { useEffect, useMemo, useState } from "react";
import hygCatalog from "./hyg-bright-stars-v41.json";
import { calculateSky, cardinal, normalizeDegrees, projectStar, sideLabel, type CatalogStar } from "./starMath";
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

export default function StarGuide({ fallbackPosition, islandName }: { fallbackPosition: [number, number]; islandName: string }) {
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
  const [nightBrightness, setNightBrightness] = useState(42);
  const [search, setSearch] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [showLines, setShowLines] = useState(true);

  useEffect(() => {
    const initialSync = window.setTimeout(() => setClockBase(new Date()), 0);
    const timer = window.setInterval(() => setClockBase(new Date()), 60_000);
    return () => { window.clearTimeout(initialSync); window.clearInterval(timer); };
  }, []);

  useEffect(() => {
    if (!sensorEnabled) return;
    const onOrientation = (raw: Event) => {
      const event = raw as OrientationEventWithCompass;
      if (typeof event.webkitCompassHeading === "number") {
        setHeading(normalizeDegrees(event.webkitCompassHeading));
        setSensorStatus(`iPhone方位センサーを使用中${typeof event.webkitCompassAccuracy === "number" ? `（精度 ±${Math.round(event.webkitCompassAccuracy)}°）` : ""}`);
      } else if (typeof event.alpha === "number") {
        setHeading(normalizeDegrees(360 - event.alpha));
        setSensorStatus(event.absolute ? "絶対方位センサーを使用中" : "相対方位です。北極星や既知の目標で補正してください");
      }
      if (typeof event.beta === "number") setViewAltitude(clamp(90 - Math.abs(event.beta), -10, 90));
    };
    window.addEventListener("deviceorientationabsolute", onOrientation);
    window.addEventListener("deviceorientation", onOrientation);
    return () => { window.removeEventListener("deviceorientationabsolute", onOrientation); window.removeEventListener("deviceorientation", onOrientation); };
  }, [sensorEnabled]);

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
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setPosition([coords.latitude, coords.longitude]); setLocationStatus("現在地を端末内の星空計算だけに使用中"); },
      () => setLocationStatus(`${islandName}の中心を仮位置として使用中`),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60_000 },
    );
  }

  return (
    <section className={`${styles.starGuide} ${nightRed ? styles.nightRed : ""}`} style={{ "--night-dim": String(nightBrightness / 100) } as React.CSSProperties} aria-labelledby="star-guide-title">
      <header><div><small>HYG 4.1 · {hygCatalog.starCount.toLocaleString("ja-JP")} REAL STARS</small><h2 id="star-guide-title">潮星スカイ・ファインダー</h2><p>スマートフォンを向けると、実星データ、現在地、時刻、方位、端末の上下角から空を再構成。検索した星へ左右・上下の誘導を表示します。</p></div><div className={styles.starActions}><button onClick={() => void startSensors()}>センサー開始</button><button onClick={() => setShowLines((value) => !value)}>{showLines ? "星座線を隠す" : "星座線を表示"}</button><button onClick={() => setNightRed((value) => !value)}>{nightRed ? "通常色へ" : "暗所用の赤へ"}</button></div></header>

      <div className={styles.searchRail}><label>星・星座を探す<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} list="star-search-list" placeholder="例：北極星、オリオン座、Vega" /></label><datalist id="star-search-list">{stars.filter((star) => star.magnitude <= 2.5).slice(0, 180).map((star) => <option key={star.name} value={star.japanese}>{star.constellation}</option>)}</datalist><div className={styles.timeMachine}><button onClick={() => setOffsetHours((value) => clamp(value - 1, -12, 24))}>−1h</button><input aria-label={`時間移動 ${offsetHours}時間`} type="range" min="-12" max="24" value={offsetHours} onChange={(event) => setOffsetHours(Number(event.target.value))} /><button onClick={() => setOffsetHours((value) => clamp(value + 1, -12, 24))}>＋1h</button><button onClick={() => setOffsetHours(0)}>現在</button><strong>{displayedTime ? displayedTime.toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "時刻同期中"}</strong></div></div>

      <div className={styles.skyViewport} aria-label={`方位${Math.round(heading)}度・高度${Math.round(viewAltitude)}度の星空`}>
        <div className={styles.compassLine}><span>左</span><strong>{Math.round(heading)}° · {cardinal(heading)} / 高度 {Math.round(viewAltitude)}°</strong><span>右</span></div>
        {showLines && <svg className={styles.constellationLayer} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{constellationLines.flatMap((line, lineIndex) => line.slice(1).map((name, index) => { const from = projectedByName.get(line[index]); const to = projectedByName.get(name); return from?.inView && to?.inView ? <line key={`${lineIndex}-${name}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} /> : null; }))}</svg>}
        {visibleStars.slice(0, 260).map((star) => <button className={styles.star} aria-label={`${star.japanese}、${star.constellation}、高度${Math.round(star.altitude)}度`} onClick={() => setSelectedName(star.name)} key={`${star.name}-${star.raHours}`} style={{ left: `${star.x}%`, top: `${star.y}%`, "--star-size": `${Math.max(3, 11 - star.magnitude * 1.55)}px` } as React.CSSProperties}><b /><span>{star.magnitude <= 2.2 ? star.japanese : ""}<small>{star.magnitude <= 1.7 ? star.constellation : ""}</small></span></button>)}
        <div className={styles.reticle}><span /><span /></div>
        {target && (!projectStar(target, viewAltitude).inView || searchedTarget) && <div className={styles.locateArrow} style={{ "--arrow-angle": `${Math.atan2(target.delta, target.altitude - viewAltitude) * 180 / Math.PI}deg` } as React.CSSProperties}><b>↑</b><span>{target.japanese}<small>{directionText(target.delta, target.altitude - viewAltitude)}</small></span></div>}
      </div>

      <div className={styles.starReadout}><article><small>あれが何座？</small>{target ? <><h3>{sideLabel(target.delta)}に {target.japanese}</h3><strong>{target.constellation}</strong><p>高度 約{Math.round(target.altitude)}°・方位 {Math.round(target.azimuth)}°。{directionText(target.delta, target.altitude - viewAltitude)}。雲・障害物・磁気ずれは含みません。</p></> : <><h3>星空を同期しています</h3><p>現在時刻の端末計算を準備中です。</p></>}</article><aside><p>{sensorStatus}</p><p>{locationStatus}。緯度・経度の数値は保存・送信しません。</p><label>手動方位<input type="range" min="0" max="359" value={Math.round(heading)} onChange={(event) => setHeading(Number(event.target.value))} /><span>{Math.round(heading)}°</span></label><label>見る高さ<input type="range" min="-10" max="90" value={Math.round(viewAltitude)} onChange={(event) => setViewAltitude(Number(event.target.value))} /><span>{Math.round(viewAltitude)}°</span></label><label>肉眼等級<input type="range" min="1" max="5" step="0.5" value={magnitudeLimit} onChange={(event) => setMagnitudeLimit(Number(event.target.value))} /><span>≤ {magnitudeLimit.toFixed(1)}</span></label><label>暗所輝度<input type="range" min="18" max="70" value={nightBrightness} onChange={(event) => setNightBrightness(Number(event.target.value))} /><span>{nightBrightness}%</span></label></aside></div>
      <footer>安全な場所で立ち止まって使用してください。歩行中、運転中、崖・海岸・車道では画面を見続けないでください。星座線は主要星を結ぶ簡易表示で、IAU星座境界ではありません。HYG Database v4.1 / astronexus, CC BY-SA 4.0。</footer>
    </section>
  );
}

function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }
function directionText(horizontal: number, vertical: number) { const horizontalText = Math.abs(horizontal) < 6 ? "左右はほぼ中央" : horizontal > 0 ? `右へ約${Math.round(Math.abs(horizontal))}°` : `左へ約${Math.round(Math.abs(horizontal))}°`; const verticalText = Math.abs(vertical) < 6 ? "上下もほぼ中央" : vertical > 0 ? `上へ約${Math.round(Math.abs(vertical))}°` : `下へ約${Math.round(Math.abs(vertical))}°`; return `${horizontalText}、${verticalText}`; }
