"use client";

/* eslint-disable @next/next/no-img-element -- canonical Sanporoid raster assets are copied byte-for-byte. */

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Map as MapLibreMap, Marker, StyleSpecification } from "maplibre-gl";
import type { MapPoint } from "../discover/island-data";
import { circlePolygon, islandMapProfiles, pointCategory, type IslandMapProfile } from "./islandMapProfiles";
import type { TripIslandSlug } from "./islandKnowledge";
import styles from "./sanporoid-island-map.module.css";

type Props = {
  island: TripIslandSlug;
  profile: IslandMapProfile;
  center: [number, number];
  islandName: string;
  points: MapPoint[];
  currentPosition: [number, number] | null;
  completedCount: number;
  totalCount: number;
  nextTitle: string;
  locationMessage: string;
  onRequestLocation: () => void;
  onSelectionChange?: (point: MapPoint | null) => void;
  missionPanel: ReactNode;
  guidePanel: ReactNode;
  missionAreas: Array<{ id: string; position: [number, number]; radiusMeters: number; index: number; completed: boolean }>;
  onIslandChange: (island: TripIslandSlug) => void;
};

const glyphs: Record<string, string> = {
  HIKE: "山", VOLCANO: "火", GEOLOGY: "岩", SWIM: "海", SURF: "波", COAST: "岬", SUNSET: "夕",
  STARS: "星", BATH: "湯", ONSEN: "湯", "GEO ONSEN": "湯", CRAFT: "工", ART: "彩", TOWN: "町", FOREST: "森",
  GATE: "港", ARRIVAL: "港", FLIGHT: "空", MYTH: "社", HISTORY: "史", CLIFF: "崖", COVE: "湾", BEACH: "浜", VIEW: "眺", "OFFICIAL DATA": "公",
};

export default function SanporoidIslandMap({
  island,
  profile,
  center,
  islandName,
  points,
  currentPosition,
  completedCount,
  totalCount,
  nextTitle,
  locationMessage,
  onRequestLocation,
  onSelectionChange,
  missionPanel,
  guidePanel,
  missionAreas,
  onIslandChange,
}: Props) {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const pointMarkers = useRef<Array<{ marker: Marker; category: string }>>([]);
  const currentMarker = useRef<Marker | null>(null);
  const [selected, setSelected] = useState<MapPoint | null>(null);
  const [following, setFollowing] = useState(true);
  const [mapStatus, setMapStatus] = useState("Sanporoid地図を準備中");
  const [drawer, setDrawer] = useState<"missions" | "guide" | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    if (!mapNode.current) return;
    let cancelled = false;
    let map: MapLibreMap | null = null;
    let networkTimer = 0;

    async function start() {
      try {
        const maplibre = await import("maplibre-gl");
        if (cancelled || !mapNode.current) return;
        const styleResponse = await fetch("/sanporoid/map/sanpo-vector-game-style.json");
        if (!styleResponse.ok) throw new Error("Sanporoid map style is unavailable");
        const mapStyle = await styleResponse.json() as StyleSpecification;
        const openMapTiles = mapStyle.sources.openmaptiles as { type: "vector"; url?: string; tiles?: string[]; minzoom?: number; maxzoom?: number; attribution?: string };
        delete openMapTiles.url;
        openMapTiles.tiles = ["https://tiles.openfreemap.org/planet/{z}/{x}/{y}.pbf"];
        openMapTiles.minzoom = 0;
        openMapTiles.maxzoom = 14;
        mapStyle.sources["osm-raster-fallback"] = {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "© OpenStreetMap contributors",
        };
        mapStyle.layers.splice(1, 0, {
          id: "osm-raster-fallback",
          type: "raster",
          source: "osm-raster-fallback",
          paint: { "raster-opacity": 0.48, "raster-saturation": -0.42, "raster-contrast": -0.08, "raster-brightness-min": 0.22, "raster-brightness-max": 0.92 },
        });
        applyBiomeToStyle(mapStyle, profile);
        map = new maplibre.Map({
          container: mapNode.current,
          style: mapStyle,
          center: [center[1], center[0]],
          zoom: profile.camera.zoom,
          pitch: profile.camera.pitch,
          bearing: profile.camera.bearing,
          attributionControl: false,
          maxZoom: 19,
          minZoom: 9,
        });
        mapRef.current = map;
        map.addControl(new maplibre.AttributionControl({ compact: true }), "top-left");
        map.dragRotate.disable();
        map.touchZoomRotate.disableRotation();
        map.on("dragstart", () => setFollowing(false));
        map.fitBounds(profile.bounds, { padding: { top: 150, right: 96, bottom: 210, left: 76 }, maxZoom: profile.camera.zoom, duration: 0 });
        const missionByPointId = new Map(missionAreas.map((area) => [`mission:${area.id}`, area]));
        pointMarkers.current = points.map((point) => {
          const button = document.createElement("button");
          const mission = missionByPointId.get(point.id);
          const category = pointCategory(profile, point);
          button.type = "button";
          button.className = `${styles.poiMarker} ${mission ? styles.missionMarker : ""} ${mission?.completed ? styles.completedMarker : ""}`;
          button.textContent = mission ? String(mission.index) : glyphs[point.label] ?? "発";
          button.dataset.category = category;
          button.setAttribute("aria-label", `${point.title}を選ぶ`);
          button.addEventListener("click", () => {
            setSelected(point);
            onSelectionChange?.(point);
            map?.easeTo({ center: [point.position[1], point.position[0]], zoom: Math.max(map.getZoom(), 15.2), duration: 650 });
          });
          return { marker: new maplibre.Marker({ element: button, anchor: "bottom" }).setLngLat([point.position[1], point.position[0]]).addTo(map!), category };
        });
        map.once("style.load", () => {
          if (!map) return;
          map.addSource("mission-radius-source", { type: "geojson", data: {
            type: "FeatureCollection",
            features: missionAreas.map((area) => ({ type: "Feature", properties: { id: area.id, completed: area.completed ? 1 : 0 }, geometry: circlePolygon(area.position, area.radiusMeters) })),
          } });
          map.addLayer({ id: "mission-radius-fill", type: "fill", source: "mission-radius-source", paint: { "fill-color": ["case", ["==", ["get", "completed"], 1], "#5fcb67", "#ffd36a"], "fill-opacity": 0.12 } });
          map.addLayer({ id: "mission-radius-line", type: "line", source: "mission-radius-source", paint: { "line-color": ["case", ["==", ["get", "completed"], 1], "#3b9f48", "#c59734"], "line-width": 2, "line-opacity": 0.55, "line-dasharray": [2, 2] } });
          if (missionAreas.length > 1) {
            map.addSource("mission-order-source", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: missionAreas.map((area) => [area.position[1], area.position[0]]) } } });
            map.addLayer({ id: "mission-order-hint", type: "line", source: "mission-order-source", paint: { "line-color": "#7a6950", "line-width": 2.5, "line-opacity": 0.36, "line-dasharray": [1, 3] }, layout: { "line-cap": "round", "line-join": "round" } });
          }
        });
        map.on("load", () => { window.clearTimeout(networkTimer); setMapStatus("Sanporoid MapLibre / OpenFreeMap"); });
        networkTimer = window.setTimeout(() => setMapStatus("Sanporoid Map UI / OSM fallback（OpenFreeMap待機）"), 5000);
        map.on("error", () => setMapStatus("Sanporoid Map UI / OSM fallback"));
      } catch {
        setMapStatus("地図エンジンを開始できません。地点一覧から探索できます");
      }
    }
    void start();
    return () => {
      cancelled = true;
      window.clearTimeout(networkTimer);
      pointMarkers.current.forEach(({ marker }) => marker.remove());
      pointMarkers.current = [];
      currentMarker.current?.remove();
      currentMarker.current = null;
      map?.remove();
      mapRef.current = null;
    };
  }, [center, missionAreas, onSelectionChange, points, profile]);

  useEffect(() => {
    pointMarkers.current.forEach(({ marker, category }) => { marker.getElement().hidden = activeCategory !== "all" && category !== activeCategory; });
    const showMissions = activeCategory === "all" || activeCategory === "mission";
    for (const layerId of ["mission-radius-fill", "mission-radius-line", "mission-order-hint"]) {
      if (mapRef.current?.getLayer(layerId)) mapRef.current.setLayoutProperty(layerId, "visibility", showMissions ? "visible" : "none");
    }
  }, [activeCategory]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !currentPosition) return;
    let disposed = false;
    void import("maplibre-gl").then((maplibre) => {
      if (disposed || !mapRef.current) return;
      const dot = document.createElement("div");
      dot.className = styles.currentDot;
      currentMarker.current?.remove();
      currentMarker.current = new maplibre.Marker({ element: dot }).setLngLat([currentPosition[1], currentPosition[0]]).addTo(mapRef.current);
      if (following) mapRef.current.easeTo({ center: [currentPosition[1], currentPosition[0]], zoom: 15.4, duration: 800 });
    });
    return () => { disposed = true; };
  }, [currentPosition, following]);

  function recenter() {
    setFollowing(true);
    if (!currentPosition) { onRequestLocation(); return; }
    mapRef.current?.easeTo({ center: [currentPosition[1], currentPosition[0]], zoom: 15.4, pitch: 34, duration: 650 });
  }

  function changeZoom(delta: number) {
    const map = mapRef.current;
    if (!map) return;
    setFollowing(false);
    map.easeTo({ zoom: Math.max(9, Math.min(19, map.getZoom() + delta)), duration: 300 });
  }

  return (
    <section className={styles.shell} aria-label={`${islandName}のSanporoid探索地図`}>
      <div className={styles.mapCanvas} ref={mapNode} />
      <div className={styles.washiOverlay} aria-hidden="true" />

      <div className={styles.locationCard}>
        <span aria-hidden="true">♥</span>
        <div><strong>{islandName} / {currentPosition ? "現在地" : "島中心"}</strong><small>{currentPosition ? "探索中" : "仮位置で準備中"}</small></div>
      </div>
      <nav className={styles.islandSwitcher} aria-label="3島を切り替える">
        {(Object.entries(islandMapProfiles) as Array<[TripIslandSlug, IslandMapProfile]>).map(([slug, entry]) => <button type="button" className={slug === island ? styles.activeIsland : ""} aria-pressed={slug === island} onClick={() => onIslandChange(slug)} key={slug}><b>{entry.shortName}</b><span>{entry.name}</span></button>)}
      </nav>
      <button type="button" className={styles.clockCard} onClick={() => setDrawer("missions")}><strong>{completedCount}/{totalCount}</strong><small>訪問</small></button>
      <button type="button" className={styles.compassButton} onClick={() => mapRef.current?.easeTo({ bearing: 0, duration: 350 })} aria-label="地図を北向きに戻す">△</button>

      <button type="button" className={styles.routeCard} onClick={() => setDrawer("missions")}>
        <span><strong>{nextTitle || `${islandName}を開拓`}</strong><small>次の探索地点</small></span>
        <b>{completedCount}/{totalCount}</b>
      </button>

      <div className={styles.categoryFilters} aria-label={`${islandName}の地点カテゴリ`}>
        {profile.categories.map((category) => <button type="button" aria-pressed={activeCategory === category.id} className={activeCategory === category.id ? styles.activeCategory : ""} onClick={() => setActiveCategory(category.id)} key={category.id}>{category.label}</button>)}
      </div>

      <div className={styles.floatingControls}>
        <button type="button" className={following ? styles.controlActive : ""} onClick={recenter}><b>⌖</b><span>現在地</span></button>
        <button type="button" onClick={() => changeZoom(1)}><b>＋</b><span>拡大</span></button>
        <button type="button" onClick={() => changeZoom(-1)}><b>−</b><span>縮小</span></button>
      </div>

      <div className={styles.playerHud} aria-label={following ? "現在地を追跡中" : "地図を見渡し中"}>
        <img className={styles.sensingRing} src="/sanporoid/map/sanpo_sensing_ring_wa.png" alt="" />
        <img className={styles.compass} src="/sanporoid/map/sanpo_compass_wa.png" alt="" />
        <img className={styles.avatar} src="/sanporoid/map/avatar_idle_n_01.webp" alt="地図上のさんぽろいど" />
        <span>{following ? "いまここ" : "見渡し中"}</span>
      </div>

      {selected && <article className={styles.selectionCard}>
        <button type="button" onClick={() => { setSelected(null); onSelectionChange?.(null); }} aria-label="地点カードを閉じる">×</button>
        <small>{selected.label}</small><strong>{selected.title}</strong><p>{selected.summary}</p>
        <details><summary>情報・注意・出典</summary><div>{selected.researchedFacts?.length ? <ul>{selected.researchedFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul> : <p>地図に登録された候補地点です。現地掲示を優先してください。</p>}{selected.cautions?.length ? <><b>注意</b><ul>{selected.cautions.map((caution) => <li key={caution}>{caution}</li>)}</ul></> : null}{selected.sources?.length ? <nav>{selected.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label}</a>)}</nav> : null}</div></details>
      </article>}

      {drawer && <section className={styles.infoDrawer} aria-label={drawer === "missions" ? "地図内の任務" : "地図内の島案内"}>
        <header><div><small>SANPOROID MAP SHEET</small><strong>{drawer === "missions" ? "近くの任務と写真" : "島の情報を聞く"}</strong></div><button type="button" onClick={() => setDrawer(null)} aria-label="地図シートを閉じる">×</button></header>
        <div>{drawer === "missions" ? missionPanel : guidePanel}</div>
      </section>}

      <aside className={styles.companionSheet}>
        <div className={styles.sheetHandle} />
        <header><img src="/sanporoid/map/conversation_sanporoido_icon_map.webp" alt="" /><strong>さんぽろいど</strong><span>{completedCount}/{totalCount} 地点</span></header>
        <p>{selected ? `${selected.title}を選びました。現地の安全と掲示を確認して近づこう。` : locationMessage}</p>
        <small className={styles.islandSafety}>{profile.safetyNote}</small>
        <div className={styles.mapLinks}><a href={profile.officialMapUrl} target="_blank" rel="noreferrer">公式MAP</a><a href={profile.hazardUrl} target="_blank" rel="noreferrer">防災データ</a></div>
        <nav><button type="button" onClick={onRequestLocation}>✧ まわり</button><button type="button" onClick={() => setDrawer("missions")}>◉ 探索開始</button><button type="button" onClick={() => setDrawer("guide")}>⌃ 会話をひらく</button></nav>
      </aside>

      <footer className={styles.mapStatus}>{mapStatus} · 順番線は徒歩経路ではありません · © OpenStreetMap contributors</footer>
    </section>
  );
}

function applyBiomeToStyle(style: StyleSpecification, profile: IslandMapProfile) {
  const layers = style.layers as Array<{ id: string; paint?: Record<string, unknown> }>;
  const setPaint = (id: string, property: string, value: string) => {
    const layer = layers.find((candidate) => candidate.id === id);
    if (layer?.paint) layer.paint[property] = value;
  };
  setPaint("background", "background-color", profile.biome.background);
  setPaint("water", "fill-color", profile.biome.water);
  setPaint("waterway", "line-color", profile.biome.water);
  setPaint("park", "fill-color", profile.biome.park);
  setPaint("landcover-grass", "fill-color", profile.biome.park);
  setPaint("road-major", "line-color", profile.biome.majorRoad);
  setPaint("road-minor", "line-color", profile.biome.minorRoad);
}
