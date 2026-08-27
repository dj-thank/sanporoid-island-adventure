import type { MapPoint } from "../discover/island-data";
import currentFacts from "./island-current-facts.json";
import pack from "./island-experience-pack.json";

export type TripIslandSlug = "kozushima" | "niijima" | "shikinejima";

export type IslandExperience = (typeof pack.experiences)[number];
export type IslandAnchor = (typeof pack.anchors)[number];

const islandNames: Record<TripIslandSlug, string> = {
  kozushima: "神津島",
  niijima: "新島",
  shikinejima: "式根島",
};

export const islandExperiencePack = pack;
export const islandCurrentFacts = currentFacts;

export function experiencesFor(slug: TripIslandSlug) {
  return pack.experiences.filter((entry) => entry.island === islandNames[slug]);
}

export function anchorsFor(slug: TripIslandSlug) {
  return pack.anchors.filter((entry) => entry.island === islandNames[slug]);
}

export function currentFactsFor(slug: TripIslandSlug) {
  return currentFacts.facts.filter((entry) => entry.island === islandNames[slug]);
}

export function officialAnchorMapPoints(slug: TripIslandSlug): MapPoint[] {
  return anchorsFor(slug).map((entry) => ({
    id: entry.id,
    title: entry.name,
    label: "OFFICIAL DATA",
    position: entry.position as [number, number],
    summary: `公式オープンデータの目的地点。入口・営業・歩行経路は当日確認が必要です。${entry.source.provider}`,
    researchedFacts: [`${entry.source.provider}の公開座標`, `精度: ${entry.precision}`],
    cautions: ["目的地点であり入口ではない", "営業・通行・歩行経路は未確認"],
    sources: [{ label: entry.source.provider, url: entry.source.url }],
  }));
}

export function enrichMapPointsWithResearch(slug: TripIslandSlug, points: MapPoint[]): MapPoint[] {
  const experiences = experiencesFor(slug);
  const operations = currentFactsFor(slug);
  return points.map((point) => {
    const matches = experiences.filter((entry) => entry.orderedStops.some((stop) => namesOverlap(stop, point.title)));
    const operationMatches = operations.filter((entry) => entry.relatedNames.some((name) => namesOverlap(name, point.title)));
    if (!matches.length && !operationMatches.length) return point;
    const researchedFacts = unique([...operationMatches.flatMap((entry) => entry.facts), ...matches.flatMap((entry) => entry.supportedFacts)]).slice(0, 8);
    const cautions = unique([...operationMatches.flatMap((entry) => entry.cautions), ...matches.flatMap((entry) => entry.constraints)]).slice(0, 8);
    const sources = uniqueByUrl([
      ...operationMatches.flatMap((entry) => entry.sources),
      ...matches.flatMap((entry) => entry.officialSources.map((source) => ({ label: source.authority, url: source.url }))),
    ]);
    return {
      ...point,
      summary: `${point.summary} ${operationMatches.length ? `現行公式情報${operationMatches.length}件` : ""}${matches.length ? `・Sanporoid調査候補${matches.length}件` : ""}を接続しています。`,
      researchedFacts,
      cautions: cautions.length ? cautions : ["運航・通行・天候・営業を当日に確認"],
      sources,
    };
  });
}

function namesOverlap(left: string, right: string) {
  const normalize = (value: string) => value.replace(/[\s・（）()]/g, "").replace(/神津島観光協会|公式|周辺|入口/g, "");
  const a = normalize(left);
  const b = normalize(right);
  return a.includes(b) || b.includes(a);
}

function unique(values: string[]) { return [...new Set(values)]; }
function uniqueByUrl(values: Array<{ label: string; url: string }>) { return [...new Map(values.map((value) => [value.url, value])).values()]; }

export function answerFromExperiencePack(question: string, slug: TripIslandSlug) {
  const entries = experiencesFor(slug);
  const operations = currentFactsFor(slug);
  const normalized = question.toLowerCase();
  const tokens = question.split(/[\s、。・についてをでのはが]+/).filter((token) => token.length >= 2);
  const currentMatches = operations.map((entry) => {
    const searchable = [entry.category, entry.title, ...entry.facts, ...entry.cautions].join(" ").toLowerCase();
    const intentWords = ["キャンプ", "野営", "宿泊", "星", "夜", "温泉", "診療", "病院", "防災", "津波", "山", "通行", "海", "夏", "文化", "ガラス", "雨"];
    const score = tokens.reduce((total, token) => total + (searchable.includes(token.toLowerCase()) ? 4 : 0), 0)
      + intentWords.reduce((total, word) => total + (normalized.includes(word) && searchable.includes(word) ? 8 : 0), 0);
    return { entry, score };
  }).filter(({ score }) => score > 0).sort((left, right) => right.score - left.score).slice(0, 2);
  const scored = entries.map((entry) => {
    const searchable = [entry.title, ...entry.orderedStops, ...entry.supportedFacts, ...entry.bestFit].join(" ").toLowerCase();
    const score = tokens.reduce((total, token) => total + (searchable.includes(token.toLowerCase()) ? 3 : 0), 0)
      + (normalized.includes("雨") && entry.bestFit.includes("rain") ? 5 : 0)
      + (normalized.includes("温泉") && entry.bestFit.includes("onsen") ? 5 : 0)
      + (normalized.includes("写真") && entry.bestFit.includes("photography") ? 5 : 0)
      + (normalized.includes("歩") && entry.walking?.status ? 1 : 0);
    return { entry, score };
  }).sort((left, right) => right.score - left.score);

  const selected = scored.filter(({ score }) => score > 0).slice(0, 3);
  const candidates = selected.length ? selected : scored.slice(0, 3);
  const body = candidates.map(({ entry }) => {
    const facts = entry.supportedFacts.length ? `確認済みの根拠: ${entry.supportedFacts.join("、")}。` : "公式情報は候補地点単位です。";
    const constraints = entry.constraints.length ? `注意: ${entry.constraints.join("、")}。` : "当日の状況確認が必要です。";
    return `・${entry.title}\n  ${facts}${constraints}`;
  }).join("\n");
  const currentSection = currentMatches.length ? `【${islandCurrentFacts.checkedAt}確認の現行公式情報】\n${currentMatches.map(({ entry }) => `・${entry.title}\n  ${entry.facts.join("、")}。注意: ${entry.cautions.join("、")}。`).join("\n")}\n\n` : "";
  return `${currentSection}${islandNames[slug]}のSanporoid調査パック（${entries.length}件）から近い候補です。\n${body}\n\n連続した安全な徒歩ルートを保証する情報ではありません。運航、着岸港、通行止め、天候・海況、営業、入口を当日に公式案内と現地掲示で確認してください。`;
}
