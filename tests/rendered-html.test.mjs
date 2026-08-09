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
  assert.match(html, /黒い島から、/);
  assert.match(html, /白い島へ。/);
  assert.match(html, /OFFICIAL BOOKING DESK/);
  assert.match(html, /空席未確認/);
  assert.match(html, /EDITORIAL VISUAL/);
  assert.match(html, /www\.tokaikisenyoyaku\.com\/app\/login/);
  assert.match(html, /niijima-info\.jp\/stay/);
  assert.match(html, /izu-oshima\.or\.jp\/transportation/);
  assert.match(html, /No booking has been made/);
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
