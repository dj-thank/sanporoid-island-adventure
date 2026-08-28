# Android / iPhone の GitHub 経由モバイル配布調査

確認日: 2026-08-29 JST  
対象: `C:\Users\rambo\Documents\Codex\2026-08-09\1535960563140796476\outputs\island-trip-board`  
調査範囲: Apple、Google Android、GitHub の公式一次情報のみ。外部サービスへのログイン・書込み、証明書生成、秘密値の閲覧、実機インストールは実施していない。

## 結論

- Androidは、署名済みの配布用 APK を GitHub Releases に置けば、利用者はPCやUSB接続なしで端末からダウンロードしてインストールできる。Android 8以降では、ダウンロード元のブラウザ等に対して「不明なアプリのインストール」を利用者が許可する必要がある。Google公式はWebサイトやサーバーからのAPK配布を案内している。
- iPhoneは、GitHubに置いた生の `.ipa` を任意の利用者がタップするだけでは導入できない。署名と配布経路がApple側で認められている必要がある。
- 不特定多数へのiPhoneベータ配布の最小構成は、Apple Developer Program + App Store Connect + TestFlightの外部テスター公開リンクである。GitHubはそのTestFlightリンクを案内する場所になるが、利用者は無料のTestFlightアプリを使うため、「GitHubリンクだけで直接インストール」ではない。
- 既知の少人数のiPhoneへGitHub由来のリンクで直接入れる場合は、Ad Hoc署名 + 端末UDID登録 + `manifest.plist` を使うOTA方式が該当する。ただし登録端末だけで、iPhoneはメンバーシップ年あたり最大100台という制約がある。任意のiPhoneユーザー向けではない。
- 本番の不特定多数向けiPhone配布なら、App Storeの公開配布または審査後のUnlisted（直接リンクのみ）も正規経路である。GitHubからApp Storeリンクを案内する形であり、GitHubがAppleの審査・署名を代替するわけではない。
- Androidの開発者確認は、2026-09-30にブラジル、インドネシア、シンガポール、タイの参加ストアで初期適用され、2027年以降に認定Android端末へ世界展開予定である。2026-08-29時点ではGitHubからの直接サイドロードは初期適用対象外だが、長期運用ではAndroid Developer Consoleで本人確認とパッケージ名・署名鍵を登録する構成を推奨する。

### 「任意のiPhoneユーザーがGitHubリンクだけで導入できるか」

| GitHubから案内するもの | 任意のiPhoneで導入 | 条件 | 判定 |
|---|---:|---|---|
| 生の `.ipa` ダウンロード | いいえ | Appleの有効な署名・配布経路が必要 | 不可 |
| Ad Hoc OTA（IPA + `manifest.plist`） | いいえ | 各端末のUDIDを登録し、Ad Hocプロファイルへ含める | 限定的に可 |
| TestFlight外部テスター公開リンク | ベータとして可 | Apple Developer Program、App Store Connect、初回外部ビルド審査、利用者のTestFlight | 推奨 |
| App Store公開リンク | 可 | App Store審査・公開 | 本番推奨 |
| App Store Unlistedリンク | 可 | App Store審査後、Unlisted申請 | 本番の限定公開向け |
| Apple Web Distribution | EUの利用者に限り可 | Appleの承認、登録ドメイン、公開鍵、代替配布パッケージ、サーバー実装 | 最小構成ではない |

## リポジトリの調査開始時点の状態（読み取りのみ）

- `package.json` は `@capacitor/android` と `@capacitor/ios` を使用し、Android/iPhoneをCapacitorでパッケージ化する構成である。
- `README.md` はAndroidについてGitHub Releasesのデバッグ署名APKを案内している。iPhoneについては、macOS上でXcodeを使い、接続した端末へ実行する手順を案内している。
- `.github/workflows/mobile-build.yml` のAndroidジョブは `assembleDebug` でデバッグAPKを作り、`actions/upload-artifact` に保存している。iOSジョブは署名を無効にしたiPhoneシミュレータ用 `.app` を保存しており、実機用IPAの署名、App Store Connect送信、TestFlight配布は行っていない。
- GitHub Actionsのワークフローアーティファクトは、GitHub公式上、リポジトリへの読み取り権限が必要で、既定では90日で期限切れになる。任意の利用者向けの恒久的なダウンロード先には、GitHub Releasesのリリースアセットを使うべきである。

参照: [リポジトリのREADME](../README.md)、[現在のモバイルビルドワークフロー](../.github/workflows/mobile-build.yml)、[GitHub Actionsのワークフローアーティファクト](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts)、[アーティファクトのダウンロードと保持期間](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/download-workflow-artifacts)。

## Appleの正規配布方式

### 1. TestFlight: 不特定多数のベータ利用者に最も適する

AppleのTestFlightは、App Store Connectへビルドをアップロードし、内部または外部テスターへAppleが配布する仕組みである。Apple公式の手順では、次が必要になる。

- Apple Developer Programの有効なメンバーシップ、App Store Connectのアプリレコード、配布用に署名されたビルド。
- テスト情報、フィードバック先、対応OS・端末条件。
- 外部テストでは外部グループへビルドを追加する。最初の外部ビルドはTestFlight App Reviewが必要になり、承認後に公開リンクを有効化する。
- 公開リンクは「誰でも参加可能」または端末・OS条件付きにでき、外部テスターはアプリあたり最大10,000人。TestFlightビルドは最大90日間テストできる。
- 利用者はiPhoneへ無料のTestFlightアプリをインストールし、招待メールまたは公開リンクから参加してアプリをインストールする。

したがって、GitHub READMEまたはGitHub PagesにTestFlight公開リンクを置くことはできるが、GitHubは配布認可をしていない。GitHubリンクを開いた後にTestFlightとAppleの仕組みを通るため、厳密な意味での「GitHubリンクだけ」ではない。

参照: [TestFlightの概要](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview)、[外部テスターの招待](https://developer.apple.com/help/app-store-connect/test-a-beta-version/invite-external-testers)、[App Store Connectのワークフロー](https://developer.apple.com/help/app-store-connect/get-started/app-store-connect-workflow)。

### 2. Ad Hoc + OTA: 既知の端末だけに直接配布する

Apple公式は、Ad Hocプロビジョニングプロファイルを「Xcodeなしでアプリを実行する」ためのものとし、作成前に次を要求している。

- アプリのApp ID。
- iOS用の配布証明書（distribution certificate）。
- Apple Developerアカウントへ登録した対象端末。
- 対象端末を選択したAd Hocプロビジョニングプロファイル。

Appleのデバイス概要では、Apple Developer Programのチームは、製品ファミリーごと・メンバーシップ年ごとに最大100台を登録できる。iPhoneはiPhone製品ファミリーとして数えられる。登録済み端末を無効化しても、その年の利用可能台数は戻らない。したがって、登録端末の使い回しで任意の利用者へ広げる方式ではない。

#### `manifest.plist` とHTTPS

Xcodeの公式ヘルプには、Ad Hoc / Enterprise / Developmentの書き出しで「Include manifest for over-the-air installation」を選べること、書き出し後にIPAと同じ場所へ `manifest.plist` が生成されることが明記されている。Xcodeの配布マニフェスト入力では、少なくとも次のURLを完全なHTTPS URLとして指定する。

- IPAのURL（App URL）。
- ダウンロード中に表示する57×57 PNGのURL（Display Image URL）。
- 大きい表示画像の512×512 PNG URL（Full Size Image URL）。

Appleの現在の `ManifestURL` 仕様例では、XML property listの中に次の形を取る。

```text
items[]
  assets[]
    kind = display-image
    url = https://...
    kind = software-package
    url = https://.../app.ipa
  metadata
    bundle-identifier = ...
    bundle-version = ...
    developer-name = ...
    kind = software
    title = ...
```

`bundle-identifier` と `bundle-version` を含むマニフェストの形、`software-package` とIPA URLは、[AppleのManifestURL仕様](https://developer.apple.com/documentation/devicemanagement/manifesturl)に合わせる。`bundle-version` は、Appleのデバイス管理仕様上、更新判定にも使われる。

クラシックなAd Hoc OTAでは、iPhone上のインストールページから、次のようなOSのインストールURLでマニフェストを起動する。これは新しいEU Web DistributionのURLスキームとは別物であり、対象iOSの実機で必ず確認する。

```text
itms-services://?action=download-manifest&url=<HTTPSのmanifest.plist URL>
```

重要なのは、`manifest.plist` は取得先と表示メタデータを記述するファイルであり、署名や端末許可を付与するものではないことだ。インストール可能性は、IPAに含まれる署名・プロビジョニングプロファイル、登録済みUDID、App ID、証明書の有効性で決まる。GitHub PagesやGitHub Releasesはファイルを運ぶだけで、このApple側の制約を回避しない。

参照: [Ad Hocプロビジョニングプロファイルの作成](https://developer.apple.com/help/account/provisioning-profiles/create-an-ad-hoc-provisioning-profile)、[デバイスを個別に登録](https://developer.apple.com/help/account/devices/register-a-single-device/)、[デバイスの概要と年間上限](https://developer.apple.com/help/account/devices/devices-overview)、[Xcodeの配布オプション](https://help.apple.com/xcode/mac/current/en.lproj/devde46df08a.html)、[XcodeのiOSアプリ書き出し](https://help.apple.com/xcode/mac/current/en.lproj/dev23ea8b877.html)、[書き出しファイルの一覧](https://help.apple.com/xcode/mac/current/en.lproj/deva1f2ab5a2.html)。

Apple Developer Enterprise Programは、組織が従業員へ内部配布するための制度であり、不特定多数へのGitHub公開配布の資格ではない。Apple公式も、Enterpriseを「secure internal system」またはMDMを使った従業員向けの制度として説明している。一般利用者向けの近道としてEnterprise証明書を使わない。

参照: [メンバーシップの比較](https://developer.apple.com/support/compare-memberships/)、[Apple Developerのビジネス向け配布案内](https://developer.apple.com/business/)。

### 3. App Store公開 / Unlisted: 本番の一般利用者向け

App Storeの公開配布は、Appleの審査後に選択地域の利用者へ配布する通常経路である。Unlistedは、検索・カテゴリ・おすすめ等には表示せず、承認された直接リンクからのみ見つけられる。任意のiPhoneユーザーに本番版を渡したい場合、GitHubのREADMEからApp StoreまたはUnlistedのAppleリンクへ案内する方が、Ad HocでUDIDを集めるより適切である。

参照: [App Store Connectで配布方法を設定](https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/set-distribution-methods/)。

### 4. EU限定のApple Web Distribution: Ad Hocとは別制度

Appleの2026年ドキュメントには、開発者WebサイトからiOS/iPadOSアプリを配布する制度がある。ただし、次の制約がある。

- Appleへ申請し、地域ごとの条件で承認される必要がある。
- App Store Connect APIで代替配布ドメインと公開鍵を登録する。
- Appleが承認した代替配布パッケージを取得し、Webサーバーへ組み立ててホストする。
- ページ上のインストールは利用者の明示的なボタン操作だけで開始する。新しいURLスキームは `marketplace-kit://install` で、インストール検証トークンが必要になる。
- App Store以外のアプリをWebサイトから導入できるのは、Apple公式の現行説明ではEUの利用者だけである。
- Appの認証・ライセンス・アプリデータ用サーバーエンドポイントも関係するため、静的なGitHubリンクだけでは完成しない。

GitHub PagesがHTTPSを提供していても、Appleが要求する「所有するWebサイト」「App Store Connectへ登録したドメイン」「リクエスト元ページのドメイン一致」を自動的に満たすとは判断しない。`github.io` やカスタムドメインを採用する場合も、Appleの承認条件を個別に確認する必要がある。

参照: [Webサイトからアプリを配布](https://developer.apple.com/documentation/marketplacekit/distributing-your-app-from-your-website)、[Webサイトからアプリをインストール](https://developer.apple.com/documentation/marketplacekit/installing-your-app-from-your-website)、[代替配布パッケージID](https://developer.apple.com/help/app-store-connect/managing-alternative-distribution/get-an-alternative-distribution-package-id)。

### 5. Apple Developer Programと無料Personal Team

Apple公式のメンバーシップ比較では、App配布、App Store Connectでの管理、TestFlight、Ad Hoc配布はApple Developer Program側の機能である。通常の年額は99米ドル（地域通貨では異なる場合がある）。登録にはApple Accountの2要素認証が必要である。

無料のApple AccountでXcodeにログインするPersonal Teamは、Apple公式には個人用途の実機テストである。制約は次の通り。

- 同時に登録できるApp IDは10個で、各App IDは7日後に期限切れになる。
- 各プラットフォームで登録できるテスト端末は3台で、各端末登録は7日後に期限切れになる。
- プロビジョニングプロファイルは発行から7日で期限切れになり、再ビルド・再インストールが必要になる。

これはGitHub経由の一般配布や継続的なiPhone配布の代替ではない。Personal Teamで署名したものを公開IPAとして配布する設計にはしない。

参照: [メンバーシップの比較](https://developer.apple.com/support/compare-memberships/)、[Apple Developer Programへの登録](https://developer.apple.com/help/account/membership/program-enrollment)。

### 6. Apple署名と秘密

Appleは、配布証明書とApp Store Connect APIの秘密鍵を本人性を示す機密資産として扱っている。Apple Distribution証明書はiOSアプリの配布またはApp Store Connectへのアップロードに使われ、配布には公開鍵だけでなく対応する秘密鍵が必要になる。

CIへ渡す可能性があるものは、Apple Distributionの署名資産、プロビジョニングプロファイル、App Store Connect APIキーの秘密鍵とパスワード等である。これらはリポジトリ、GitHub Pages、リリースアセット、ログへ置かない。App Store Connect APIの秘密鍵はAppleが再ダウンロード用に保持しないため、作成・保存・ローテーションはHuman GO後に行う。

参照: [Apple証明書の概要と保護](https://developer.apple.com/help/account/certificates/certificates-overview)、[App Store Connect APIキー](https://developer.apple.com/documentation/appstoreconnectapi/creating-api-keys-for-app-store-connect-api)。

## Androidの正規配布方式

### 1. GitHub Releasesへ署名済みAPKを置く

Googleの公式資料では、App BundleはGoogle Play等が端末向けAPKを生成する形式であり、App Bundle自体は端末へ直接デプロイできない。一方、APKは共有用のデプロイ可能な成果物として使える。GitHub経由の直接配布では、対象端末とABIを満たす配布用APKを作る。

必要な条件は次の通り。

- リリースビルドを、開発用デバッグ鍵ではなく、開発者が管理するリリース署名鍵で署名する。
- 更新を受け付けるには、同じアプリID／パッケージ名と同じ署名鍵を継続して使い、バージョンを増加させる。異なる証明書で署名したAPKは、既存アプリの更新ではなく別アプリ扱いになる。
- 任意の端末に一つのリンクで渡すなら、互換性を確認したユニバーサルAPKが単純である。ABI別APKを配る場合は、利用者が端末に合うファイルを選べる導線が必要になる。
- 利用者はGitHub ReleasesのHTTPSリンクをAndroid端末で開き、Android 8以降では、そのブラウザやファイルアプリ等の「この提供元からのアプリを許可」を必要な時だけ有効にしてインストールする。Android 7.1.1以前は「提供元不明のアプリ」を許可する方式である。

Google公式のGitHub固有の配布保証はないため、公開Releaseアセットを端末の標準ブラウザで実際にダウンロードし、ハッシュ確認とインストールを実機で確認する必要がある。Play Protectや端末管理者のポリシーによるブロックを、利用者に一律無効化させる設計にはしない。

参照: [Androidの代替配布オプション](https://developer.android.com/distribute/marketing-tools/alternative-distribution)、[コマンドラインからのビルド](https://developer.android.com/build/building-cmdline)、[アプリ署名](https://developer.android.com/studio/publish/app-signing)、[リリース準備](https://developer.android.com/studio/publish/preparing)。

### 2. 2026-08-29時点のAndroid Developer Verification

Google公式の現行ガイドとFAQでは、Android Developer Verificationは実在の個人・組織とAndroidアプリを結び付ける制度である。Google Play以外で配布する開発者はAndroid Developer Consoleを使い、本人確認後にパッケージ名と署名鍵を登録する。既存パッケージ名の所有確認には、対応する秘密鍵で署名したAPKを使う。

現行の区分は次の通り。

| 区分 | 本人確認 | 配布範囲 | GitHub公開配布との関係 |
|---|---:|---|---|
| Full distribution | 必要 | 任意のストア・Webサイト等 | 不特定多数の長期運用向け |
| Limited distribution | 不要 | 最大20台 | 一般公開には不足 |
| 未登録アプリのサイドロード | 不要 | 利用者がAdvanced Flowを有効化した場合 | 1リンク導入ではない |

2026-09-30の初期適用は、ブラジル、インドネシア、シンガポール、タイの認定端末上で、Google Play、HONOR App Market、OPPO App Market、Galaxy Store、Palm Store、V-Appstore、GetAppsからの導入を対象に始まる。Google FAQは、初期対象外のストアや利用者が直接サイドロードする場合、この期限の適用はまだないと説明している。ただし、2027年以降は認定Android端末へ世界展開する計画が示されている。

よって2026-08-29現在、GitHub Releasesからの直接APK導入は、通常のAndroidのユーザー許可を満たせば成立する。しかし「将来も任意の利用者が追加のAdvanced Flowなしで入れられる」ことを求めるなら、Full distributionで本人確認を行い、パッケージ名と公開証明書フィンガープリントを登録する設計を先に採用する。FAQにはFull DistributionのAndroid Developer Console料金として25米ドルの記載がある一方、支払方法・提供地域は変更され得るため、実際の登録時に公式画面を再確認する。

Advanced Flowは、未登録アプリを許可する利用者側の一回限りの安全フローで、Google FAQにはDeveloper Mode、非強制確認、再起動・再認証、1日待機、7日または無期限の許可が記載されている。これは利用者に追加の高い操作負担を求めるため、一般利用者向け配布の最小構成として選ばない。ADBはPC接続を要するため、今回の要件から除外する。

参照: [Android Developer Verificationガイド](https://developer.android.com/developer-verification/guides)、[Android Developer Consoleへの登録](https://developer.android.com/developer-verification/guides/android-developer-console)、[公式FAQ（2026-08-27更新）](https://developer.android.com/developer-verification/guides/faq)、[2026-09-30からの初期適用と今後の展開](https://developer.android.com/developer-verification)。

## GitHub Releases / Pages / Actionsの役割

### Releases: 利用者向けの固定された配布アセット

GitHub公式は、Releaseをリリースノートとバイナリファイルをまとめて他者へ提供する仕組みとして説明している。ReleaseはGit tagに基づき、最新Releaseまたは特定のReleaseへ固有URLを作れる。例えばアセット名を固定すれば、公式に案内されている次の形式を使える。

```text
https://github.com/<owner>/<repo>/releases/latest/download/<asset-name>
```

Androidは `app-release.apk` とSHA-256チェックサム、リリースノートをアセットにする。Ad Hoc OTAを採用する場合だけ、IPAとXcode生成の `manifest.plist` を追加する。TestFlightやApp Storeを採用する場合は、ReleaseへIPAを置くのではなく、Apple側の公開リンクをリリースノートやREADMEから案内する。

参照: [GitHub Releasesの概要](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)、[Releaseへのリンク](https://docs.github.com/en/repositories/releasing-projects-on-github/linking-to-releases)。

### Pages: HTTPSの静的インストール案内ページ

GitHub PagesはHTTPSをサポートし、HTTPS強制も設定できる。Ad Hoc OTAの案内ページ、AndroidのReleaseリンク、TestFlightリンクを一つにまとめる用途には使える。ただし、GitHub公式の注意どおりPagesは、許可されているプランなら非公開リポジトリから作ってもインターネット上で公開され得る。証明書、秘密鍵、APIキー、個人情報、未公開データをPagesへ置かない。

Ad HocのIPA URLやマニフェストURLにGitHubのリダイレクトを使う場合、Appleの要求する完全なHTTPS URL、匿名で到達できるファイル、Content-Type、Range/HEAD等の実機互換性をこのリポジトリでは未検証である。GitHubがReleaseアセットを置けることと、iOSのOTAインストーラがそのURLを受理することは別の証拠である。失敗時は、Appleが要求するHTTPS応答を制御できる専用の静的配布サーバーへ切り分ける。

参照: [GitHub Pagesの開始](https://docs.github.com/en/pages/getting-started-with-github-pages)、[GitHub PagesのHTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)。

### Actions: ビルドと署名を自動化する場所

GitHub Actionsは、PRやタグでビルド・テストを動かす。署名ジョブと公開ジョブを分け、PRやforkから秘密へ到達しない構成にする。

- Android: macOSは不要なので、署名鍵を保護したreleaseジョブでAPKを作り、ハッシュと互換性情報を生成する。
- iPhone: Xcodeを実行できるmacOSランナーで実機向けアーカイブを作る。TestFlightならApp Store Connectへ送信し、Ad HocならIPAとマニフェストをRelease/HTTPSホストへ出す。
- 秘密はGitHub ActionsのRepository/Environment Secretへ保存し、コマンドライン引数やログへ出さない。GitHub公式はBase64を暗号化の代替にしないこと、forkからのワークフローへ通常の秘密を渡さないことを説明している。
- 公開ジョブは保護されたEnvironmentに置き、Required reviewersを設定する。GitHub公式では、承認されるまでEnvironment Secretへアクセスできない。利用プランとリポジトリ公開範囲によってRequired reviewersの利用条件が異なる。

参照: [GitHub ActionsでSecretを使う](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)、[Deployments and environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)。

## 安全な最小構成の提案

### 推奨M0: 一般利用者向けのベータ配布

```text
GitHub tag
  └─ GitHub Actions（テスト、署名、ハッシュ生成）
       ├─ Android: 署名済み配布APK
       │    └─ 承認後 GitHub Release asset
       └─ iPhone: 署名済みアーカイブ
            └─ App Store Connect → TestFlight外部公開リンク

GitHub Pages（任意）
  ├─ Android Releaseリンク
  └─ iPhone TestFlightリンク
```

この構成なら、利用者は両端末ともPCへ接続しない。Androidはユーザーが提供元許可を操作し、iPhoneはTestFlightアプリを経由する。iPhoneの生IPAを一般公開せず、Ad Hocの端末登録上限とUDID管理も回避できる。TestFlightの90日制限を受けるため、本番化後はApp Store公開またはUnlistedへ移行する。

### 推奨M1: 少人数のiPhoneだけをGitHubリンクから直接入れる

```text
登録済みiPhoneのUDID
  → Apple Developerで登録
  → Ad Hocプロファイルを再生成
  → macOS CIで配布IPAとmanifest.plistを生成
  → HTTPSで公開（GitHub Release/Pagesは実機検証が必要）
  → iPhone上のインストールページからOTA起動
```

M1は、開発者、協力者、限られた社内・検証端末など、端末一覧を管理できる場合だけにする。任意の利用者向けにはM0またはApp Storeを使う。

## 資格・秘密・Human GO

| 対象 | 必要な資格・秘密 | 利用者側の操作 | Human GOが必要な境界 |
|---|---|---|---|
| Android直接APK | リリースkeystoreの秘密鍵・パスワード。長期公開ならAndroid Developer ConsoleのFull distribution、本人確認、パッケージ名・署名鍵登録を検討 | GitHubからAPK取得、提供元許可、インストール確認 | keystore登録、Developer Console本人確認・支払い・パッケージ登録、Release公開 |
| iPhone TestFlight | Apple Developer Program、App Store Connect権限、Apple Distribution署名資産、必要ならASC API秘密鍵 | TestFlight導入、公開リンク参加、アプリインストール | Apple契約・支払い、証明書/APIキー作成、ASCアップロード、初回審査、公開リンク有効化 |
| iPhone Ad Hoc OTA | App ID、配布証明書と秘密鍵、登録済みUDID、Ad Hocプロファイル、IPA、`manifest.plist` | iPhone上でHTTPSページを開き、インストールを承認 | UDID収集・登録、プロファイル再生成、IPA/manifest公開 |
| App Store / Unlisted | Apple Developer Program、アプリレコード、配布用署名、審査 | App Storeリンクから導入 | 審査提出、公開またはUnlisted申請、リンク公開 |
| GitHub Actions / Pages | GitHubの書込み権限、保護Environment、Actions Secrets | なし（公開後はリンク利用） | Workflow変更、Secret登録、Environment承認、Pages/Release公開 |

秘密として扱うものは、Appleの署名秘密鍵・配布証明書の秘密鍵・App Store Connect API秘密鍵、Androidのkeystore秘密鍵・パスワード、GitHubトークン等である。これらをこのリポジトリ、GitHub Release、Pages、IPA/APKの説明文、Actionsログへ書かない。公開してよいのは、アプリ本体、公開証明書フィンガープリント、SHA-256チェックサム、公開リンクなど、運用上必要な公開情報に限る。

## 実装前の受入ゲート

1. Androidのrelease APKがデバッグ署名でなく、想定端末でインストールでき、更新が同一署名鍵で成立する。
2. AndroidのAPK、SHA-256、パッケージ名、バージョン、対応ABIをReleaseノートと照合する。
3. iPhoneはまずTestFlightで、実機・対応OS・アプリ権限・オフライン基本機能を確認する。
4. Ad Hoc OTAを選ぶ場合だけ、登録端末のUDID、プロファイル、IPA内の署名、HTTPSのIPA/manifest URL、`itms-services`起動を実機で確認する。GitHubの成功ページやHTTP 200だけでは合格にしない。
5. TestFlight、App Store、Android Developer Console、GitHub Release、Pagesの公開・登録・支払い・秘密設定は、レビュー後のHuman GOが出るまで実行しない。

今回の調査で確認したのは、ローカルの既存構成と公式資料だけである。実装、署名、実機インストール、Apple/Google/GitHubのアカウント操作、公開、上位の配布完了判定は未実施である。

## 参照URL

### Apple

- https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview
- https://developer.apple.com/help/app-store-connect/test-a-beta-version/invite-external-testers
- https://developer.apple.com/help/app-store-connect/get-started/app-store-connect-workflow
- https://developer.apple.com/help/account/provisioning-profiles/create-an-ad-hoc-provisioning-profile
- https://developer.apple.com/help/account/devices/register-a-single-device/
- https://developer.apple.com/help/account/devices/devices-overview
- https://help.apple.com/xcode/mac/current/en.lproj/devde46df08a.html
- https://help.apple.com/xcode/mac/current/en.lproj/dev23ea8b877.html
- https://help.apple.com/xcode/mac/current/en.lproj/deva1f2ab5a2.html
- https://developer.apple.com/documentation/devicemanagement/manifesturl
- https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/set-distribution-methods/
- https://developer.apple.com/documentation/marketplacekit/distributing-your-app-from-your-website
- https://developer.apple.com/documentation/marketplacekit/installing-your-app-from-your-website
- https://developer.apple.com/support/compare-memberships/
- https://developer.apple.com/help/account/membership/program-enrollment
- https://developer.apple.com/help/account/certificates/certificates-overview
- https://developer.apple.com/documentation/appstoreconnectapi/creating-api-keys-for-app-store-connect-api

### Android / Google

- https://developer.android.com/distribute/marketing-tools/alternative-distribution
- https://developer.android.com/build/building-cmdline
- https://developer.android.com/studio/publish/app-signing
- https://developer.android.com/studio/publish/preparing
- https://developer.android.com/developer-verification/guides
- https://developer.android.com/developer-verification/guides/android-developer-console
- https://developer.android.com/developer-verification/guides/faq
- https://developer.android.com/developer-verification

### GitHub

- https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases
- https://docs.github.com/en/repositories/releasing-projects-on-github/linking-to-releases
- https://docs.github.com/en/pages/getting-started-with-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
- https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts
- https://docs.github.com/en/actions/how-tos/manage-workflow-runs/download-workflow-artifacts
- https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets
- https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments
