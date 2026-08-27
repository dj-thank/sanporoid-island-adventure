# HYG bright-star data attribution

The generated file `app/adventure/hyg-bright-stars-v41.json` is a magnitude
limited extract of **HYG Database v4.1** by David Nash / Astronexus.

- Upstream: <https://github.com/astronexus/HYG-Database/tree/main/hyg/CURRENT>
- Upstream file: `hygdata_v41.csv`
- Upstream SHA-256: `D9F69FD86BBF90A4E4D52B4C5C53EACFA6DFC0BFDEF85BFD94F095E0BEBE4EBD`
- Derived file SHA-256: `0FF410F64D010022D896F2CA15CBCD5106BC6894E3D28DE09ABE6ED4B63854B7`
- Upstream and derived-data license: [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/)
- Selection: rows with valid `ra`, `dec`, and `mag <= 5.0`; 1,638 stars.
- Retained fields: HYG/HIP ID, proper/designation name, J2000 RA/Dec,
  apparent magnitude, constellation abbreviation, spectral type, color index.

The derived JSON is offered under CC BY-SA 4.0. Application source outside
this data file is not represented as HYG-derived material.
