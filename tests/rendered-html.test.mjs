import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
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

class D1TestStatement {
  constructor(database, sql, values = []) {
    this.database = database;
    this.sql = sql;
    this.values = values;
  }

  bind(...values) {
    return new D1TestStatement(this.database, this.sql, values);
  }

  async run() {
    const result = this.database.prepare(this.sql).run(...this.values);
    return {
      success: true,
      meta: {
        changes: Number(result.changes ?? 0),
        last_row_id: Number(result.lastInsertRowid ?? 0),
      },
    };
  }

  async all() {
    return { success: true, results: this.database.prepare(this.sql).all(...this.values) };
  }

  async first() {
    return this.database.prepare(this.sql).get(...this.values) ?? null;
  }
}

class D1TestDatabase {
  constructor() {
    this.database = new DatabaseSync(":memory:");
  }

  prepare(sql) {
    return new D1TestStatement(this.database, sql);
  }

  async batch(statements) {
    const results = [];
    for (const statement of statements) results.push(await statement.run());
    return results;
  }
}

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
  assert.match(html, /俺たちの島旅｜神津島から、新島へ/);
  assert.match(html, /決まった予定、船と飛行機の比較、費用、未確認事項/);
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
  assert.match(html, /神津島から、/);
  assert.match(html, /新島へ/);
  assert.match(html, /友達との島旅/);
  assert.match(html, /神津島 → 新島で決定/);
  assert.match(html, /決まった順番で、空席と宿を探す/);
  assert.match(html, /神津島のモデルコースを見る/);
  assert.match(html, /神津島行きの飛行機を見る/);
  assert.match(html, /島の輪郭を、旅の前に読む/);
  assert.match(html, /水の神話、黒曜石、838年の噴火/);
  assert.match(html, /886年の噴火、流人史、コーガ石/);
  assert.match(html, /\/discover\/kozushima#about/);
  assert.match(html, /\/discover\/niijima#about/);
  assert.match(html, /SIDE STORY/);
  assert.doesNotMatch(html, /第二の島を相談中/);
  assert.doesNotMatch(html, /採用中は「大島 → 新島」/);
  assert.doesNotMatch(html, /現在SSOTに入っている竹芝→大島→新島/);
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
    assert.match(html, /CHECKED 2026\.08\.(10|12)/);
    assert.match(html, /公式で確認/);
    assert.match(html, /予約前と出発当日に見る公式サイト/);
    assert.doesNotMatch(html, /晴れだけを、前提にしない。/);
    assert.doesNotMatch(html, /こう回る。ただし、島に従う。/);
    assert.doesNotMatch(html, /まず、島の形を頭に入れる。/);
    assert.doesNotMatch(html, /最後は、公式情報へ。/);
    if (slug === "kozushima") {
      assert.match(html, /神々が水を分け、火山が島を重ねた/);
      assert.match(html, /18\.58 km²/);
      assert.match(html, /黒曜石は、旅行者より先に海を渡っていた/);
      assert.match(html, /神津島のかつお釣り行事/);
      assert.match(html, /神津島は838年にできた？/);
      assert.match(html, /指定キャンプ場/);
      assert.match(html, /8\/30 10:30→11:45 \/ 13:25→14:05/);
      assert.match(html, /客船運休日は東京発側/);
      assert.doesNotMatch(html, /島内キャンプは禁止/);
    }
    if (slug === "oshima") {
      assert.match(html, /8\/30候補 10:45 → 11:45/);
    }
    if (slug === "niijima") {
      assert.match(html, /白い火山が、暮らしの形と色を決めた/);
      assert.match(html, /23\.87 km²/);
      assert.match(html, /1,333人の流人を、島はどう受け止めたか/);
      assert.match(html, /コーガ石は普通の軽石？/);
      assert.match(html, /くさやは腐った魚？/);
      assert.match(html, /8\/30 10:30→11:45 \/ 13:25→14:05/);
      assert.match(html, /9\/1 11:55→18:40 \/ 14:10→17:00/);
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

test("reconciles the corrected Discord route and official schedule into durable state", async () => {
  const [store, board] = await Promise.all([
    readFile(new URL("../db/store.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/TripBoard.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(store, /決定｜神津島 → 新島/);
  assert.match(store, /selectTripRoute/);
  assert.match(store, /status = 'rejected'.+id <>/);
  assert.match(store, /reconcile:discord-route-choice:v2/);
  assert.match(store, /reconcile:official-schedule:2026-08-10/);
  assert.match(store, /reconcile:discord-niijima-decision:2026-08-12:v1/);
  assert.match(store, /budget_min_yen = 0, budget_max_yen = 0/);
  assert.match(store, /神津島＋伊豆大島｜天上山から火山へ/);
  assert.match(store, /神津島＋新島｜山のあと、白い海へ/);
  assert.match(store, /ジェット船10:45→11:45/);
  assert.match(store, /大型客船10:30→11:45/);
  assert.match(board, /行き先は決まった。次は、どう渡る？/);
  assert.match(board, /13,340–16,270円/);
  assert.match(board, /客船運休日は、方向別です/);
  assert.match(board, /大型客船 2等/);
  assert.match(board, /11:55 → 18:40/);
  assert.match(board, /26,500–27,130円/);
  assert.match(board, /新島9:50発は東京13:40着の直行便ではありません/);
  assert.match(board, /本人と介護者1名まで50%割引/);
});

test("an adopted Discord route updates the trip-level SSOT before the agent can report success", async () => {
  const db = new D1TestDatabase();
  globalThis.__testCloudflareEnv = {
    DB: db,
    OPENCLOS_BOT_TOKEN: "test-openclos-token",
  };
  const worker = await loadWorker();
  await worker.fetch(
    new Request("http://localhost/api/trip"),
    { ...runtime, DB: db, OPENCLOS_BOT_TOKEN: "test-openclos-token" },
    context,
  );
  db.database.prepare("UPDATE trips SET status = 'reconsidering', route_label = '再調整中｜神津島＋大島 / 新島'").run();
  db.database.prepare("UPDATE plan_entries SET status = 'rejected' WHERE status = 'adopted'").run();
  const response = await worker.fetch(
    new Request("http://localhost/api/agent/update", {
      method: "POST",
      headers: {
        authorization: "Bearer test-openclos-token",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        idempotencyKey: "discord-message-route-adoption",
        summary: "神津島から新島へ行く案を採用",
        actions: [
          {
            type: "proposal.add",
            title: "採用: 神津島→新島",
            details: "神津島で一泊してから新島へ移る。",
            adopt: true,
          },
        ],
      }),
    }),
    { ...runtime, DB: db, OPENCLOS_BOT_TOKEN: "test-openclos-token" },
    context,
  );

  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.board.trip.status, "planning");
  assert.equal(body.board.trip.routeLabel, "決定｜神津島 → 新島");
  assert.equal(body.ok, true);
  assert.equal(body.receipt.routeVerified, true);
  assert.equal(body.receipt.actionCount, 1);
  const adoptedRoutes = db.database.prepare("SELECT title FROM plan_entries WHERE status = 'adopted'").all();
  assert.deepEqual(adoptedRoutes.map((row) => row.title), ["決定｜神津島 → 新島"]);
});
