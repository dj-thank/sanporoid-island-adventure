"use client";

/* eslint-disable @next/next/no-img-element, @next/next/no-html-link-for-pages -- copied Sanporoid WebPs and vinext hard navigation are intentional. */

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { islandsBySlug, type Island, type MapPoint } from "../discover/island-data";
import CesiumIslandMap from "./CesiumIslandMap";
import { formatDistance, haversineMeters } from "./geoMath";
import IslandFieldGuide from "./IslandFieldGuide";
import { answerFromExperiencePack, buildIslandLlmContext, enrichMapPointsWithResearch, officialAnchorMapPoints, type TripIslandSlug } from "./islandKnowledge";
import StarGuide from "./StarGuide";
import styles from "./adventure.module.css";

type Checkpoint = {
  id: string;
  island: TripIslandSlug;
  title: string;
  category: string;
  mission: string;
  photoPrompt: string;
  reward: string;
  position: [number, number];
  radiusMeters: number;
};

type PhotoEntry = {
  id: string;
  checkpointId: string;
  checkpointTitle: string;
  islandName: string;
  url: string;
  tag: string;
  color: string;
};

const appModes = [
  { id: "explore", label: "探索", eyebrow: "EXPLORE", icon: "⌖" },
  { id: "missions", label: "任務", eyebrow: "MISSIONS", icon: "◇" },
  { id: "stars", label: "星空", eyebrow: "STARS", icon: "✦" },
  { id: "guide", label: "案内", eyebrow: "GUIDE", icon: "◌" },
] as const;

type AppMode = (typeof appModes)[number]["id"];
const isNativeApp = import.meta.env.VITE_NATIVE_APP === "true";

const tripIslands: Array<{
  slug: TripIslandSlug;
  day: string;
  note: string;
  chapter: string;
  story: string;
  summary: string;
}> = [
  { slug: "kozushima", day: "8/29 · DAY 1", note: "天上山、水、星の痕跡", chapter: "CHAPTER 01", story: "導き", summary: "方角、空白、水の痕跡を読み、旅の星が向く先を決める。" },
  { slug: "niijima", day: "8/30 · DAY 2", note: "白い地質、モヤイ、風", chapter: "CHAPTER 02", story: "反響", summary: "同じ景色を違う視点で撮り、二枚の差から隠れた物語を開く。" },
  { slug: "shikinejima", day: "8/31 · DAY TRIP", note: "約束の章 · 16時に新島へ戻る", chapter: "CHAPTER 03", story: "約束", summary: "日帰りの制限時間までに三つの言葉を集め、旅の結末を選ぶ。" },
];

const checkpoints: Checkpoint[] = [
  { id: "kozu-tako", island: "kozushima", title: "多幸湾", category: "SEA", mission: "海の青を3段階に分ける", photoPrompt: "同じ海の中から、浅瀬・沖・空の三つの青を一枚に入れる。", reward: "潮色標本 No.01", position: [34.2218, 139.1602], radiusMeters: 700 },
  { id: "kozu-tenjo", island: "kozushima", title: "天上山の入口", category: "VOLCANO", mission: "白と黒が接する線を探す", photoPrompt: "白い砂地と黒い岩が切り替わる境界を撮る。危険区域へ入らない。", reward: "火山境界標本", position: [34.2255, 139.1444], radiusMeters: 900 },
  { id: "kozu-maehama", island: "kozushima", title: "前浜海岸", category: "SUNSET", mission: "夕日を撮らず、夕日に染まった物を撮る", photoPrompt: "船、壁、手、波など、夕日の反射だけを主役にする。", reward: "反射する夕方", position: [34.2097, 139.1327], radiusMeters: 650 },
  { id: "niijima-habushiura", island: "niijima", title: "羽伏浦海岸", category: "WHITE", mission: "新島の白を3種類集める", photoPrompt: "崖、砂、泡、建物から異なる白を一枚ずつ撮る。", reward: "白の三連作", position: [34.3802, 139.2818], radiusMeters: 900 },
  { id: "niijima-moyai", island: "niijima", title: "モヤイ像の丘", category: "FACE", mission: "モヤイと同じ表情になる", photoPrompt: "像を傷つけず、隣で表情だけを真似して撮る。", reward: "島の顔認証", position: [34.3728, 139.2517], radiusMeters: 500 },
  { id: "niijima-yunohama", island: "niijima", title: "湯の浜露天温泉", category: "STEAM", mission: "湯気の向きで風を読む", photoPrompt: "人を写さず、湯気・雲・旗など風向きが見えるものを撮る。", reward: "見えない風の写真", position: [34.3707, 139.2497], radiusMeters: 450 },
  { id: "shikine-tomari", island: "shikinejima", title: "泊海水浴場", category: "COVE", mission: "入り江の左右対称を崩すものを探す", photoPrompt: "丸い入り江の中で、船や岩など一つだけ違う形を見つける。", reward: "湾のノイズ", position: [34.3292, 139.214], radiusMeters: 550 },
  { id: "shikine-jinata", island: "shikinejima", title: "地鉈温泉", category: "EARTH", mission: "地球が湯を沸かす証拠を撮る", photoPrompt: "湯の色、岩の変色、湯気を、人を写さず安全な場所から撮る。", reward: "地球の体温", position: [34.3159, 139.2153], radiusMeters: 650 },
  { id: "shikine-path", island: "shikinejima", title: "島の小径", category: "TURN", mission: "曲がり角を5つ集める", photoPrompt: "同じ方向を向かず、道の曲がり方だけを5枚集める。私有地には入らない。", reward: "迷わない迷路", position: [34.3246, 139.2187], radiusMeters: 900 },
];

const palette = [
  { maxHue: 40, tag: "夕焼け鉱石", color: "#f15a3a" },
  { maxHue: 90, tag: "火山の硫黄色", color: "#e9ac77" },
  { maxHue: 175, tag: "島森の呼吸", color: "#6a9944" },
  { maxHue: 250, tag: "潮の記憶", color: "#6c9fb6" },
  { maxHue: 330, tag: "温泉の紫影", color: "#8a4d79" },
  { maxHue: 360, tag: "夕焼け鉱石", color: "#f15a3a" },
];

export default function AdventureApp() {
  const [activeMode, setActiveMode] = useState<AppMode>("explore");
  const [island, setIsland] = useState<TripIslandSlug>("kozushima");
  const [completed, setCompleted] = useState<string[]>([]);
  const [distances, setDistances] = useState<Record<string, number>>({});
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [locationMessage, setLocationMessage] = useState("現在地はまだ端末内で取得していません");
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const photoUrlsRef = useRef(new Set<string>());
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState("");
  const [selectedMapPoint, setSelectedMapPoint] = useState<MapPoint | null>(null);
  const [researchOpen, setResearchOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem("island-adventure-progress-v1") ?? "[]");
        if (Array.isArray(saved)) setCompleted(saved.filter((value): value is string => typeof value === "string"));
      } catch {
        // Corrupt local progress is ignored instead of leaving the app unusable.
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const nextUrls = new Set(photos.map((photo) => photo.url));
    photoUrlsRef.current.forEach((url) => { if (!nextUrls.has(url)) URL.revokeObjectURL(url); });
    photoUrlsRef.current = nextUrls;
  }, [photos]);

  useEffect(() => () => {
    photoUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const selectedIsland = islandsBySlug[island];
  const selectedTrip = tripIslands.find((entry) => entry.slug === island) ?? tripIslands[0];
  const selectedCheckpoints = useMemo(
    () => checkpoints.filter((checkpoint) => checkpoint.island === island).sort((a, b) => (distances[a.id] ?? Infinity) - (distances[b.id] ?? Infinity)),
    [distances, island],
  );
  const completedCount = selectedCheckpoints.filter((checkpoint) => completed.includes(checkpoint.id)).length;
  const nextCheckpoint = selectedCheckpoints.find((checkpoint) => !completed.includes(checkpoint.id)) ?? selectedCheckpoints[0];
  const mapPoints = useMemo(() => [...enrichMapPointsWithResearch(island, selectedIsland.spots), ...officialAnchorMapPoints(island)], [island, selectedIsland.spots]);
  const tideState = photos.length === 0 ? "未観測" : ["静潮", "逆潮", "星隠し"][photos.length % 3];
  const activeModeLabel = appModes.find((mode) => mode.id === activeMode)?.label ?? "探索";

  function activateMode(nextMode: AppMode) {
    setActiveMode(nextMode);
    window.requestAnimationFrame(() => {
      const target = document.getElementById(`mode-${nextMode}`);
      target?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }

  function locateNearby() {
    if (!navigator.geolocation) {
      setLocationMessage("この端末では現在地を利用できません。島の一覧はそのまま使えます。");
      return;
    }
    setLocationMessage("端末内で近いチェックポイントを計算しています…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCurrentPosition([coords.latitude, coords.longitude]);
        const next = Object.fromEntries(checkpoints.map((checkpoint) => [checkpoint.id, haversineMeters(coords.latitude, coords.longitude, ...checkpoint.position)]));
        setDistances(next);
        setLocationMessage("近い順に並べました。現在地の数値は保存・送信していません。");
      },
      () => setLocationMessage("現在地を取得できませんでした。権限を変えなくても一覧は使えます。"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    );
  }

  function confirmCheckpoint(checkpoint: Checkpoint) {
    const distance = distances[checkpoint.id];
    if (distance === undefined) {
      setLocationMessage("先に「近くを探す」で、端末内の距離を確認してください。");
      return;
    }
    if (distance > checkpoint.radiusMeters) {
      setLocationMessage(`${checkpoint.title}まではまだ約${formatDistance(distance)}。近づいてから到着確認できます。`);
      return;
    }
    const next = completed.includes(checkpoint.id) ? completed : [...completed, checkpoint.id];
    setCompleted(next);
    localStorage.setItem("island-adventure-progress-v1", JSON.stringify(next));
    setLocationMessage(`${checkpoint.title}を確認しました。写真ミッションが解放されました。`);
  }

  async function addPhoto(checkpoint: Checkpoint, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !file.type.startsWith("image/") || file.size > 15 * 1024 * 1024) return;
    const color = await averagePhotoColor(file);
    const hue = rgbToHue(color.r, color.g, color.b);
    const match = palette.find((entry) => hue <= entry.maxHue) ?? palette[0];
    setPhotos((current) => [{
      id: crypto.randomUUID(),
      checkpointId: checkpoint.id,
      checkpointTitle: checkpoint.title,
      islandName: selectedIsland.name,
      url: URL.createObjectURL(file),
      tag: match.tag,
      color: match.color,
    }, ...current].slice(0, 9));
  }

  async function askIsland(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const question = String(data.get("question") ?? "").trim();
    const apiKey = String(data.get("apiKey") ?? "").trim();
    const model = String(data.get("model") ?? "gpt-5.4-mini");
    if (!question) return;

    setAskError("");
    if (!apiKey) {
      setAnswer(offlineAnswer(question, selectedIsland));
      return;
    }

    setAsking(true);
    try {
      if (isNativeApp) {
        setAnswer(await askIslandFromNative(apiKey, model, island, question));
      } else {
        const response = await fetch("/api/island-guide", {
          method: "POST",
          headers: { "content-type": "application/json", "x-openai-api-key": apiKey },
          body: JSON.stringify({ island, question, model }),
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "島ガイドへ接続できませんでした");
        setAnswer(payload.answer);
      }
      const input = form.elements.namedItem("apiKey");
      if (input instanceof HTMLInputElement) input.value = "";
    } catch (cause) {
      setAskError(cause instanceof Error ? cause.message : "島ガイドへ接続できませんでした");
    } finally {
      setAsking(false);
    }
  }

  return (
    <main className={`${styles.appShell} ${activeMode === "stars" ? styles.starShell : ""}`}>
      <header className={styles.appHeader}>
        <button type="button" className={styles.brandButton} onClick={() => activateMode("explore")} aria-label="欠けた潮星の探索モードへ">
          <small>SANPOROID / ISLAND ADVENTURE</small>
          <strong>欠けた潮星</strong>
        </button>
        <nav className={styles.desktopModeNav} aria-label="アプリのモード">
          {appModes.map((mode) => <button type="button" key={mode.id} className={activeMode === mode.id ? styles.activeMode : ""} aria-current={activeMode === mode.id ? "page" : undefined} onClick={() => activateMode(mode.id)}><span aria-hidden="true">{mode.icon}</span><small>{mode.eyebrow}</small><strong>{mode.label}</strong></button>)}
        </nav>
        {!isNativeApp && <nav className={styles.utilityNav} aria-label="関連ページ">
          <a href="/">旅の予定</a>
          <a href="/discover">島の大特集</a>
          <span>LOCAL-FIRST PWA</span>
        </nav>}
      </header>

      <section className={styles.islandRail} aria-label="旅の章を選ぶ">
        {tripIslands.map((entry) => {
          const data = islandsBySlug[entry.slug];
          const isActive = island === entry.slug;
          return <button type="button" className={isActive ? styles.activeIsland : ""} aria-pressed={isActive} onClick={() => { setIsland(entry.slug); setSelectedMapPoint(null); setResearchOpen(false); }} key={entry.slug}><small>{entry.day}</small><strong>{data.name}</strong><span>{entry.story} · {entry.note}</span></button>;
        })}
      </section>

      <p className={styles.modeAnnouncer} aria-live="polite">{activeModeLabel}モードを表示中</p>

      <section id="mode-explore" className={styles.modePage} hidden={activeMode !== "explore"} tabIndex={-1} aria-labelledby="explore-title">
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p>三島航路譚 · 8/29 — 9/1</p>
            <h1 id="explore-title">欠けた潮星</h1>
            <strong>島の異変図鑑 · 神津島 → 新島 → 式根島</strong>
            <span>海底で三つに割れた「帰り潮の星」。神津島の導き、新島の反響、式根島の約束を、写真と会話で集める。</span>
            <div className={styles.heroActions}>
              <button type="button" onClick={locateNearby}>現在地から探索</button>
              <button type="button" onClick={() => activateMode("missions")}>写真任務を見る</button>
            </div>
          </div>
          <div className={styles.heroChapter}><small>{selectedTrip.chapter}</small><strong>{selectedIsland.name}｜{selectedTrip.story}</strong><span>{selectedTrip.summary}</span></div>
          <div className={styles.heroCompanion} aria-label="さんぽろいど">
            <img src="/sanporoid/avatar_idle_e_01.webp" alt="島を案内するさんぽろいど" />
            <img className={styles.heroShadow} src="/sanporoid/avatar_shadow_map_mode_tiny.webp" alt="" />
            <p>「島は、見つけた人ではなく、話した人に開く。」</p>
          </div>
        </header>

        <section className={styles.worldBrief} aria-label="欠けた潮星の世界観とゲームループ">
          <div className={styles.worldLead}>
            <small>GAME MANAGER / WORLD STATE</small>
            <h2>三つの欠片を、会話で星に戻す。</h2>
            <p>近くの安全な候補へ行く。役割で見る。写真を一枚撮る。仲間の言葉で島を変える。宝を持って次章へ進む。</p>
            <dl><div><dt>現在の章</dt><dd>{selectedIsland.name}｜{selectedTrip.story}</dd></div><div><dt>潮相</dt><dd>{tideState}</dd></div><div><dt>星の欠片</dt><dd>{completed.length} / {checkpoints.length}</dd></div></dl>
          </div>
          <details className={styles.worldDetails}>
            <summary><span><small>STORY & ROLE ARCHIVE</small><strong>三章の物語と役割カード</strong></span><b>開く</b></summary>
            <div className={styles.chapterGrid}>
              {tripIslands.map((entry) => <article key={entry.slug}><span>{entry.chapter}</span><h3>{islandsBySlug[entry.slug].name}｜{entry.story}</h3><p>{entry.summary}</p></article>)}
            </div>
            <div className={styles.roleRail}><span>ROLE CARDS</span>{["目印係", "観察係", "物語係", "記録係"].map((role, index) => <div key={role}><b>0{index + 1}</b><strong>{role}</strong><small>一人だけが持つ手掛かりを、会話で共有する</small></div>)}</div>
          </details>
        </section>

        <section className={styles.exploreWorkspace} aria-label={`${selectedIsland.name}を探索する`}>
          <div className={styles.mapPanel}>
            <div className={styles.mapHeading}>
              <div><small>SANPOROID MAP</small><h2>{selectedIsland.name}の冒険地図</h2><p>地図の地点、現在地、任務、公式情報を一つの探索面に重ねます。</p></div>
              <div><button type="button" onClick={locateNearby}>近くを探す</button><button type="button" className={styles.secondaryButton} aria-expanded={researchOpen} onClick={() => setResearchOpen((value) => !value)}>{researchOpen ? "調査ノートを閉じる" : "調査ノートを開く"}</button></div>
            </div>
            <div className={styles.mapWrapCesium}>
              <CesiumIslandMap
                key={selectedIsland.slug}
                center={selectedIsland.mapCenter}
                islandName={selectedIsland.name}
                points={mapPoints}
                currentPosition={currentPosition}
                onRequestLocation={locateNearby}
                onSelectionChange={setSelectedMapPoint}
              />
              <img className={styles.mapCompanion} src="/sanporoid/avatar_idle_e_01.webp" alt="地図のさんぽろいど" />
              <img className={styles.arrivalRing} src="/sanporoid/arrival_ring.webp" alt="" />
            </div>
            <div className={styles.locationStrip} role="status"><strong>端末内の現在地</strong><span>{locationMessage}</span></div>
            <p className={styles.privacyNote}>正確な現在地は端末内の距離計算だけに使い、サイト・Bot・OpenAIへ送りません。</p>
          </div>

          <aside className={styles.nowPanel} aria-labelledby="explore-now-title">
            <small>EXPLORE THIS ISLAND NOW</small>
            <h2 id="explore-now-title">いま、何を見る？</h2>
            {selectedMapPoint ? <article className={styles.mapSelectionSummary}><span>MAP SELECTION</span><h3>{selectedMapPoint.title}</h3><p>{selectedMapPoint.summary}</p><button type="button" onClick={() => setResearchOpen(true)}>根拠と注意を読む</button></article> : <p className={styles.selectionPrompt}>地図上の地点か、地図下の地点レールを選ぶと、現行注意と調査根拠が開きます。</p>}
            {nextCheckpoint && <article className={styles.nextMission}>
              <div><small>NEXT PHOTO MISSION</small><b>{distances[nextCheckpoint.id] === undefined ? "距離未確認" : formatDistance(distances[nextCheckpoint.id])}</b></div>
              <h3>{nextCheckpoint.title}</h3>
              <strong>{nextCheckpoint.mission}</strong>
              <p>{nextCheckpoint.photoPrompt}</p>
              <button type="button" onClick={() => activateMode("missions")}>任務の操作を開く</button>
            </article>}
            <dl className={styles.nowStats}><div><dt>この島の任務</dt><dd>{completedCount} / {selectedCheckpoints.length}</dd></div><div><dt>図鑑標本</dt><dd>{photos.filter((photo) => photo.islandName === selectedIsland.name).length}</dd></div><div><dt>事実と物語</dt><dd>分離表示</dd></div></dl>
          </aside>

          <div className={styles.fieldGuideSlot}>
            <IslandFieldGuide key={island} island={island} islandName={selectedIsland.name} currentPosition={currentPosition} selectedPoint={selectedMapPoint} open={researchOpen} onOpenChange={setResearchOpen} />
          </div>
        </section>

        <footer className={styles.footer}><img src="/sanporoid/avatar_treasure_01.webp" alt="宝箱を見つけたさんぽろいど" /><div><strong>旅は、行った場所の数ではなく、見つけた証拠で残る。</strong><p>運航、海況、立入、温泉、宿泊は現地掲示と公式案内を優先してください。</p></div></footer>
      </section>

      <section id="mode-missions" className={`${styles.modePage} ${styles.missionMode}`} hidden={activeMode !== "missions"} tabIndex={-1} aria-labelledby="missions-title">
        <div className={styles.modeFrame}>
          <header className={styles.modeIntro}>
            <div><small>PHOTO ODDITY MISSIONS</small><h2 id="missions-title">{selectedIsland.name}の観測任務</h2><p>到着は端末内の距離だけで確認。解放後の写真も端末内で平均色を解析し、外部へ送信しません。</p></div>
            <div className={styles.modeStats}><strong>{completedCount} / {selectedCheckpoints.length}</strong><span>この島の到着確認</span><button type="button" onClick={locateNearby}>近い順に更新</button></div>
          </header>
          <div className={styles.missionStatus} role="status"><strong>現在地ステータス</strong><span>{locationMessage}</span></div>

          <section className={styles.missionPanel} aria-labelledby="checkpoint-title">
            <header><div><small>NEARBY CHECKPOINTS</small><h2 id="checkpoint-title">近くのチェックポイント</h2></div><span>{completedCount} / {selectedCheckpoints.length}</span></header>
            <div className={styles.checkpointList}>
              {selectedCheckpoints.map((checkpoint, index) => {
                const isComplete = completed.includes(checkpoint.id);
                const distance = distances[checkpoint.id];
                return <article className={isComplete ? styles.completed : ""} key={checkpoint.id}>
                  <div className={styles.checkpointTop}><span>0{index + 1} · {checkpoint.category}</span><b>{distance === undefined ? "距離未確認" : formatDistance(distance)}</b></div>
                  <h3>{checkpoint.title}</h3><strong>{checkpoint.mission}</strong><p>{checkpoint.photoPrompt}</p>
                  <div className={styles.checkpointActions}>
                    <button type="button" onClick={() => confirmCheckpoint(checkpoint)}>{isComplete ? "到着済み" : "到着を確認"}</button>
                    <label className={isComplete ? "" : styles.locked}>写真を撮る<input type="file" accept="image/*" capture="environment" disabled={!isComplete} onChange={(event) => void addPhoto(checkpoint, event)} /></label>
                  </div>
                  <small className={styles.reward}>REWARD · {checkpoint.reward}</small>
                </article>;
              })}
            </div>
          </section>

          <section className={styles.photoLab} aria-labelledby="photo-lab-title">
            <header><div><small>PHOTO ODDITY LAB</small><h2 id="photo-lab-title">島の異変図鑑</h2></div><p>写真は端末内だけで解析。平均色から、旅にしか存在しない“異変名”をつけます。画像はアップロードしません。</p></header>
            {photos.length === 0 ? <div className={styles.photoEmpty}><img src="/sanporoid/avatar_treasure_01.webp" alt="宝箱を見つけたさんぽろいど" /><p>チェックポイントへ到着すると写真ミッションが解放されます。<br />海、岩、湯気、道の曲がり方が図鑑の標本になります。</p></div> : <div className={styles.photoGrid}>{photos.map((photo) => <figure key={photo.id} style={{ "--oddity-color": photo.color } as React.CSSProperties}><img src={photo.url} alt={`${photo.checkpointTitle}で撮った標本`} /><figcaption><small>{photo.islandName} · {photo.checkpointTitle}</small><strong>{photo.tag}</strong><span>ISLAND EVIDENCE / LOCAL ONLY</span></figcaption></figure>)}</div>}
          </section>
        </div>
      </section>

      <section id="mode-stars" className={`${styles.modePage} ${styles.starMode}`} hidden={activeMode !== "stars"} tabIndex={-1} aria-label={`${selectedIsland.name}の星空モード`}>
        <StarGuide key={selectedIsland.slug} fallbackPosition={selectedIsland.mapCenter} islandName={selectedIsland.name} />
      </section>

      <section id="mode-guide" className={`${styles.modePage} ${styles.guideMode}`} hidden={activeMode !== "guide"} tabIndex={-1} aria-labelledby="guide-title">
        <div className={styles.modeFrame}>
          <header className={styles.modeIntro}>
            <div><small>LOCAL-FIRST ISLAND GUIDE</small><h2 id="guide-title">{selectedIsland.name}のことを聞く</h2><p>まず19件の調査候補と12件の現行公式情報を含む端末内データから回答し、必要な一回だけ任意でOpenAIへ接続します。</p></div>
            <div className={styles.guideBoundary}><strong>事実と物語は分離</strong><span>運航・営業・安全は回答だけで確定せず、公式案内と現地掲示を優先。</span></div>
          </header>

          <section className={styles.guideSection}>
            <div className={styles.guideIntro}><small>ISLAND GUIDE LLM</small><h2>島のことを聞く</h2><p>アプリ内の島情報を先に使い、APIキーが入力された一回だけOpenAIへ問い合わせます。APIキーは保存しません。</p><dl><div><dt>位置情報</dt><dd>送信しない</dd></div><div><dt>写真</dt><dd>送信しない</dd></div><div><dt>APIキー</dt><dd>保存しない</dd></div></dl></div>
            <form onSubmit={askIsland} className={styles.guideForm}>
              <label>質問<textarea name="question" required rows={4} placeholder={`${selectedIsland.name}で雨の日にできることは？`} /></label>
              <div><label>OpenAI APIキー（任意）<input name="apiKey" type="password" autoComplete="off" placeholder="入力しなければローカル回答" /></label><label>モデル<select name="model" defaultValue="gpt-5.6-luna"><option>gpt-5.6-luna</option><option>gpt-5.6-terra</option><option>gpt-5.4-mini</option></select></label></div>
              <p>{isNativeApp ? "キーはこの入力欄と端末からOpenAIへの一回の通信だけで使い、端末保存・サイト・ログへ残しません。" : "キーはこの入力欄と一回の通信だけで使い、ブラウザ保存・D1・R2・ログへ残しません。公開アクセスでは利用せず、ChatGPTサインイン済みの所有者だけが接続できます。"}</p>
              <button disabled={asking}>{asking ? "島へ聞いています…" : "島ガイドに聞く"}</button>
              {askError && <p className={styles.error} role="alert">{askError}</p>}
            </form>
            <div className={styles.answer} aria-live="polite">{answer || `例：${selectedIsland.name}の成り立ち、写真ミッション、安全な回り方を聞けます。`}</div>
          </section>
        </div>
      </section>

      <nav className={styles.mobileBottomNav} aria-label="モバイルのモード切替">
        {appModes.map((mode) => <button type="button" key={mode.id} className={activeMode === mode.id ? styles.activeMode : ""} aria-current={activeMode === mode.id ? "page" : undefined} aria-label={`${mode.label}モードを開く`} onClick={() => activateMode(mode.id)}><span aria-hidden="true">{mode.icon}</span><small>{mode.eyebrow}</small><strong>{mode.label}</strong></button>)}
      </nav>
    </main>
  );
}

async function askIslandFromNative(apiKey: string, model: string, island: TripIslandSlug, question: string) {
  if (!/^sk-[A-Za-z0-9_-]{16,240}$/.test(apiKey)) throw new Error("OpenAI APIキーを確認してください");
  const { Capacitor, CapacitorHttp } = await import("@capacitor/core");
  if (!Capacitor.isNativePlatform()) throw new Error("ネイティブHTTPを利用できません");
  const response = await CapacitorHttp.request({
    method: "POST",
    url: "https://api.openai.com/v1/responses",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    data: {
      model,
      store: false,
      max_output_tokens: 700,
      instructions: "あなたは友達旅行の島ガイドです。提供された島データだけを根拠に日本語で簡潔に答えてください。事実、提案、創作を明確に分け、運航・天候・海況・立入・営業・宿泊は当日の公式情報を優先すると必ず伝えてください。危険区域、私有地、野宿、無断撮影を勧めないでください。分からないことは分からないと答えてください。",
      input: `端末内の島データ:\n${buildIslandLlmContext(island)}\n\n質問:\n${question.slice(0, 600)}`,
    },
    connectTimeout: 20_000,
    readTimeout: 60_000,
  });
  const payload = typeof response.data === "string" ? JSON.parse(response.data) : response.data as { output_text?: string; output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
  if (response.status < 200 || response.status >= 300) {
    if (response.status === 401 || response.status === 403) throw new Error("APIキーまたはモデルの利用権限を確認してください");
    if (response.status === 429) throw new Error("APIの利用上限に達しました。少し待ってください");
    throw new Error("島ガイドの応答を受け取れませんでした");
  }
  const answer = payload.output_text?.trim() || payload.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text?.trim();
  if (!answer) throw new Error("島ガイドの回答が空でした");
  return answer;
}

async function averagePhotoColor(file: File) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return { r: 108, g: 159, b: 182 };
  context.drawImage(bitmap, 0, 0, 32, 32);
  bitmap.close();
  const pixels = context.getImageData(0, 0, 32, 32).data;
  let r = 0; let g = 0; let b = 0; let count = 0;
  for (let index = 0; index < pixels.length; index += 16) {
    if (pixels[index + 3] < 128) continue;
    r += pixels[index]; g += pixels[index + 1]; b += pixels[index + 2]; count += 1;
  }
  return count ? { r: r / count, g: g / count, b: b / count } : { r: 108, g: 159, b: 182 };
}

function rgbToHue(r: number, g: number, b: number) {
  const red = r / 255; const green = g / 255; const blue = b / 255;
  const max = Math.max(red, green, blue); const min = Math.min(red, green, blue); const delta = max - min;
  if (delta === 0) return 210;
  if (max === red) return ((green - blue) / delta * 60 + 360) % 360;
  if (max === green) return ((blue - red) / delta + 2) * 60;
  return ((red - green) / delta + 4) * 60;
}

function offlineAnswer(question: string, island: Island) {
  if (island.slug === "kozushima" || island.slug === "niijima" || island.slug === "shikinejima") {
    return answerFromExperiencePack(question, island.slug);
  }
  const lower = question.toLowerCase();
  if (/雨|天気|風/.test(question)) return `${island.name}では、${island.conditionPlans.map((plan) => `${plan.label}なら「${plan.title}」`).join("、")}が候補です。当日の運航・立入・営業情報を優先してください。`;
  if (/食|ごはん|料理|名物/.test(question)) return `${island.name}の候補は、${island.food.slice(0, 4).map((item) => item.title).join("、")}です。営業日と売切れは現地で確認してください。`;
  if (/歴史|地質|火山|なぜ/.test(question) || lower.includes("why")) return `${island.name}では「${island.coverLine}」が旅の入口です。${island.shortIntro} 詳しくは島の大特集を開いてください。`;
  return `${island.name}でおすすめしたいのは、${island.friendMissions.map((mission) => mission.title).join("、")}です。これは端末内の島データによるオフライン回答です。`;
}
