"use client";

import { useEffect, useMemo, useState } from "react";
import hygCatalog from "./hyg-bright-stars-v41.json";
import styles from "./star-guide.module.css";

type Star = { name: string; japanese: string; constellation: string; raHours: number; decDegrees: number; magnitude: number };
type SkyStar = Star & { altitude: number; azimuth: number; delta: number };

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
const stars: Star[] = hygCatalog.stars.map((star) => ({
  name: star.name,
  japanese: localizedNames[star.proper || star.name] ?? (star.proper || star.designation || star.name),
  constellation: constellationNames[star.constellation] ?? `${star.constellation || "不明"}座域`,
  raHours: star.raHours,
  decDegrees: star.decDegrees,
  magnitude: star.magnitude,
}));

type OrientationEventWithCompass = DeviceOrientationEvent & { webkitCompassHeading?: number; webkitCompassAccuracy?: number };
type OrientationConstructorWithPermission = typeof DeviceOrientationEvent & { requestPermission?: (absolute?: boolean) => Promise<"granted" | "denied"> };

export default function StarGuide({ fallbackPosition, islandName }: { fallbackPosition: [number, number]; islandName: string }) {
  const [heading, setHeading] = useState(0);
  const [sensorEnabled, setSensorEnabled] = useState(false);
  const [sensorStatus, setSensorStatus] = useState("センサーは未開始。手動方位でも使えます。");
  const [position, setPosition] = useState<[number, number]>(fallbackPosition);
  const [locationStatus, setLocationStatus] = useState(`${islandName}の中心を仮位置にしています`);
  const [now, setNow] = useState<Date | null>(null);
  const [nightRed, setNightRed] = useState(true);
  const [magnitudeLimit, setMagnitudeLimit] = useState(3.5);
  const [nightBrightness, setNightBrightness] = useState(38);

  useEffect(() => {
    const initialSync = window.setTimeout(() => setNow(new Date()), 0);
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => {
      window.clearTimeout(initialSync);
      window.clearInterval(timer);
    };
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
        setSensorStatus(event.absolute ? "絶対方位センサーを使用中" : "相対方位です。北極星やコンパスで補正してください");
      }
    };
    window.addEventListener("deviceorientationabsolute", onOrientation);
    window.addEventListener("deviceorientation", onOrientation);
    return () => {
      window.removeEventListener("deviceorientationabsolute", onOrientation);
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, [sensorEnabled]);

  const sky = useMemo(() => now ? calculateSky(stars, now, position[0], position[1], heading) : [], [heading, now, position]);
  const visibleStars = sky.filter((star) => star.altitude > 0 && star.magnitude <= magnitudeLimit).sort((a, b) => a.delta - b.delta);
  const target = visibleStars[0];

  async function startSensors() {
    try {
      const constructor = window.DeviceOrientationEvent as OrientationConstructorWithPermission | undefined;
      if (constructor?.requestPermission) {
        const permission = await constructor.requestPermission(true);
        if (permission !== "granted") {
          setSensorStatus("方位センサーは許可されませんでした。手動方位を使えます。");
          return;
        }
      }
      setSensorEnabled(true);
      setSensorStatus("センサー読み取りを待っています。端末を8の字に動かすと補正しやすくなります。");
    } catch {
      setSensorStatus("方位センサーを開始できません。手動方位を使えます。");
    }

    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition([coords.latitude, coords.longitude]);
        setLocationStatus("現在地は端末内の星空計算だけに使用中");
      },
      () => setLocationStatus(`${islandName}の中心を仮位置として使用中`),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60_000 },
    );
  }

  return (
    <section className={`${styles.starGuide} ${nightRed ? styles.nightRed : ""}`} style={{ "--night-dim": String(nightBrightness / 100) } as React.CSSProperties} aria-labelledby="star-guide-title">
      <header>
        <div><small>HYG 4.1 · {hygCatalog.starCount.toLocaleString("ja-JP")} REAL STARS</small><h2 id="star-guide-title">真夜中の星空コンパス</h2><p>スマートフォンを向けると、HYG実データの赤経・赤緯・等級から、その方角で地平線より上にある星と星座を端末内で計算します。</p></div>
        <div className={styles.starActions}><button onClick={() => void startSensors()}>星空センサーを開始</button><button onClick={() => setNightRed((value) => !value)}>{nightRed ? "通常色へ" : "暗所用の赤へ"}</button></div>
      </header>

      <div className={styles.skyViewport} aria-label={`方位${Math.round(heading)}度の星空`}>
        <div className={styles.compassLine}><span>左</span><strong>{Math.round(heading)}° · {cardinal(heading)}</strong><span>右</span></div>
        {[20, 40, 60, 80].map((altitude) => <i className={styles.altitudeLine} style={{ bottom: `${altitude}%` }} key={altitude}>{altitude}°</i>)}
        {visibleStars.filter((star) => Math.abs(star.delta) <= 90).slice(0, 240).map((star) => <div className={styles.star} key={`${star.name}-${star.raHours}`} style={{ left: `${50 + star.delta / 1.8}%`, bottom: `${Math.max(5, Math.min(92, star.altitude))}%`, "--star-size": `${Math.max(3, 11 - star.magnitude * 1.55)}px` } as React.CSSProperties}><b /><span>{star.magnitude <= 2.2 ? star.japanese : ""}<small>{star.magnitude <= 1.7 ? star.constellation : ""}</small></span></div>)}
        <div className={styles.reticle}><span /><span /></div>
      </div>

      <div className={styles.starReadout}>
        <article><small>あれが何座？</small>{target ? <><h3>{sideLabel(target.delta)}に {target.japanese}</h3><strong>{target.constellation}</strong><p>高度 約{Math.round(target.altitude)}°・方位 {Math.round(target.azimuth)}°。星名表示は端末計算で、雲・障害物・センサー誤差は含みません。</p></> : <><h3>この方角の明るい星は地平線下です</h3><p>方位を変えるか、少し時間を置いてください。</p></>}</article>
        <aside><p>{sensorStatus}</p><p>{locationStatus}。緯度・経度の数値は保存・送信しません。</p><label>手動方位<input type="range" min="0" max="359" value={Math.round(heading)} onChange={(event) => setHeading(Number(event.target.value))} /><span>{Math.round(heading)}°</span></label><label>肉眼等級<input type="range" min="1" max="5" step="0.5" value={magnitudeLimit} onChange={(event) => setMagnitudeLimit(Number(event.target.value))} /><span>≤ {magnitudeLimit.toFixed(1)}</span></label><label>暗所の明るさ<input type="range" min="18" max="70" value={nightBrightness} onChange={(event) => setNightBrightness(Number(event.target.value))} /><span>{nightBrightness}%</span></label></aside>
      </div>
      <footer>星空ガイドは安全な場所で立ち止まって使用してください。歩行中、運転中、崖・海岸・車道では画面を見続けないでください。星データ: HYG Database v4.1 / astronexus, CC BY-SA 4.0。</footer>
    </section>
  );
}

function calculateSky(catalog: Star[], date: Date, latitude: number, longitude: number, heading: number): SkyStar[] {
  const julianDate = date.getTime() / 86_400_000 + 2440587.5;
  const days = julianDate - 2451545;
  const localSidereal = normalizeDegrees(280.46061837 + 360.98564736629 * days + longitude);
  const lat = radians(latitude);
  return catalog.map((star) => {
    const hourAngle = radians(normalizeSigned(localSidereal - star.raHours * 15));
    const dec = radians(star.decDegrees);
    const altitude = Math.asin(Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(hourAngle));
    const azimuth = Math.atan2(-Math.sin(hourAngle) * Math.cos(dec), Math.sin(dec) * Math.cos(lat) - Math.cos(dec) * Math.sin(lat) * Math.cos(hourAngle));
    const azimuthDegrees = normalizeDegrees(degrees(azimuth));
    return { ...star, altitude: degrees(altitude), azimuth: azimuthDegrees, delta: normalizeSigned(azimuthDegrees - heading) };
  });
}

function normalizeDegrees(value: number) { return ((value % 360) + 360) % 360; }
function normalizeSigned(value: number) { const normalized = normalizeDegrees(value); return normalized > 180 ? normalized - 360 : normalized; }
function radians(value: number) { return value * Math.PI / 180; }
function degrees(value: number) { return value * 180 / Math.PI; }
function cardinal(value: number) { return ["北", "北東", "東", "南東", "南", "南西", "西", "北西"][Math.round(normalizeDegrees(value) / 45) % 8]; }
function sideLabel(delta: number) { return Math.abs(delta) < 8 ? "正面" : delta > 0 ? "右側" : "左側"; }
