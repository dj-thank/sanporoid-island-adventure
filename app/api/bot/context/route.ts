import { getTripBoard, requireBot } from "../../../../db/store";
import { currentFactsFor, deepKnowledgeFor, deepThemeCount, experiencesFor, islandCurrentFacts, islandDeepKnowledge, islandExperiencePack } from "../../../adventure/islandKnowledge";
import { islandsBySlug } from "../../../discover/island-data";
import { islandMapProfiles } from "../../../adventure/islandMapProfiles";

const tripIslandSlugs = ["kozushima", "niijima", "shikinejima"] as const;

export async function GET(request: Request) {
  try {
    await requireBot(request);
    const board = await getTripBoard();
    return Response.json({
      observedAt: new Date().toISOString(),
      writeCapabilities: false,
      trip: {
        routeLabel: board.trip?.routeLabel,
        dates: `${board.trip?.startDate}—${board.trip?.endDate}`,
        lodging: "宿泊は神津島 → 新島 → 新島。8/31の式根島は日帰り。",
        pending: "神津島キャンプ場は朝確認。空席・当日運航・発着港も未確認。",
        transport: [
          "8/29 東京7:25→神津島10:35（東海汽船1420便候補）",
          "8/30 神津島13:25→新島14:05（東海汽船2430便候補）",
          "8/31 新島8:20発、式根島16:00発（連絡船にしき夏期ダイヤ）",
          "9/1 新島14:10→東京17:00（東海汽船2430便候補）",
        ],
        safetyBoundary: "予約済み・空席あり・運航確定とは言わない。現地掲示、立入、海況、当日運航をゲームより優先する。",
      },
      islands: tripIslandSlugs.map((slug) => {
        const island = islandsBySlug[slug];
        const mapProfile = islandMapProfiles[slug];
        const researchedExperiences = experiencesFor(slug);
        return {
          slug,
          name: island.name,
          overview: island.shortIntro,
          facts: island.facts,
          missions: island.friendMissions,
          spots: island.spots.map((spot) => ({ title: spot.title, label: spot.label, summary: spot.summary })),
          rules: island.rules,
          official: island.official,
          currentOfficialFacts: currentFactsFor(slug),
          deepKnowledge: deepKnowledgeFor(slug),
          mapProfile: {
            bounds: mapProfile.bounds,
            camera: mapProfile.camera,
            categories: mapProfile.categories.map((category) => ({ id: category.id, label: category.label })),
            safetyNote: mapProfile.safetyNote,
            officialMapUrl: mapProfile.officialMapUrl,
            hazardUrl: mapProfile.hazardUrl,
            routeBoundary: "地図の点線は章の順番ヒントであり、徒歩経路・通行可能性を示さない。",
          },
          researchedExperienceCount: researchedExperiences.length,
          researchedExperiences: researchedExperiences.map((entry) => ({
            id: entry.id,
            title: entry.title,
            orderedStops: entry.orderedStops,
            supportedFacts: entry.supportedFacts,
            constraints: entry.constraints,
            hazards: entry.hazards,
            sharedTransportGate: entry.sharedTransportGate,
            sourceCheckedAt: entry.sourceCheckedAt,
            officialSources: entry.officialSources,
          })),
        };
      }),
      researchPack: {
        sourceState: islandExperiencePack.sourceState,
        sourceSnapshotThrough: islandExperiencePack.sourceSnapshotThrough,
        experienceCount: islandExperiencePack.experienceCount,
        anchorCount: islandExperiencePack.anchorCount,
        safetyBoundary: islandExperiencePack.safetyBoundary,
        currentFactsCheckedAt: islandCurrentFacts.checkedAt,
        currentFactCount: islandCurrentFacts.facts.length,
        deepKnowledgeCheckedAt: islandDeepKnowledge.checkedAt,
        deepThemeCount,
      },
      world: {
        title: "欠けた潮星",
        chapters: ["神津島｜導き", "新島｜反響", "式根島｜約束"],
        factFictionRule: "確認済み事実、提案、創作設定を分けて回答する。創作を旅行事実や安全判断へ使わない。",
      },
    }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "BOT_UNAUTHORIZED";
    return Response.json({ error: message }, { status: message === "BOT_UNAUTHORIZED" ? 401 : 400 });
  }
}
