import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
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
  assert.match(html, /欠けた潮星｜神津島・新島・式根島の三島冒険/);
  assert.match(html, /宿泊は神津島、新島、新島/);
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
  assert.match(html, /三晩とも、/);
  assert.match(html, /島で眠る。/);
  assert.match(html, /島順と宿泊地は決定、神津キャンプ確認中/);
  assert.match(html, /神津島 → 新島 → 式根島/);
  assert.match(html, /式根島の野営場は2026年度も継続閉場/);
  assert.match(html, /魅力の前に、泊まれるかを見る/);
  assert.match(html, /東海汽船の8島を、漏れなく読む/);
  for (const island of ["大島", "利島", "新島", "式根島", "神津島", "三宅島", "御蔵島", "八丈島"]) {
    assert.match(html, new RegExp(island));
  }
  assert.match(html, /利島はキャンプ禁止・レンタカーなし/);
  assert.match(html, /御蔵島はキャンプ禁止で宿予約なしの上陸も不可/);
  assert.match(html, /新島8:20 → 式根島/);
  assert.match(html, /式根島16:00 → 新島/);
  assert.match(html, /新島14:10 → 東京17:00/);
  assert.match(html, /空席と当日運航は未確認/);
  assert.match(html, /神津キャンプの朝確認から/);
  assert.match(html, /\/discover\/kozushima#about/);
  assert.match(html, /\/discover\/niijima#about/);
  assert.match(html, /www\.tokaikisenyoyaku\.com\/app\/login/);
  assert.match(html, /vill\.kouzushima\.tokyo\.jp\/camp/);
  assert.match(html, /まだ予約・購入はしていません/);
  assert.doesNotMatch(html, /神津島 → 新島 → 大島/);
  assert.doesNotMatch(html, /神津島 → 新島で決定/);
  assert.doesNotMatch(html, /決まった順番で、空席と宿を探す/);
});

test("server-renders a mapped long-form feature for each island", async () => {
  const worker = await loadWorker();
  const expectations = [
    ["kozushima", /車の確保が最難関/, /多幸湾ファミリーキャンプ場/, /星空保護区/],
    ["oshima", /テント＋車が成立/, /トウシキキャンプ場/, /地層大切断面/],
    ["niijima", /テント＋車が成立/, /都立羽伏浦野営場/, /当日9:00〜16:00受付/],
    ["toshima", /固定条件と両立しない/, /キャンプ・野宿禁止/, /約20万本の椿/],
    ["shikinejima", /野営場が継続閉場/, /式根島地区の野営場/, /地鉈温泉/],
    ["miyakejima", /2026営業を電話確認/, /大久保浜キャンプ場/, /雄山/],
    ["mikurajima", /テント泊禁止/, /宿泊予約のない上陸と日帰り観光も不可/, /野生のミナミハンドウイルカ/],
    ["hachijojima", /テント＋車が成立/, /底土野営場/, /黄八丈/],
  ];

  for (const [slug, verdict, camp, feature] of expectations) {
    const response = await worker.fetch(
      new Request(`http://localhost/discover/${slug}`, { headers: { accept: "text/html" } }),
      runtime,
      context,
    );
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, verdict);
    assert.match(html, camp);
    assert.match(html, feature);
    assert.match(html, /01 \/ PLAN/);
    assert.match(html, /(キャンプ条件を確認する|対象外の理由を確認する)/);
    assert.match(html, /天気別の候補を持つ/);
    assert.match(html, /CHECKED 2026\.08\.(10|12)/);
    assert.match(html, /公式で確認/);
    assert.match(html, /予約前と出発当日に見る公式サイト/);
    if (slug === "kozushima") {
      assert.match(html, /神々が水を分け、火山が島を重ねた/);
      assert.match(html, /18\.58 km²/);
      assert.match(html, /黒曜石は、旅行者より先に海を渡っていた/);
      assert.match(html, /神津島のかつお釣り行事/);
      assert.match(html, /神津島は838年にできた？/);
      assert.match(html, /指定キャンプ場/);
      assert.match(html, /8\/30.+13:25→14:05/);
      assert.match(html, /客船運休日は東京発側/);
      assert.doesNotMatch(html, /島内キャンプは禁止/);
    }
    if (slug === "oshima") {
      assert.match(html, /8\/31 9:50→11:45/);
    }
    if (slug === "niijima") {
      assert.match(html, /白い火山が、暮らしの形と色を決めた/);
      assert.match(html, /23\.87 km²/);
      assert.match(html, /1,333人の流人を、島はどう受け止めたか/);
      assert.match(html, /コーガ石は普通の軽石？/);
      assert.match(html, /くさやは腐った魚？/);
      assert.match(html, /8\/30 13:25→14:05/);
      assert.match(html, /8\/31 9:50→11:45/);
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
  assert.match(board, /サインインして追加する/);
  assert.match(board, /<fieldset disabled=\{!viewer \|\| busy\}>/);
  assert.match(board, /disabled=\{!viewer \|\| busy\}/);
  assert.match(board, /href="\/discover"/);
  assert.match(board, /三島を渡る旅に、/);
  assert.match(board, /あと1〜2人。/);
  assert.match(board, /良いところも、大変なところも、先に。/);
  assert.match(board, /まだ予約はない。でも、やりたいことは増えてきた。/);
  assert.match(board, /イルカか、船釣りか。海へ出る案。/);
  assert.match(board, /これは採用済みの予定ではありません。/);
  assert.match(board, /予約はまだ0件/);
  assert.match(board, /一人あたりは再計算中/);
  assert.match(board, /気になる.+伝える/);
  assert.match(store, /oai-authenticated-user-id/);
  assert.match(store, /return null;/);
  assert.match(store, /throw new Error\("BOT_UNAUTHORIZED"\)/);
});

test("server-renders the installable Sanporoid island adventure", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/adventure", { headers: { accept: "text/html" } }),
    runtime,
    context,
  );

  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /島の異変図鑑/);
  assert.match(html, /神津島 → 新島 → 式根島/);
  assert.match(html, /近くのチェックポイント/);
  assert.match(html, /Sanporoid探索地図/);
  assert.match(html, /aria-label="アプリのモード"/);
  assert.match(html, /STARS/);
  assert.match(html, /島のことを聞く/);
  assert.match(html, /APIキーは保存しません/);
  assert.match(html, /\/sanporoid\/avatar_treasure_01\.webp/);
  assert.match(html, /写真は端末内だけで解析/);
  assert.match(html, /潮星スカイ・ファインダー/);
  assert.match(html, /スマートフォンを向ける/);
  assert.match(html, /あれが何座/);
  assert.match(html, /開拓フィールドノート/);
  assert.match(html, /SANPOROID ISLAND INTELLIGENCE/);
  assert.match(html, /候補 ≠ 安全確認済みルート/);
  assert.match(html, /指定キャンプ場以外の野営は禁止/);
  assert.match(html, /CHECKED/);
  assert.match(html, /2026-08-28/);
});

test("keeps the PWA shell offline without caching private API data", async () => {
  const [manifest, serviceWorker, registration, guideRoute] = await Promise.all([
    readFile(new URL("../app/manifest.ts", import.meta.url), "utf8"),
    readFile(new URL("../public/sw.js", import.meta.url), "utf8"),
    readFile(new URL("../app/PwaRegistration.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/island-guide/route.ts", import.meta.url), "utf8"),
  ]);

  assert.match(manifest, /display:\s*"standalone"/);
  assert.match(manifest, /start_url:\s*"\/adventure"/);
  assert.match(serviceWorker, /url\.pathname\.startsWith\("\/api\/"\)/);
  assert.match(serviceWorker, /return;/);
  assert.match(serviceWorker, /\/cesiumStatic\//);
  assert.match(serviceWorker, /cache\.put\(event\.request/);
  assert.match(registration, /navigator\.serviceWorker\.register\("\/sw\.js"\)/);
  assert.match(registration, /location\.hostname === "localhost"/);
  assert.match(registration, /registration\.unregister\(\)/);
  assert.match(guideRoute, /getChatGPTUser/);
  assert.match(guideRoute, /store:\s*false/);
  assert.doesNotMatch(guideRoute, /console\.(?:log|error).*api/i);
});

test("uses the canonical Sanporoid MapLibre UI and local map assets", async () => {
  const [component, styleJson, packageJson, provenance] = await Promise.all([
    readFile(new URL("../app/adventure/SanporoidIslandMap.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/sanporoid/map/sanpo-vector-game-style.json", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../docs/sanporoid-map-ui-brief.md", import.meta.url), "utf8"),
  ]);
  const mapStyle = JSON.parse(styleJson);
  assert.equal(mapStyle.name, "Sanpo Vector Game");
  assert.equal(mapStyle.layers.length, 28);
  assert.equal(mapStyle.sources.openmaptiles.url, "https://tiles.openfreemap.org/planet");
  assert.match(component, /maplibre-gl/);
  assert.match(component, /sanpo-vector-game-style\.json/);
  assert.match(component, /sanpo_sensing_ring_wa/);
  assert.match(component, /osm-raster-fallback/);
  assert.match(component, /現在地/);
  assert.match(component, /探索開始/);
  assert.match(component, /currentPosition/);
  await Promise.all([
    access(new URL("../public/sanporoid/map/sanpo_washi_map_overlay_v2.webp", import.meta.url)),
    access(new URL("../public/sanporoid/map/sanpo_sensing_ring_wa.png", import.meta.url)),
    access(new URL("../public/sanporoid/map/sanpo_compass_wa.png", import.meta.url)),
    access(new URL("../public/sanporoid/map/avatar_idle_n_01.webp", import.meta.url)),
    access(new URL("../docs/ui-reference/sanporoid-map-primary.png", import.meta.url)),
  ]);
  assert.equal(JSON.parse(packageJson).dependencies["maplibre-gl"], "^6.6.0");
  assert.match(provenance, /68295c62912f37b87d6e735d3ec9b183a047f5cd/);
});

test("gives all three islands bounded map profiles without fake walk routes", async () => {
  const [profilesSource, component] = await Promise.all([
    readFile(new URL("../app/adventure/islandMapProfiles.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/adventure/SanporoidIslandMap.tsx", import.meta.url), "utf8"),
  ]);
  for (const slug of ["kozushima", "niijima", "shikinejima"]) assert.match(profilesSource, new RegExp(`${slug}:\\s*\\{`));
  assert.match(profilesSource, /bounds:/);
  assert.match(profilesSource, /camera:/);
  assert.match(profilesSource, /biome:/);
  assert.match(profilesSource, /categories:/);
  assert.match(component, /fitBounds/);
  assert.match(component, /mission-radius-fill/);
  assert.match(component, /categoryFilters/);
  assert.match(component, /順番線は徒歩経路ではありません/);
  assert.doesNotMatch(component, /const route = points\.map/);
  assert.doesNotMatch(component, /id: "island-exploration-route"/);
  const { circlePolygon, islandForPosition, islandMapProfiles } = await import(new URL("../app/adventure/islandMapProfiles.ts", import.meta.url));
  assert.equal(islandForPosition([34.212, 139.139]), "kozushima");
  assert.equal(islandForPosition([34.373, 139.259]), "niijima");
  assert.equal(islandForPosition([34.324, 139.216]), "shikinejima");
  for (const profile of Object.values(islandMapProfiles)) {
    assert.equal(profile.categories.length, 6);
    assert.ok(profile.bounds[0][0] < profile.bounds[1][0]);
    assert.ok(profile.bounds[0][1] < profile.bounds[1][1]);
  }
  const ring = circlePolygon([34.22, 139.14], 500);
  assert.equal(ring.coordinates[0].length, 49);
  assert.deepEqual(ring.coordinates[0][0], ring.coordinates[0].at(-1));
});

test("organizes the island adventure into accessible responsive app modes", async () => {
  const [app, map, fieldGuide, starGuide, shellCss, mapCss, fieldCss, starCss] = await Promise.all([
    readFile(new URL("../app/adventure/AdventureApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/adventure/SanporoidIslandMap.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/adventure/IslandFieldGuide.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/adventure/StarGuide.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/adventure/adventure.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/adventure/sanporoid-island-map.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/adventure/island-field-guide.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/adventure/star-guide.module.css", import.meta.url), "utf8"),
  ]);

  assert.match(app, /const appModes/);
  assert.match(app, /id: "explore"/);
  assert.match(app, /id: "stars"/);
  assert.doesNotMatch(app, /id: "missions"/);
  assert.doesNotMatch(app, /id: "guide"/);
  assert.match(app, /label: "地図"/);
  assert.match(app, /label: "星座"/);
  assert.match(app, /mobileBottomNav/);
  assert.match(app, /hidden=\{activeMode !==/);
  assert.match(app, /19件の調査候補と12件の現行公式情報/);
  assert.match(map, /onSelectionChange/);
  assert.match(map, /floatingControls/);
  assert.match(map, /companionSheet/);
  assert.match(map, /infoDrawer/);
  assert.match(map, /missionPanel/);
  assert.match(map, /guidePanel/);
  assert.match(fieldGuide, /role="tablist"/);
  assert.match(fieldGuide, /selectedPoint/);
  assert.match(starGuide, /starWorkspace/);
  assert.match(starGuide, /nightRed/);
  assert.match(shellCss, /safe-area-inset-bottom/);
  assert.match(shellCss, /prefers-reduced-motion/);
  for (const css of [shellCss, mapCss, fieldCss, starCss]) assert.match(css, /min-height:\s*44px/);
  assert.match(starCss, /background:\s*#050000/);
});

test("computes the night sky locally and requests sensor permission explicitly", async () => {
  const [starGuide, starMath] = await Promise.all([
    readFile(new URL("../app/adventure/StarGuide.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/adventure/starMath.ts", import.meta.url), "utf8"),
  ]);
  assert.match(starGuide, /DeviceOrientationEvent/);
  assert.match(starGuide, /requestPermission/);
  assert.match(starGuide, /deviceorientationabsolute/);
  assert.match(starGuide, /navigator\.geolocation\.watchPosition/);
  assert.match(starGuide, /isHeadingReliable/);
  assert.match(starGuide, /sensorSmoothingAmount/);
  assert.match(starMath, /apparentAltitude/);
  assert.match(starMath, /2440587\.5/);
  assert.match(starGuide, /北極星/);
  assert.match(starGuide, /星・星座を探す/);
  assert.match(starGuide, /時間移動/);
  assert.match(starGuide, /constellationLines/);
  assert.match(starGuide, /event\.beta/);
  assert.doesNotMatch(starGuide, /fetch\(/);
});

test("maps portrait and landscape phone orientation into a stable sky view", async () => {
  const { apparentAltitude, deviceViewFromOrientation, isHeadingReliable, sensorSmoothingAmount } = await import(new URL("../app/adventure/starMath.ts", import.meta.url));

  assert.deepEqual(deviceViewFromOrientation({ alpha: 0, beta: 90, gamma: 0 }), { heading: 0, altitude: 0 });
  assert.deepEqual(deviceViewFromOrientation({ alpha: 90, beta: 90, gamma: 0 }), { heading: 270, altitude: 0 });
  assert.deepEqual(deviceViewFromOrientation({ alpha: 0, beta: 0, gamma: 0 }), { heading: 0, altitude: -90 });
  assert.deepEqual(deviceViewFromOrientation({ alpha: 0, beta: 180, gamma: 0 }), { heading: 0, altitude: 90 });
  const rolled = deviceViewFromOrientation({ alpha: 35, beta: 60, gamma: 40 });
  assert.ok(Math.abs(rolled.heading - 280.905) < 0.01);
  assert.ok(Math.abs(rolled.altitude + 22.521) < 0.01);
  assert.equal(isHeadingReliable(179.9, 0), false);
  assert.equal(deviceViewFromOrientation({ alpha: 270, beta: 179.9, gamma: 0, fallbackHeading: 123 }).heading, 123);
  assert.ok(sensorSmoothingAmount(1, 16, undefined) < 0.2);
  assert.ok(sensorSmoothingAmount(65, 16, undefined) > 0.45);
  assert.ok(apparentAltitude(0) > 0.45 && apparentAltitude(0) < 0.6);
});

test("keeps deterministic astronomy transforms testable outside React", async () => {
  const { calculateSky, projectStar } = await import(new URL("../app/adventure/starMath.ts", import.meta.url));
  const polaris = { name: "Polaris", japanese: "北極星", constellation: "こぐま座", constellationCode: "UMi", raHours: 2.5303, decDegrees: 89.2641, magnitude: 1.98 };
  const [result] = calculateSky([polaris], new Date("2026-08-29T12:00:00.000Z"), 34.21, 139.13, 0);
  assert.ok(result.altitude > 33 && result.altitude < 36, `Polaris altitude ${result.altitude}`);
  const projected = projectStar({ ...result, delta: 0, altitude: 35 }, 35);
  assert.equal(projected.inView, true);
  assert.equal(projected.x, 50);
  assert.equal(projected.y, 50);
});

test("imports every researched trip-island candidate into the map and LLM context", async () => {
  const [rawPack, rawCurrentFacts, mapKnowledge, guideRoute] = await Promise.all([
    readFile(new URL("../app/adventure/island-experience-pack.json", import.meta.url), "utf8"),
    readFile(new URL("../app/adventure/island-current-facts.json", import.meta.url), "utf8"),
    readFile(new URL("../app/adventure/islandKnowledge.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/island-guide/route.ts", import.meta.url), "utf8"),
  ]);
  const pack = JSON.parse(rawPack);
  const currentFacts = JSON.parse(rawCurrentFacts);
  assert.equal(pack.experienceCount, 19);
  assert.equal(pack.anchorCount, 3);
  assert.deepEqual(Object.fromEntries(["神津島", "新島", "式根島"].map((name) => [name, pack.experiences.filter((entry) => entry.island === name).length])), { 神津島: 7, 新島: 5, 式根島: 7 });
  assert.equal(pack.experiences.every((entry) => entry.officialSources.length > 0 && entry.sharedTransportGate), true);
  assert.equal(currentFacts.checkedAt, "2026-08-28");
  assert.equal(currentFacts.facts.length, 12);
  assert.equal(currentFacts.facts.every((entry) => entry.sources.length > 0 && entry.cautions.length > 0), true);
  assert.match(mapKnowledge, /enrichMapPointsWithResearch/);
  assert.match(mapKnowledge, /cautions/);
  const fieldGuide = await readFile(new URL("../app/adventure/IslandFieldGuide.tsx", import.meta.url), "utf8");
  assert.match(fieldGuide, /role="tablist"/);
  assert.match(fieldGuide, /GuideView/);
  assert.match(guideRoute, /researchedExperiences/);
  assert.match(guideRoute, /安全確認済み連続ルートではない/);
  assert.match(guideRoute, /mapProfile/);
  assert.match(mapKnowledge, /順番線は徒歩経路ではない/);
});

test("gives the Bot a scoped read-only trip and island context", async () => {
  const db = new D1TestDatabase();
  globalThis.__testCloudflareEnv = { DB: db, OPENCLOS_BOT_TOKEN: "test-openclos-token" };
  const worker = await loadWorker();
  const unauthorized = await worker.fetch(
    new Request("http://localhost/api/bot/context"),
    { ...runtime, DB: db, OPENCLOS_BOT_TOKEN: "test-openclos-token" },
    context,
  );
  assert.equal(unauthorized.status, 401);

  const response = await worker.fetch(
    new Request("http://localhost/api/bot/context", { headers: { authorization: "Bearer test-openclos-token" } }),
    { ...runtime, DB: db, OPENCLOS_BOT_TOKEN: "test-openclos-token" },
    context,
  );
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.trip.routeLabel, "決定｜神津島 → 新島 → 式根島");
  assert.match(payload.trip.lodging, /神津島 → 新島 → 新島/);
  assert.match(payload.trip.pending, /神津島キャンプ場は朝確認/);
  assert.deepEqual(payload.islands.map((island) => island.name), ["神津島", "新島", "式根島"]);
  assert.deepEqual(payload.islands.map((island) => island.researchedExperienceCount), [7, 5, 7]);
  assert.deepEqual(payload.islands.map((island) => island.mapProfile.categories.length), [6, 6, 6]);
  assert.equal(payload.islands.every((island) => island.mapProfile.officialMapUrl && island.mapProfile.hazardUrl), true);
  assert.match(payload.islands[0].mapProfile.routeBoundary, /徒歩経路/);
  assert.equal(payload.researchPack.experienceCount, 19);
  assert.equal(payload.researchPack.currentFactCount, 12);
  assert.match(payload.researchPack.safetyBoundary, /not verified continuous walking routes/);
  assert.equal(payload.writeCapabilities, false);
});

test("reconciles the fixed camping decision and official schedule into durable state", async () => {
  const [store, board] = await Promise.all([
    readFile(new URL("../db/store.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/TripBoard.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(store, /決定｜3泊すべて指定キャンプ場＋各島レンタカー/);
  assert.match(store, /selectTripRoute/);
  assert.match(store, /reconcile:discord-route-choice:v2/);
  assert.match(store, /reconcile:official-schedule:2026-08-10/);
  assert.match(store, /reconcile:discord-niijima-decision:2026-08-12:v1/);
  assert.match(store, /reconcile:three-tent-nights-and-rental-cars:2026-08-12:v1/);
  assert.match(store, /budget_min_yen = 0, budget_max_yen = 0/);
  assert.match(store, /決定｜神津島 → 新島 → 式根島/);
  assert.match(store, /8\/31式根島は日帰り、8\/31も新島泊/);
  assert.match(store, /reconcile:confirmed-lodging-kozushima-niijima-niijima:2026-08-28:v1/);
  assert.match(board, /宿泊は神津島 → 新島 → 新島/);
  assert.match(board, /神津島キャンプ場は朝Botが確認/);
  assert.match(board, /多幸湾ファミリーキャンプ場/);
  assert.match(board, /都立羽伏浦野営場/);
  assert.match(board, /式根島の野営場は2026年度も継続閉場/);
  assert.match(board, /式根島は連絡船にしきで日帰り/);
  assert.match(board, /人は同乗できず、旅行利用には勧めない/);
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
  assert.match(body.board.trip.concept, /三晩とも指定キャンプ場でテント泊/);
  assert.match(body.board.trip.concept, /島ごとにレンタカー/);
  assert.equal(body.ok, true);
  assert.equal(body.receipt.routeVerified, true);
  assert.equal(body.receipt.actionCount, 1);
  const adoptedRoutes = db.database.prepare("SELECT title FROM plan_entries WHERE status = 'adopted'").all();
  assert.deepEqual(new Set(adoptedRoutes.map((row) => row.title)), new Set([
    "決定｜3泊すべて指定キャンプ場＋各島レンタカー",
    "決定｜神津島 → 新島",
  ]));
});
