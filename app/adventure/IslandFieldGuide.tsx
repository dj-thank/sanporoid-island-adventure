"use client";

import { type KeyboardEvent, useMemo, useState } from "react";
import type { MapPoint } from "../discover/island-data";
import { formatDistance, haversineMeters } from "./geoMath";
import { anchorsFor, currentFactsFor, deepKnowledgeFor, experiencesFor, islandCurrentFacts, islandDeepKnowledge, islandExperiencePack, type TripIslandSlug } from "./islandKnowledge";
import styles from "./island-field-guide.module.css";

const hazardNames: Record<string, string> = {
  coast: "海岸", high_waves: "高波", slippery: "滑りやすい", strong_wind: "強風", darkness: "暗所",
  few_streetlights: "街灯少", steep_slope: "急坂", road_traffic: "車道", heat: "暑熱", stairs: "階段",
  bus_gap: "バス接続", facility_closure: "休館", port_switch: "着岸港変更", luggage: "荷物", departure_cutoff: "帰路時刻",
};

type GuideView = "current" | "deep" | "research" | "anchors";
const guideViews: GuideView[] = ["current", "deep", "research", "anchors"];

type Props = {
  island: TripIslandSlug;
  islandName: string;
  currentPosition: [number, number] | null;
  selectedPoint: MapPoint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function IslandFieldGuide({ island, islandName, currentPosition, selectedPoint, open, onOpenChange }: Props) {
  const [query, setQuery] = useState("");
  const [activeView, setActiveView] = useState<GuideView>("current");
  const entries = experiencesFor(island);
  const currentFacts = currentFactsFor(island);
  const themes = deepKnowledgeFor(island);
  const anchors = anchorsFor(island);
  const visibleEntries = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter((entry) => [entry.title, ...entry.orderedStops, ...entry.supportedFacts, ...entry.bestFit].join(" ").toLowerCase().includes(needle));
  }, [entries, query]);
  const panelId = `field-guide-panel-${island}`;

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, view: GuideView) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = guideViews.indexOf(view);
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? guideViews.length - 1 : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + guideViews.length) % guideViews.length;
    const nextView = guideViews[nextIndex] ?? "current";
    setActiveView(nextView);
    window.requestAnimationFrame(() => document.getElementById(`field-guide-${nextView}-tab-${island}`)?.focus());
  }

  return (
    <section className={styles.fieldGuide} aria-labelledby="field-guide-title">
      <header>
        <div>
          <small>SHIOBOSHI ISLAND INTELLIGENCE</small>
          <h2 id="field-guide-title">{islandName} 開拓フィールドノート</h2>
          <p>地図で選んだ地点を入口に、現行公式情報・地質から暮らしまでの深層知識・公式座標・3島計{islandExperiencePack.experienceCount}件の調査候補を分けて確認します。</p>
        </div>
        <div className={styles.guideHeaderActions}>
          <dl><div><dt>公式情報</dt><dd>{currentFacts.length}</dd></div><div><dt>深層テーマ</dt><dd>{themes.length}</dd></div><div><dt>調査候補</dt><dd>{entries.length}</dd></div><div><dt>確認日</dt><dd>{islandCurrentFacts.checkedAt}</dd></div></dl>
          <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => onOpenChange(!open)}>{open ? "調査レイヤーを閉じる" : "島の調査レイヤーを開く"}</button>
        </div>
      </header>

      <div className={styles.safetyBand} role="note"><strong>候補 ≠ 安全確認済みルート</strong><span>当日の運航・着岸港・通行止め・天候・海況・潮位・営業・歩行入口を再確認してください。位置情報は近さの計算にだけ使用します。</span></div>

      <div id={panelId} className={styles.guideBody} hidden={!open}>
        {selectedPoint ? <article className={styles.contextCard} aria-label={`${selectedPoint.title}の地図連動情報`}>
          <header><div><small>MAP-LINKED CONTEXT · {selectedPoint.label}</small><h3>{selectedPoint.title}</h3></div><span>地図選択中</span></header>
          <p>{selectedPoint.summary}</p>
          <div className={styles.contextColumns}>
            <div><strong>確認できたこと</strong>{selectedPoint.researchedFacts?.length ? <ul>{selectedPoint.researchedFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul> : <p>地点の基本情報のみです。</p>}</div>
            <div className={styles.contextWarning}><strong>当日確認</strong><ul>{(selectedPoint.cautions ?? ["運航・通行・天候・営業を公式案内で確認"]).map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>
          {selectedPoint.sources?.length ? <div className={styles.contextSources}>{selectedPoint.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label} ↗</a>)}</div> : null}
        </article> : <div className={styles.contextEmpty}><strong>地図と連動します</strong><span>地点を選ぶと、その場所に接続された事実・注意・出典を最初に表示します。</span></div>}

        <div className={styles.guideTabs} role="tablist" aria-label="調査ノートの種類">
          <button id={`field-guide-current-tab-${island}`} type="button" role="tab" aria-selected={activeView === "current"} aria-controls={`field-guide-current-${island}`} tabIndex={activeView === "current" ? 0 : -1} className={activeView === "current" ? styles.activeTab : ""} onKeyDown={(event) => moveTab(event, "current")} onClick={() => setActiveView("current")}><small>CURRENT</small><strong>今日の公式情報</strong><span>{currentFacts.length}件</span></button>
          <button id={`field-guide-deep-tab-${island}`} type="button" role="tab" aria-selected={activeView === "deep"} aria-controls={`field-guide-deep-${island}`} tabIndex={activeView === "deep" ? 0 : -1} className={activeView === "deep" ? styles.activeTab : ""} onKeyDown={(event) => moveTab(event, "deep")} onClick={() => setActiveView("deep")}><small>UNDERSTAND</small><strong>島を理解する</strong><span>{themes.length}件</span></button>
          <button id={`field-guide-research-tab-${island}`} type="button" role="tab" aria-selected={activeView === "research"} aria-controls={`field-guide-research-${island}`} tabIndex={activeView === "research" ? 0 : -1} className={activeView === "research" ? styles.activeTab : ""} onKeyDown={(event) => moveTab(event, "research")} onClick={() => setActiveView("research")}><small>RESEARCH</small><strong>調査候補</strong><span>{entries.length}件</span></button>
          <button id={`field-guide-anchors-tab-${island}`} type="button" role="tab" aria-selected={activeView === "anchors"} aria-controls={`field-guide-anchors-${island}`} tabIndex={activeView === "anchors" ? 0 : -1} className={activeView === "anchors" ? styles.activeTab : ""} onKeyDown={(event) => moveTab(event, "anchors")} onClick={() => setActiveView("anchors")}><small>COORDINATES</small><strong>公式座標</strong><span>{anchors.length}件</span></button>
        </div>

        <section id={`field-guide-current-${island}`} className={styles.tabPanel} role="tabpanel" aria-labelledby={`field-guide-current-tab-${island}`} hidden={activeView !== "current"}>
          <div className={styles.panelIntro}><div><small>OFFICIAL CURRENT FACTS</small><h3>{islandName}の現行公式情報</h3></div><span>CHECKED {islandCurrentFacts.checkedAt}</span></div>
          <div className={styles.currentGrid} aria-label={`${islandName}の現行公式情報`}>
            {currentFacts.map((entry) => <details className={styles.currentCard} key={entry.id}>
              <summary><span><small>{entry.category} · CHECKED {islandCurrentFacts.checkedAt}</small><strong>{entry.title}</strong></span><b>公式</b></summary>
              <div className={styles.currentBody}><ul>{entry.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul><p>{entry.cautions.join(" / ")}</p><div>{entry.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label} ↗</a>)}</div></div>
            </details>)}
          </div>
        </section>

        <section id={`field-guide-deep-${island}`} className={styles.tabPanel} role="tabpanel" aria-labelledby={`field-guide-deep-tab-${island}`} hidden={activeView !== "deep"}>
          <div className={styles.panelIntro}><div><small>DEEP ISLAND KNOWLEDGE</small><h3>地質から暮らしまで、島をつなげて読む</h3></div><span>CHECKED {islandDeepKnowledge.checkedAt}</span></div>
          <div className={styles.deepGrid} aria-label={`${islandName}の深層知識`}>
            {themes.map((theme) => <details className={styles.deepCard} key={theme.id}>
              <summary><span><small>{theme.category}</small><strong>{theme.title}</strong></span><b>理解</b></summary>
              <div className={styles.deepBody}>
                <p>{theme.summary}</p>
                <div><strong>確認できたこと</strong><ul>{theme.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul></div>
                <div className={styles.deepWarning}><strong>現地で守ること</strong><ul>{theme.cautions.map((caution) => <li key={caution}>{caution}</li>)}</ul></div>
                <nav>{theme.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label} ↗</a>)}</nav>
              </div>
            </details>)}
          </div>
        </section>

        <section id={`field-guide-research-${island}`} className={styles.tabPanel} role="tabpanel" aria-labelledby={`field-guide-research-tab-${island}`} hidden={activeView !== "research"}>
          <div className={styles.panelIntro}>
            <div><small>EVIDENCE-BACKED CANDIDATES</small><h3>調査候補を絞り込む</h3></div>
            <label>地点・温泉・海岸を検索<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例：温泉、港、夕景" /></label>
          </div>
          <div className={styles.experienceGrid}>
            {visibleEntries.map((entry) => <details key={entry.id} className={styles.experienceCard}>
              <summary><span><small>{entry.officialRouteClaim ? "OFFICIAL MODEL ROUTE" : "EVIDENCE-BACKED CANDIDATE"}</small><strong>{entry.title}</strong></span><b>当日確認</b></summary>
              <div className={styles.cardBody}>
                <div><h3>順番の候補</h3><ol>{entry.orderedStops.map((stop, index) => <li key={`${stop}-${index}`}>{stop}</li>)}</ol></div>
                <div><h3>一次情報で確認できたこと</h3>{entry.supportedFacts.length ? <ul>{entry.supportedFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul> : <p>候補地点の公式情報のみ。連続ルートは未確認です。</p>}</div>
                <div className={styles.warning}><h3>まだ確認が必要</h3><ul>{entry.constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}</ul><p>{entry.sharedTransportGate}</p></div>
                {entry.hazards.length > 0 && <div className={styles.tags}>{entry.hazards.map((hazard) => <span key={hazard}>{hazardNames[hazard] ?? hazard}</span>)}</div>}
                <div className={styles.sources}>{entry.officialSources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.authority} ↗</a>)}<small>調査確認日 {entry.sourceCheckedAt ?? "未記録"}</small></div>
              </div>
            </details>)}
          </div>
          {visibleEntries.length === 0 && <p className={styles.empty}>一致する候補はありません。検索語を短くしてください。</p>}
        </section>

        <section id={`field-guide-anchors-${island}`} className={styles.tabPanel} role="tabpanel" aria-labelledby={`field-guide-anchors-tab-${island}`} hidden={activeView !== "anchors"}>
          <div className={styles.panelIntro}><div><small>OFFICIAL OPEN DATA</small><h3>目的地点の公式座標</h3></div><span>入口・経路ではありません</span></div>
          {anchors.length > 0 ? <div className={styles.anchorRail} aria-label="公式座標アンカー">
            {anchors.map((anchor) => <article key={anchor.id}><small>OFFICIAL OPEN DATA</small><strong>{anchor.name}</strong><span>{currentPosition ? `現在地から約${formatDistance(haversineMeters(...currentPosition, ...(anchor.position as [number, number])))} · ` : ""}目的地点座標（入口ではありません）</span><a href={anchor.source.url} target="_blank" rel="noreferrer">出典を見る ↗</a></article>)}
          </div> : <p className={styles.empty}>この島の公式座標アンカーは収録されていません。</p>}
        </section>
      </div>
    </section>
  );
}
