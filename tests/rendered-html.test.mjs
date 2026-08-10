import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  return (await import(workerUrl.href)).default;
}

const runtime = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const context = {
  waitUntil() {},
  passThroughOnException() {},
};

test("server-renders the Island Weekend shell and metadata", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    runtime,
    context,
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="ja">/);
  assert.match(html, /俺たちの予定を読み込んでいます/);
  assert.match(html, /Island Weekend｜大島 → 新島 旅行ボード/);
  assert.match(html, /俺たちの旅行SSOT/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("server-renders the official-source island magazine", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/discover", { headers: { accept: "text/html" } }),
    runtime,
    context,
  );

  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /大島・新島・/);
  assert.match(html, /神津島の/);
  assert.match(html, /旅ガイド/);
  assert.match(html, /採用中は「大島 → 新島」/);
  assert.match(html, /神津島のモデルコースを見る/);
  assert.match(html, /宿と交通をこの順で確認する/);
  assert.doesNotMatch(html, /EDITORIAL VISUAL/);
  assert.doesNotMatch(html, /island-scenes-v1\.png/);
  assert.doesNotMatch(html, /東京から、三つの別世界へ。/);
  assert.doesNotMatch(html, /予約は、旅の順番で。/);
  assert.match(html, /www\.tokaikisenyoyaku\.com\/app\/login/);
  assert.match(html, /niijima-info\.jp\/stay/);
  assert.match(html, /kozushima\.com\/yado-list/);
  assert.match(html, /予約はまだしていません/);
});

test("server-renders a mapped long-form feature for each island", async () => {
  const worker = await loadWorker();
  const expectations = [
    ["kozushima", /神津島の夜は星空観察を1晩入れる/, /星空保護区/, /晴れて風が弱い日：天上山へ/, /白・青・黒を1人1色で撮る/, /天上山・港・海岸の位置を確認する/],
    ["oshima", /地層大切断面は車を止めて見たい/, /地層大切断面/, /雨の日：ジオノスと温泉へ/, /火山の黒を3枚ずつ撮る/, /三原山・南部・2つの港を確認する/],
    ["niijima", /羽伏浦は自転車で好きな場所まで/, /湯の浜露天温泉/, /雨の日：ガラス施設と島の土産を探す/, /好きなモヤイ像を1体選ぶ/, /羽伏浦・本村・港の位置を確認する/],
  ];

  for (const [slug, feature, place, condition, mission, mapTitle] of expectations) {
    const response = await worker.fetch(
      new Request(`http://localhost/discover/${slug}`, { headers: { accept: "text/html" } }),
      runtime,
      context,
    );
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, feature);
    assert.match(html, place);
    assert.match(html, condition);
    assert.match(html, mission);
    assert.match(html, mapTitle);
    assert.match(html, /01 \/ PLAN/);
    assert.match(html, /宿の空きを確認する/);
    assert.match(html, /天気別の候補を持つ/);
    assert.match(html, /CHECKED 2026\.08\.10/);
    assert.match(html, /公式で確認/);
    assert.match(html, /予約前と出発当日に見る公式サイト/);
    assert.doesNotMatch(html, /晴れだけを、前提にしない。/);
    assert.doesNotMatch(html, /こう回る。ただし、島に従う。/);
    assert.doesNotMatch(html, /まず、島の形を頭に入れる。/);
    assert.doesNotMatch(html, /最後は、公式情報へ。/);
    if (slug === "kozushima") {
      assert.match(html, /指定キャンプ場/);
      assert.doesNotMatch(html, /島内キャンプは禁止/);
    }
    if (slug === "niijima") {
      assert.doesNotMatch(html, /無料・24時間・水着着用/);
    }
  }
});

test("gates every site-side write route before parsing its payload", async () => {
  const routes = await Promise.all([
    readFile(new URL("../app/api/proposals/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/proposals/[id]/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/expenses/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/receipts/route.ts", import.meta.url), "utf8"),
  ]);

  for (const route of routes) {
    const gate = route.indexOf("const actor = await writeActor(request)");
    const unauthorized = route.indexOf("status: 401");
    const payload = Math.min(
      ...[route.indexOf("request.json()"), route.indexOf("request.formData()")]
        .filter((index) => index >= 0),
    );
    assert.ok(gate >= 0, "write route is missing its actor gate");
    assert.ok(unauthorized > gate, "write route is missing its 401 response");
    assert.ok(payload > unauthorized, "write route parses input before authorization");
  }
});

test("shows a sign-in gate for every site-side write control", async () => {
  const [page, board, store] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/TripBoard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../db/store.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /getChatGPTUser/);
  assert.match(page, /chatGPTSignInPath\("\/#add"\)/);
  assert.match(board, /ChatGPTでサインイン/);
  assert.match(board, /<fieldset disabled=\{!viewer \|\| busy\}>/);
  assert.match(board, /disabled=\{!viewer \|\| busy\}/);
  assert.match(board, /href="\/discover"/);
  assert.match(store, /oai-authenticated-user-id/);
  assert.match(store, /return null;/);
  assert.match(store, /throw new Error\("BOT_UNAUTHORIZED"\)/);
});
