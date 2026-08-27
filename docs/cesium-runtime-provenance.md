# CesiumJS runtime asset provenance

- Package: `cesium@1.144.0`
- Upstream: https://github.com/CesiumGS/cesium
- License: Apache-2.0 (`public/cesiumStatic/LICENSE.md`)
- Imported directories: `Assets`, `ThirdParty`, `Workers`, `Widgets`
- Destination: `public/cesiumStatic`
- File count: 390
- Purpose: stable same-origin CesiumJS runtime assets for local development, production, Sites, and on-demand PWA caching.

Representative SHA-256 receipts:

- `Assets/approximateTerrainHeights.json`: `36466E2DC84F6C173B609FFC704BC021CD9FDB33C287570BF57E4F566B58E6A6`
- `Workers/createGeometry.js`: `2D82F9F488888652A358DC9CB8355049A71CE066508D5FA5D94FDFFF9D39481F`
- `Widgets/widgets.css`: `702C5ADF3D16EC7F1C03CC5FB7ECB823AF6C59FA192789FB2C859AC7A11F4A0C`
- `LICENSE.md`: `721844BC0CDAA9B1A9A145DBCA1F981E2DE15A7E200A5D1FD9F5F1EED8E5D030`

Do not edit the vendored runtime files manually. Upgrade them by changing the pinned npm package, recopying all four directories, verifying the expected nested paths, and refreshing these receipts.
