import type { MapPoint } from "../discover/island-data";
import type { TripIslandSlug } from "./islandKnowledge";

export type IslandMapCategory = {
  id: string;
  label: string;
  pointLabels: string[];
};

export type IslandMapProfile = {
  name: string;
  shortName: string;
  bounds: [[number, number], [number, number]];
  camera: { zoom: number; pitch: number; bearing: number };
  biome: { background: string; water: string; park: string; majorRoad: string; minorRoad: string };
  categories: IslandMapCategory[];
  safetyNote: string;
  officialMapUrl: string;
  hazardUrl: string;
};

export const islandMapProfiles: Record<TripIslandSlug, IslandMapProfile> = {
  kozushima: {
    name: "神津島", shortName: "神",
    bounds: [[139.105, 34.178], [139.174, 34.255]],
    camera: { zoom: 12.35, pitch: 36, bearing: -8 },
    biome: { background: "#a8dec9", water: "#58cbdc", park: "#57bd67", majorRoad: "#ffd36a", minorRoad: "#fff0bf" },
    categories: [
      { id: "all", label: "すべて", pointLabels: [] },
      { id: "mission", label: "任務", pointLabels: ["MISSION"] },
      { id: "mountain", label: "山・地質", pointLabels: ["HIKE", "VOLCANO", "GEOLOGY", "CLIFF"] },
      { id: "coast", label: "海・星", pointLabels: ["SWIM", "COAST", "SUNSET", "STARS"] },
      { id: "culture", label: "文化", pointLabels: ["MYTH", "HISTORY", "CRAFT", "ART", "TOWN"] },
      { id: "transport", label: "港・空港", pointLabels: ["GATE", "FLIGHT", "ARRIVAL", "OFFICIAL DATA"] },
    ],
    safetyNote: "天上山は登山装備・天候・火山/通行情報を確認。港は海況で変更される場合があります。",
    officialMapUrl: "https://www.vill.kouzushima.tokyo.jp/map/",
    hazardUrl: "https://catalog.data.metro.tokyo.lg.jp/dataset/t000003d0000000121",
  },
  niijima: {
    name: "新島", shortName: "新",
    bounds: [[139.235, 34.332], [139.296, 34.447]],
    camera: { zoom: 11.95, pitch: 30, bearing: 2 },
    biome: { background: "#c4e2cf", water: "#64ccdc", park: "#7bc776", majorRoad: "#f2d778", minorRoad: "#fff4cf" },
    categories: [
      { id: "all", label: "すべて", pointLabels: [] },
      { id: "mission", label: "任務", pointLabels: ["MISSION"] },
      { id: "coast", label: "海岸", pointLabels: ["SURF", "SWIM", "COAST", "SUNSET", "CLIFF"] },
      { id: "craft", label: "地質・作品", pointLabels: ["GEOLOGY", "CRAFT", "ART", "HISTORY"] },
      { id: "onsen", label: "温泉", pointLabels: ["BATH", "ONSEN", "GEO ONSEN"] },
      { id: "transport", label: "港・空港", pointLabels: ["GATE", "FLIGHT", "ARRIVAL", "OFFICIAL DATA"] },
    ],
    safetyNote: "羽伏浦は海況を優先。白ママ断崖は崖端へ近づかず、港・航空便は当日の運航を確認してください。",
    officialMapUrl: "https://niijima-info.jp/map/",
    hazardUrl: "https://catalog.data.metro.tokyo.lg.jp/dataset/t000003d0000000121",
  },
  shikinejima: {
    name: "式根島", shortName: "式",
    bounds: [[139.197, 34.306], [139.231, 34.342]],
    camera: { zoom: 13.25, pitch: 38, bearing: -5 },
    biome: { background: "#aedfc8", water: "#4fc7d5", park: "#54bd6d", majorRoad: "#f1d57a", minorRoad: "#fff0c7" },
    categories: [
      { id: "all", label: "すべて", pointLabels: [] },
      { id: "mission", label: "任務", pointLabels: ["MISSION"] },
      { id: "coast", label: "入り江", pointLabels: ["COVE", "BEACH", "COAST", "SWIM"] },
      { id: "onsen", label: "温泉", pointLabels: ["BATH", "ONSEN", "GEO ONSEN", "EARTH"] },
      { id: "view", label: "展望・小径", pointLabels: ["VIEW", "HIKE", "TURN", "FOREST"] },
      { id: "transport", label: "港", pointLabels: ["GATE", "ARRIVAL", "OFFICIAL DATA"] },
    ],
    safetyNote: "海中温泉は潮位・波・足元・やけどに注意。16時までに新島へ戻る日程を優先してください。",
    officialMapUrl: "https://shikinejima.tokyo/",
    hazardUrl: "https://catalog.data.metro.tokyo.lg.jp/dataset/t000003d2000000392",
  },
};

export function pointCategory(profile: IslandMapProfile, point: MapPoint) {
  if (point.id.startsWith("mission:")) return "mission";
  return profile.categories.find((category) => category.id !== "all" && category.pointLabels.includes(point.label))?.id ?? "all";
}

export function profileContains(profile: IslandMapProfile, position: [number, number]) {
  const [[west, south], [east, north]] = profile.bounds;
  return position[1] >= west && position[1] <= east && position[0] >= south && position[0] <= north;
}

export function islandForPosition(position: [number, number]) {
  return (Object.entries(islandMapProfiles) as Array<[TripIslandSlug, IslandMapProfile]>).find(([, profile]) => profileContains(profile, position))?.[0] ?? null;
}

export function circlePolygon(position: [number, number], radiusMeters: number, steps = 48) {
  const [lat, lng] = position;
  const latitudeRadius = radiusMeters / 111_320;
  const longitudeRadius = radiusMeters / (111_320 * Math.max(0.2, Math.cos(lat * Math.PI / 180)));
  const coordinates = Array.from({ length: steps + 1 }, (_, index) => {
    const angle = index / steps * Math.PI * 2;
    return [lng + Math.cos(angle) * longitudeRadius, lat + Math.sin(angle) * latitudeRadius];
  });
  return { type: "Polygon" as const, coordinates: [coordinates] };
}
