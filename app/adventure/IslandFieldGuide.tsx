"use client";

import { useMemo, useState } from "react";
import { formatDistance, haversineMeters } from "./geoMath";
import { anchorsFor, currentFactsFor, experiencesFor, islandCurrentFacts, islandExperiencePack, type TripIslandSlug } from "./islandKnowledge";
import styles from "./island-field-guide.module.css";

const hazardNames: Record<string, string> = {
  coast: "海岸", high_waves: "高波", slippery: "滑りやすい", strong_wind: "強風", darkness: "暗所",
  few_streetlights: "街灯少", steep_slope: "急坂", road_traffic: "車道", heat: "暑熱", stairs: "階段",
  bus_gap: "バス接続", facility_closure: "休館", port_switch: "着岸港変更", luggage: "荷物", departure_cutoff: "帰路時刻",
};

export default function IslandFieldGuide({ island, islandName, currentPosition }: { island: TripIslandSlug; islandName: string; currentPosition: [number, number] | null }) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const entries = experiencesFor(island);
  const currentFacts = currentFactsFor(island);
  const anchors = anchorsFor(island);
  const visibleEntries = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter((entry) => [entry.title, ...entry.orderedStops, ...entry.supportedFacts, ...entry.bestFit].join(" ").toLowerCase().includes(needle));
  }, [entries, query]);
  const displayedEntries = query.trim() || showAll ? visibleEntries : visibleEntries.slice(0, 3);

  return (
    <section className={styles.fieldGuide} aria-labelledby="field-guide-title">
      <header>
        <div><small>SANPOROID ISLAND INTELLIGENCE</small><h2 id="field-guide-title">{islandName} 開拓フィールドノート</h2><p>全国・関東散歩カタログから抽出した3島計{islandExperiencePack.experienceCount}件のうち、{islandName}の{entries.length}件を収録。公式根拠と未確認ゲートを一緒に表示します。</p></div>
        <label>地点・温泉・海岸を検索<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例：温泉、港、夕景" /></label>
      </header>
      <div className={styles.safetyBand} role="note"><strong>候補 ≠ 安全確認済みルート</strong><span>当日の運航・着岸港・通行止め・天候・海況・潮位・営業・歩行入口を再確認してください。位置情報は近さの計算にだけ使用します。</span></div>
      <div className={styles.currentGrid} aria-label={`${islandName}の現行公式情報`}>
        {currentFacts.map((entry) => <article key={entry.id}><small>{entry.category} · CHECKED {islandCurrentFacts.checkedAt}</small><strong>{entry.title}</strong><ul>{entry.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul><p>{entry.cautions.join(" / ")}</p><div>{entry.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label}</a>)}</div></article>)}
      </div>
      {anchors.length > 0 && <div className={styles.anchorRail} aria-label="公式座標アンカー">
        {anchors.map((anchor) => <article key={anchor.id}><small>OFFICIAL OPEN DATA</small><strong>{anchor.name}</strong><span>{currentPosition ? `現在地から約${formatDistance(haversineMeters(...currentPosition, ...(anchor.position as [number, number])))} · ` : ""}目的地点座標（入口ではありません）</span><a href={anchor.source.url} target="_blank" rel="noreferrer">出典を見る</a></article>)}
      </div>}
      <div className={styles.experienceGrid}>
        {displayedEntries.map((entry) => <details key={entry.id} className={styles.experienceCard}>
          <summary><span><small>{entry.officialRouteClaim ? "OFFICIAL MODEL ROUTE" : "EVIDENCE-BACKED CANDIDATE"}</small><strong>{entry.title}</strong></span><b>当日確認</b></summary>
          <div className={styles.cardBody}>
            <div><h3>順番の候補</h3><ol>{entry.orderedStops.map((stop, index) => <li key={`${stop}-${index}`}>{stop}</li>)}</ol></div>
            <div><h3>一次情報で確認できたこと</h3>{entry.supportedFacts.length ? <ul>{entry.supportedFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul> : <p>候補地点の公式情報のみ。連続ルートは未確認です。</p>}</div>
            <div className={styles.warning}><h3>まだ確認が必要</h3><ul>{entry.constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}</ul><p>{entry.sharedTransportGate}</p></div>
            {entry.hazards.length > 0 && <div className={styles.tags}>{entry.hazards.map((hazard) => <span key={hazard}>{hazardNames[hazard] ?? hazard}</span>)}</div>}
            <div className={styles.sources}>{entry.officialSources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.authority}</a>)}<small>調査確認日 {entry.sourceCheckedAt ?? "未記録"}</small></div>
          </div>
        </details>)}
      </div>
      {!query.trim() && visibleEntries.length > 3 && <button className={styles.showAllButton} type="button" aria-expanded={showAll} onClick={() => setShowAll((value) => !value)}>{showAll ? "候補を3件に戻す" : `残り${visibleEntries.length - 3}件も表示`}</button>}
      {visibleEntries.length === 0 && <p className={styles.empty}>一致する候補はありません。検索語を短くしてください。</p>}
    </section>
  );
}
