# 欠けた潮星 — 三島冒険アプリ

神津島 → 新島 → 式根島を歩く「現在地×地図」と、実データ由来の「星座」の2画面だけを持つ旅アプリです。島情報、チェックポイント、写真任務、出典、島ガイドAIは地図内シートへ統合されています。MapLibreスタイルと和紙素材はSanporoid由来の地図コアとして残し、表層UIは紺・海硝子色・珊瑚色の「潮星フィールド」へ分岐しています。

![潮星フィールド地図](docs/ui-reference/kaketa-shioboshi-map-v3.png)

v0.2.1では、神津島・新島・式根島を地質・歴史・文化・生態・運航・夜空から理解する15件の深層テーマを追加しました。地図カード、「島を理解する」タブ、端末内回答、OpenAI島ガイド、Bot APIは同じ根拠を共有します。詳細は [三島深層調査](docs/three-island-deep-research-2026-08-29.md) を参照してください。

Android / iPhone 版は Capacitor でパッケージ化され、サイトやローカル PC サーバーに接続しなくても基本機能が動きます。Cesium ランタイム、星表、島ガイドデータ、画面 UI はアプリ内へ同梱されます。AI 会話だけは、設定画面に利用者自身の OpenAI API キーを入力した場合にインターネット接続を使います。キーは保存しません。

## Android

Android端末だけで [APKを直接ダウンロード](https://github.com/dj-thank/sanporoid-island-adventure/releases/latest/download/kaketa-shioboshi-android.apk) してインストールできます。これは動作確認用のデバッグ署名APKです。初回だけAndroidの案内に従い、利用中のブラウザへ「不明なアプリのインストール」を許可してください。

ローカルで再ビルドする場合:

```powershell
pnpm install --frozen-lockfile
pnpm android:apk
```

要件は Node.js 22 以上、JDK 21、Android SDK（compileSdk 36）です。APK は `android/app/build/outputs/apk/debug/app-debug.apk` に生成されます。

## iPhone / iPad

PCへ接続せず使う場合は、Safariで [GitHub Pages版](https://dj-thank.github.io/sanporoid-island-adventure/) を開き、共有ボタン →「ホーム画面に追加」→「Web Appとして開く」を選びます。地図、現在地、チェックポイント、写真、星空、端末内回答を利用できます。

これはApple署名を必要としないホーム画面Web Appです。ネイティブiOSアプリを友人へ配る場合は、Apple Developer Programの署名済みビルドをTestFlightへ登録するか、登録済み端末を含むAd Hocプロファイルで署名する必要があります。未署名IPAやiOSシミュレーター用`.app`はiPhoneへ直接インストールできません。

### ネイティブiOSソース

GitHub のソースをダウンロードし、macOS 上で次を実行します。

```bash
pnpm install --frozen-lockfile
pnpm ios:sync
open ios/App/App.xcodeproj
```

Xcode で自分の Team を選び、接続した iPhone に実行してください。iOS の実機インストールには Apple のコード署名が必要なため、Windows だけで署名済み IPA は生成できません。GitHub Actions は Xcode で署名なしビルドが通ることを検証し、シミュレータ用 `.app` を成果物として保存します。

## 開発と検証

```bash
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm native:build
```

- Web/Sites 版は開発・共有用であり、モバイル版の実行依存先ではありません。
- 位置情報は近隣チェックポイントと星空計算に使い、アプリ側では履歴を保存・送信しません。
- OpenAI API キーは端末内ストレージへ保存せず、その場の API リクエストにだけ使用します。

---

## 旧 Web スターター情報

A clean full-stack starter running on
[vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and
Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

Signed-in visitors receive both `oai-authenticated-user-id` and `oai-authenticated-user-email`. Private Sites require every visitor to sign in; public Sites may also have anonymous visitors, for whom neither header is present.

The user ID is stable for the same user on the same Site and different across Sites. Email and name are intended for display or contact purposes.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("oai-authenticated-user-id");
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the starter and verify its rendered loading skeleton
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
