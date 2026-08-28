import { getChatGPTUser } from "../../chatgpt-auth";
import { currentFactsFor, deepKnowledgeFor, experiencesFor, islandCurrentFacts, islandDeepKnowledge, type TripIslandSlug } from "../../adventure/islandKnowledge";
import { islandsBySlug, type Island } from "../../discover/island-data";
import { islandMapProfiles } from "../../adventure/islandMapProfiles";

const allowedIslands = new Set<Island["slug"]>(["kozushima", "niijima", "shikinejima"]);
const allowedModels = new Set(["gpt-5.6-luna", "gpt-5.6-terra", "gpt-5.4-mini"]);

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "ChatGPTサインイン済みの所有者だけが利用できます" }, { status: 401 });

  const apiKey = request.headers.get("x-openai-api-key")?.trim() ?? "";
  if (!/^sk-[A-Za-z0-9_-]{16,240}$/.test(apiKey)) {
    return Response.json({ error: "OpenAI APIキーを確認してください" }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "質問を読み取れませんでした" }, { status: 400 });
  }
  const input = payload as { island?: string; question?: string; model?: string };
  const slug = input.island as Island["slug"];
  const question = String(input.question ?? "").trim().slice(0, 600);
  const model = allowedModels.has(String(input.model)) ? String(input.model) : "gpt-5.6-luna";
  if (!allowedIslands.has(slug) || !question) {
    return Response.json({ error: "島と質問を確認してください" }, { status: 400 });
  }

  const island = islandsBySlug[slug];
  const researchedExperiences = experiencesFor(slug as TripIslandSlug);
  const currentFacts = currentFactsFor(slug as TripIslandSlug);
  const deepThemes = deepKnowledgeFor(slug as TripIslandSlug);
  const mapProfile = islandMapProfiles[slug as TripIslandSlug];
  const context = [
    `島: ${island.name} (${island.english})`,
    `概要: ${island.shortIntro}`,
    `旅の軸: ${island.coverLine}`,
    `基本情報: ${island.facts.map((fact) => `${fact.label}=${fact.value}`).join(" / ")}`,
    `候補スポット: ${island.spots.map((spot) => `${spot.title}: ${spot.summary}`).join(" / ")}`,
    `写真ミッション: ${island.friendMissions.map((mission) => `${mission.title}: ${mission.copy}`).join(" / ")}`,
    `地図: カテゴリ=${mapProfile.categories.map((category) => category.label).join("、")} / 安全注意=${mapProfile.safetyNote} / 公式MAP=${mapProfile.officialMapUrl} / 防災データ=${mapProfile.hazardUrl} / 点線は徒歩経路ではない`,
    `現行公式情報（${islandCurrentFacts.checkedAt}確認）:\n${currentFacts.map((entry) => `- ${entry.category}｜${entry.title}｜事実=${entry.facts.join("、")}｜注意=${entry.cautions.join("、")}｜出典=${entry.sources.map((source) => source.url).join(" ")}`).join("\n")}`,
    `島の深層知識（${islandDeepKnowledge.checkedAt}確認、${deepThemes.length}テーマ）:\n${deepThemes.map((theme) => `- ${theme.category}｜${theme.title}｜要約=${theme.summary}｜事実=${theme.facts.join("、")}｜地図接続=${theme.mapLinks.join("、")}｜注意=${theme.cautions.join("、")}｜出典=${theme.sources.map((source) => source.url).join(" ")}`).join("\n")}`,
    `Sanporoid全国・関東調査からの島別候補（${researchedExperiences.length}件、候補であり安全確認済み連続ルートではない）:\n${researchedExperiences.map((entry) => [
      `- ${entry.title}`,
      `順番候補=${entry.orderedStops.join(" → ")}`,
      `公式根拠=${entry.supportedFacts.join("、") || "地点情報のみ"}`,
      `制約=${entry.constraints.join("、") || "当日確認"}`,
      `危険=${entry.hazards.join("、") || "未特定"}`,
      `運用ゲート=${entry.sharedTransportGate}`,
      `確認日=${entry.sourceCheckedAt ?? "未記録"}`,
      `公式URL=${entry.officialSources.map((source) => source.url).join(" ")}`,
    ].join(" | ")).join("\n")}`,
    `安全ルール: ${island.rules.join(" / ")}`,
    `公式確認先: ${island.official.map((source) => `${source.label} ${source.url}`).join(" / ")}`,
  ].join("\n");

  const safetyIdentifier = await sha256(user.userId);
  let upstream: Response;
  try {
    upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        store: false,
        safety_identifier: safetyIdentifier,
        max_output_tokens: 700,
        instructions: "あなたは友達旅行の島ガイドです。提供された島データだけを根拠に日本語で簡潔に答えてください。事実、提案、創作を明確に分け、運航・天候・海況・立入・営業・宿泊は当日の公式情報を優先すると必ず伝えてください。危険区域、私有地、野宿、無断撮影を勧めないでください。分からないことは分からないと答えてください。",
        input: `端末内の島データ:\n${context}\n\n質問:\n${question}`,
      }),
    });
  } catch {
    return Response.json({ error: "OpenAI APIへ接続できませんでした" }, { status: 502 });
  }

  if (!upstream.ok) {
    const error = upstream.status === 401 || upstream.status === 403
      ? "APIキーまたはモデルの利用権限を確認してください"
      : upstream.status === 429
        ? "APIの利用上限に達しました。少し待ってください"
        : "島ガイドの応答を受け取れませんでした";
    return Response.json({ error }, { status: upstream.status === 429 ? 429 : 502 });
  }

  const response = await upstream.json() as { output_text?: string; output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
  const answer = response.output_text?.trim() || response.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text?.trim();
  if (!answer) return Response.json({ error: "島ガイドの回答が空でした" }, { status: 502 });

  return Response.json({ answer, model, island: island.name }, { headers: { "cache-control": "no-store" } });
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
