# 潮星地図UI デザイン分岐ブリーフ

基準画像は `docs/ui-reference/sanporoid-map-primary.png`（Pixel 9a、1080×2424）。Sanporoid private GitHub `main` (`58e36f3`) と最新ローカルブランチ (`ad07e6d`) の `app/src/main/java/jp/sampo/ui` tree hash はともに `68295c62912f37b87d6e735d3ec9b183a047f5cd` で、地図UIは同一である。

MapLibre 28-layer styleと和紙オーバーレイは地図資産の出自として残す。一方、表層UIは「欠けた潮星」独自の航海計器へ分岐する。大きなSanporoidアバターと sensing ring は中央HUDから外し、珊瑚色の潮星コンパスへ置換する。ミント色の丸い白カード、Sanporoid会話シート、同形状の下ナビも、深い紺・海硝子色・珊瑚色、非対称コーナー、番号付きフィールドログへ変える。機能配置、44px以上の操作領域、横スクロールなし、任務・写真・島案内・AI質問の地図内完結は維持する。

星座画面の実装証拠は `docs/ui-reference/kaketa-constellation-implementation.png`。天頂・天底付近では方位を保持し、適応平滑化・大気差・最良位置精度を使う。

3島別の表示範囲・カテゴリ・任務半径・安全境界は `app/adventure/islandMapProfiles.ts` と `docs/three-island-map-research-2026-08-29.md` を正本とする。新しい実装画像は `kaketa-shioboshi-map-v3.png`。全POIを結ぶ旧直線は徒歩経路に見えるため撤去した。

東京の履歴、Health Connect値、GPS受信状態を島アプリへコピーしてはならない。現在地が未許可なら島中心を「仮位置」と明示し、実位置として表示しない。
