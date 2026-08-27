# 星空ガイド MVP とモバイル構成

Observed at: 2026-08-28 JST

## 今回実装する境界

- PWA上で、現在時刻、端末内の現在地、端末方位から明るい星の高度・方位を計算する。
- HYG Database v4.1から見かけの等級5.0以下の1,638星を抽出し、J2000赤経・赤緯と等級を実データとして表示する。
- 現在地の数値、方位センサー値、写真はサーバーへ送らない。
- 暗所用の赤色表示、手動方位、センサー拒否時のフォールバックを持つ。
- 星座判定はローカルの明るい星カタログを使う。雲、障害物、磁気ずれ、水平線は推定に含まない。
- 歩行中、運転中、崖、海岸、車道では画面を見続けない案内を固定する。

## 根拠

- [W3C Device Orientation and Motion](https://www.w3.org/TR/orientation-event/) は、方位の基本、secure context、明示許可、accelerometer/gyroscope/magnetometerの権限、センサー情報のプライバシーリスク、代替入力の必要性を規定する。
- [Android motion sensors](https://developer.android.com/develop/sensors-and-location/sensors/sensors_motion) は、rotation vector sensorをゲーム、AR、コンパス用途に推奨し、東・北・空の世界座標を説明する。
- [Apple DeviceOrientationEvent](https://developer.apple.com/documentation/webkitjs/deviceorientationevent) は、通常のalpha/beta/gammaが任意基準で、実方位にはWebKitのcompass headingが必要なことを説明する。
- [HYG Database v4.1](https://github.com/astronexus/HYG-Database/blob/main/hyg/README.md) はJ2000赤経・赤緯、見かけの等級、星座略号を持ち、CC BY-SA 4.0で提供される。
- [Stellarium Mobile](https://www.stellarium-labs.com/stellarium-mobile-plus/) はオフラインカタログ、センサー指向、星文化、夜間暗順応を一体化している。
- [Star Walk 2 manual](https://starwalk.space/assets/starwalk2_manual_en.pdf) は赤色ナイトモード、等級上限、ラベル・星座線の表示量調整を暗所設計の主要設定としている。
- [SkySafari Compass and AR](https://userguide.skysafariastronomy.com/app-specific/compass-and-ar-help) はデジタルコンパスが10度以上ずれる場合を明記し、既知の天体で手動補正できることを要求している。
- [OpenAI model catalog](https://developers.openai.com/api/docs/models) は、`GPT-5.6 Luna`をコスト重視・高頻度向け、Realtime系を音声専用モデル群として分けている。LunaをRealtime音声モデルと偽装しない。

## モデル接続

1. ローカル星空・島ガイドはログインもAPIキーも不要。
2. Private Codex/OpenClaw経由の島・星ガイド候補は`gpt-5.6-luna`を使う。SitesからPrivate CT200へ到達する認証済みHTTP境界はまだ未実装。
3. OpenAI Realtime音声は専用Realtimeモデルを使う。永久APIキーをスマホへ保存せず、所有者限定サーバーが短命なクライアント接続資格を発行する方式にする。

## Android / iPhone

- 現時点の成果はホーム画面へ追加できるPWAで、Android/iPhoneの両方で使う。
- Androidネイティブ版では`TYPE_ROTATION_VECTOR`を優先できる。
- iPhoneネイティブ署名・App Store配布にはmacOS、Apple署名、審査が別途必要。
- PWAのセンサー精度が不足する場合に限り、同じWeb資産をCapacitor等の薄いネイティブラッパーへ移す。
