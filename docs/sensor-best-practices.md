# 星空ガイドの姿勢センサー設計

確認日: 2026-08-28

## 採用した原則

- `alpha/beta/gamma` を独立した方位・高度として近似しない。W3C Device Orientation の Z-X'-Y'' 回転行列で、端末背面の視線ベクトル `[0, 0, -1]` を地球座標へ変換し、その水平成分から方位、Z成分から高度を求める。
- `deviceorientationabsolute` を優先する。absolute が得られない端末だけ `deviceorientation` へフォールバックし、相対方位であることを明示して既知の星による補正を促す。
- iOS の `requestPermission()` は必ずユーザー操作から呼ぶ。センサー開始前に暗黙取得しない。
- 生のセンサーイベントをそのまま React 描画へ流さない。最新値だけを保持し、約20Hz以下で円周を考慮した方位補間と高度補間を行う。
- 静止時の小さな角度差は強く平滑化し、大きな方向転換は速く追従する適応係数を使う。iPhoneの精度値が悪い場合は追従を抑える。
- 端末背面が天頂・天底の約2度以内では視線方位が数学的に不定になるため、直前の信頼できる方位を保持する。
- 地平線付近はBennett式の標準大気差で見かけ高度を補正する。天候・気圧・気温の個別差は未補正と明示する。
- 地図・星座ともユーザー操作後の最大12秒だけ高精度測位を継続し、より良いaccuracyのfixだけを採用する。座標履歴は保存しない。
- 星空画面が非表示になった時点でイベント購読を解除する。再表示時のみ再開し、明示的な停止操作も提供する。
- 2.5秒以上更新がない場合は stale と表示し、手動ドラッグへ誘導する。
- 磁気偏差、ケース、車、金属、端末固有誤差は既知の星を中央へ置くセッション内補正で吸収する。補正値・位置・センサー履歴は保存しない。

## 一次情報

- W3C Device Orientation and Motion: 座標系、権限、absolute/relative、背面視線ベクトル、回転行列、privacy。https://www.w3.org/TR/orientation-event/
- Android Motion Sensors: `TYPE_ROTATION_VECTOR` と端末姿勢の公式説明。https://developer.android.com/develop/sensors-and-location/sensors/sensors_motion
- Apple Core Motion processed device-motion data: navigation用途では magnetic/true north reference frame を選択する。https://developer.apple.com/documentation/coremotion/getting-processed-device-motion-data
- Apple `CMAttitudeReferenceFrame`: 利用可能な arbitrary/magnetic/true north 基準。https://developer.apple.com/documentation/coremotion/cmattitudereferenceframe
- Apple `CMDeviceMotion.heading`: north reference frame 使用時だけ有効。https://developer.apple.com/documentation/coremotion/cmdevicemotion/heading
- Capacitor Motion API: Capacitorの公式モーション境界。https://capacitorjs.com/docs/apis/motion

Context7 の専用コネクタはこの Codex 実行環境に存在せず、追加候補にもなかった。Context7 公開検索面も確認したが、対象の Capacitor/W3C/Apple/Android センサー資料は得られなかったため、上記の仕様所有者による一次情報を採用した。

## 実機証拠（Pixel 9a）

- 端末は Rotation Vector、Game Rotation Vector、Geomagnetic Rotation Vector、加速度、ジャイロ、磁気センサーを搭載。
- 旧版は Chromium WebView が Rotation Vector と Game Rotation Vector を同時に登録していた。
- CDPで1.5秒測定すると absolute/relative を各41サンプル受信し、同じ静止姿勢で absolute約29.5°、relative約257.8°だった。relativeを方位として扱えないことを確認した。
- 修正版は星空画面で Rotation Vector だけを登録し、探索画面へ移動すると同じPIDの登録を解除した。

## 残る実機ゲート

- iPhone実機の Safari/WKWebView で、`requestPermission()`、`webkitCompassHeading`、精度表示、縦横回転、バックグラウンド復帰を確認する。
- 屋外で北極星または既知方位を基準に、ケース有無・車内外・端末8の字補正後の角度誤差を測る。
- Android/iPhoneそれぞれで、天頂・地平線・端末ロールを含む保持姿勢を比較する。
