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

## Canonical map UI expansion

The exact Sanporoid map UI was imported from the same clean source revision after
the user requested the original map system rather than palette-level borrowing.
`main` and `ad07e6d` have identical UI and drawable tree hashes. The MapLibre
style was mechanically extracted from `MapStyle.SANPO_VECTOR_GAME_STYLE_JSON`;
no private location, route history, account data, reference APK bytes, or API
credentials were copied.

| Destination | Size | SHA-256 |
|---|---:|---|
| `public/sanporoid/map/sanpo-vector-game-style.json` | 17,725 | `24950B3574C7D0B7317D917F0D5BCA6A0589740886673141B917499F68CE2B0C` |
| `public/sanporoid/map/sanpo_washi_map_overlay_v2.webp` | 50,020 | `9D0A91AB11B6E9CA91FD7F2A8F1D8512E92BEDEB24A955FB37E4993342BCBD12` |
| `public/sanporoid/map/sanpo_sensing_ring_wa.png` | 158,905 | `5D6BE57020EFE6E656DA0343D3ED660EADA562D6DC9F4C21A3E0C8044DC78FAD` |
| `public/sanporoid/map/sanpo_compass_wa.png` | 190,754 | `A1CD3DBF6AED0EFD4918D1353EE1552E97504D49CE4D42EBF788C0CE57A59F54` |
| `public/sanporoid/map/avatar_idle_n_01.webp` | 48,734 | `37BF47CF48304089646EBDB8985D0E724E677C4ABC7F136AF9FDE586E0C2565B` |
| `public/sanporoid/map/conversation_sanporoido_icon_map.webp` | 10,014 | `9ADB67EAC92DCEA51E7DFE69902293DEAFD8ABE001DCF630C145CF922FAF8002` |

The vector tile source remains the original OpenFreeMap endpoint and retains
OpenStreetMap attribution. The style and app shell are bundled locally, but
fresh road tiles still require network access; without tiles the local island
markers, route UI, controls, and companion overlays remain available.
