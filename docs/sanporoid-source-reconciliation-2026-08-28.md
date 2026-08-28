# Sanporoid UI source reconciliation

Observed: 2026-08-28 JST

## Outcome

The canonical map UI source is the clean local Sanporoid checkout at revision
`ad07e6d10cf78e1721c0daba72f89700d17932e4`, reconciled with its private Git
remote. The upstream default branch revision is `58e36f3`; both revisions have
the same UI tree (`68295c62912f37b87d6e735d3ec9b183a047f5cd`) and the same canonical
drawable tree (`86168df5f7845a4417d2db4b7d12795d10ba8458`). Changes after the default
branch are route/evidence hardening, not a different map design.

## Coverage

- Local canonical checkout and its registered worktrees were inspected.
- All local and remote branches were ordered by commit time and the complete UI
  path history was checked. The last material whole-map integration is
  `b5725df` (`feat: integrate local-first Sanporoid experience`).
- Authenticated GitHub metadata was checked for the private upstream: default
  branch, branch heads, tags and releases. There are no release tags defining a
  newer independent UI.
- Public GitHub name search exposes the island app but cannot expose or prove the
  private upstream. Public search is therefore a negative control, not lineage
  authority.
- Historical Pixel 9a evidence was found at
  `output/codex-android/sanpo-20260809-184454.png` and copied as the immutable
  1080×2424 visual target at `docs/ui-reference/sanporoid-map-primary.png`.
- The older conversation worktree predates the selected source and does not
  contain a newer map tree.

## Selected implementation contract

- Exact: `MapStyle.SANPO_VECTOR_GAME_STYLE_JSON` (28 layers), canonical washi
  overlay, sensing ring, compass, avatar, 72dp controls and map interaction
  roles.
- Semantic: location/route cards and companion sheet use island truth instead
  of the historical Tokyo route and Health Connect values.
- Adapted: MapLibre GL JS replaces Android MapLibre; OSM raster is a lowest-layer
  fallback when Chromium does not request OpenFreeMap PBF tiles. The original
  vector style remains bundled and first-class.
- Excluded: private location history, account data, API credentials, provider
  responses, reference APK bytes and unrelated third-party imagery.

## Evidence limits

This reconciliation proves local Git byte lineage and browser rendering only.
It does not prove App Store/Play Store rights, signed iOS distribution, outdoor
GPS behavior, or human visual approval. Canonical generated assets remain under
the source project's ownership/rights boundary; no independent public asset
license was found in this pass.
