import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const [experiencePath, anchorPath, outputPath] = process.argv.slice(2);
if (!experiencePath || !anchorPath || !outputPath) {
  throw new Error("usage: node generate-island-experience-pack.mjs <experiences.jsonl> <anchors.jsonl> <output.json>");
}

const wantedIslands = new Set(["神津島", "新島", "式根島"]);
const readJsonLines = async (path) => (await readFile(resolve(path), "utf8"))
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const sourceExperiences = await readJsonLines(experiencePath);
const sourceAnchors = await readJsonLines(anchorPath);

const experiences = sourceExperiences
  .filter((entry) => wantedIslands.has(entry.island))
  .map((entry) => ({
    id: entry.id,
    island: entry.island,
    title: entry.title,
    planKind: entry.plan_kind,
    officialRouteClaim: Boolean(entry.official_route_claim),
    arrivalVariants: entry.arrival_variants ?? [],
    orderedStops: entry.ordered_stops ?? [],
    returnGate: entry.return_gate ?? null,
    officialSources: entry.official_sources ?? [],
    freshness: entry.freshness ?? null,
    hazards: entry.hazards ?? [],
    bestFit: entry.experience?.best_fit ?? [],
    lighting: entry.experience?.lighting ?? "unknown",
    resupply: entry.experience?.resupply ?? "unknown",
    walking: entry.walking ?? null,
    evidenceStatus: entry.current_official_evidence?.evidence_status ?? "preflight_required",
    supportedFacts: entry.current_official_evidence?.officially_supported_facts ?? [],
    constraints: entry.current_official_evidence?.constraints_or_counterevidence ?? [],
    sharedTransportGate: entry.current_official_evidence?.shared_transport_gate ?? "当日確認が必要",
    sourceCheckedAt: entry.current_official_evidence?.source_checked_at ?? null,
    missingGates: entry.missing_gates ?? [],
    fieldExperience: entry.field_experience ?? "not_verified",
  }));

const anchors = sourceAnchors
  .filter((entry) => wantedIslands.has(entry.region?.island))
  .map((entry) => ({
    id: entry.id,
    island: entry.region.island,
    name: entry.name,
    category: entry.category,
    position: [entry.anchor.lat, entry.anchor.lon],
    precision: entry.anchor.precision,
    source: entry.source,
    missingGates: entry.missing_gates ?? [],
  }));

const pack = {
  schemaVersion: 1,
  sourceSnapshotThrough: experiences.map((entry) => entry.sourceCheckedAt).filter(Boolean).sort().at(-1) ?? null,
  sourceState: "LOCAL_STAGING_ONLY",
  safetyBoundary: "These are evidence-backed exploration candidates, not verified continuous walking routes. Recheck transport, closures, weather, tides, opening and pedestrian access on the day.",
  experienceCount: experiences.length,
  anchorCount: anchors.length,
  experiences,
  anchors,
};

await writeFile(resolve(outputPath), `${JSON.stringify(pack, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ outputPath: resolve(outputPath), experienceCount: experiences.length, anchorCount: anchors.length }));
