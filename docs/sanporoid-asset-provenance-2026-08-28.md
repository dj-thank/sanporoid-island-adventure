# Sanporoid asset reuse receipt

Observed at: 2026-08-28 JST  
Source checkout: `C:\Users\rambo\Documents\ChatGPT\sanpo\work\sanporoid`  
Source revision: `ad07e6d10cf78e1721c0daba72f89700d17932e4`

The island PWA reuses four canonical, tracked Sanporoid production assets from
`app/src/main/res/drawable-nodpi`. No reference APK, Tobidas sample asset,
private location data, account data, or route history was copied.

| Destination | SHA-256 |
|---|---|
| `public/sanporoid/arrival_ring.webp` | `C4F1102883CAEE5E7E03548C64708D3C24E257137483C6B89449B4726704929E` |
| `public/sanporoid/avatar_idle_e_01.webp` | `5D58533A645715B29743449E9D131C4E079D131AD59DFBB1A6985CBBF1511247` |
| `public/sanporoid/avatar_shadow_map_mode_tiny.webp` | `DF33DF4A572A0C7BA84F5B339AB825B4545B5F4DF3D3D437F44B889CE383582A` |
| `public/sanporoid/avatar_treasure_01.webp` | `C19A9A301254B7A0DBA7DFEEE337D3F13B365D47EC82F90FEC63BDAFC7A34D43` |

Map appearance borrows the canonical Sanporoid OpenFreeMap palette and visual
principles (`#f8f4f0` land, `#AECFE2` water, muted green land cover, warm road
casings). The PWA continues to use its existing Leaflet/OSM renderer and does
not copy third-party map tiles into the repository.

Gate ceiling: local source provenance only. This does not establish App Store,
Play Store, third-party imagery, or public release rights for unrelated assets.
