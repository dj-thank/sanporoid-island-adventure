# Sanporoid地図UI 移植ブリーフ

基準画像は `docs/ui-reference/sanporoid-map-primary.png`（Pixel 9a、1080×2424）。Sanporoid private GitHub `main` (`58e36f3`) と最新ローカルブランチ (`ad07e6d`) の `app/src/main/java/jp/sampo/ui` tree hash はともに `68295c62912f37b87d6e735d3ec9b183a047f5cd` で、地図UIは同一である。

完全一致対象は MapLibre 28-layer style、和紙オーバーレイ、右側72dp操作、player HUD。意味を維持して島向けに置換する対象は上部の地域・ルート進捗、会話シート。下ナビはSanporoidの形状・色・間隔を保持しつつ「地図・星座」の2画面へ縮約し、任務・写真・島案内・AI質問は地図内シートへ統合する。

星座画面の実装証拠は `docs/ui-reference/kaketa-constellation-implementation.png`。天頂・天底付近では方位を保持し、適応平滑化・大気差・最良位置精度を使う。

3島別の表示範囲・カテゴリ・任務半径・安全境界は `app/adventure/islandMapProfiles.ts` と `docs/three-island-map-research-2026-08-29.md` を正本とする。実装画像は `map-kozushima-v2.png`、`map-niijima-v2.png`、`map-shikinejima-v2.png`。全POIを結ぶ旧直線は徒歩経路に見えるため撤去した。

東京の履歴、Health Connect値、GPS受信状態を島アプリへコピーしてはならない。現在地が未許可なら島中心を「仮位置」と明示し、実位置として表示しない。
