# Sanporoid地図UI 移植ブリーフ

基準画像は `docs/ui-reference/sanporoid-map-primary.png`（Pixel 9a、1080×2424）。Sanporoid private GitHub `main` (`58e36f3`) と最新ローカルブランチ (`ad07e6d`) の `app/src/main/java/jp/sampo/ui` tree hash はともに `68295c62912f37b87d6e735d3ec9b183a047f5cd` で、地図UIは同一である。

完全一致対象は MapLibre 28-layer style、和紙オーバーレイ、右側72dp操作、player HUD。意味を維持して島向けに置換する対象は上部の地域・ルート進捗、会話シート。下ナビはSanporoidの形状・色・間隔を保持しつつ、既存の「探索・任務・星空・案内」を残すため adapted とする。

東京の履歴、Health Connect値、GPS受信状態を島アプリへコピーしてはならない。現在地が未許可なら島中心を「仮位置」と明示し、実位置として表示しない。
