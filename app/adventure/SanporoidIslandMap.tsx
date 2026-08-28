"use client";

/* eslint-disable @next/next/no-img-element -- canonical Sanporoid raster assets are copied byte-for-byte. */

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, Marker, StyleSpecification } from "maplibre-gl";
import type { MapPoint } from "../discover/island-data";
import styles from "./sanporoid-island-map.module.css";

type Props = {
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
  onOpenMissions: () => void;
  onOpenGuide: () => void;
  onNextIsland: () => void;
};

const glyphs: Record<string, string> = {
  HIKE: "山", VOLCANO: "火", GEOLOGY: "岩", SWIM: "海", SURF: "波", COAST: "岬", SUNSET: "夕",
  STARS: "星", BATH: "湯", CRAFT: "工", ART: "彩", TOWN: "町", FOREST: "森", GATE: "門", "OFFICIAL DATA": "公",
};

export default function SanporoidIslandMap({
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
  onOpenMissions,
  onOpenGuide,
  onNextIsland,
}: Props) {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const pointMarkers = useRef<Marker[]>([]);
  const currentMarker = useRef<Marker | null>(null);
  const [selected, setSelected] = useState<MapPoint | null>(null);
  const [following, setFollowing] = useState(true);
  const [mapStatus, setMapStatus] = useState("Sanporoid地図を準備中");

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
        map = new maplibre.Map({
          container: mapNode.current,
          style: mapStyle,
          center: [center[1], center[0]],
          zoom: 13.7,
          pitch: 34,
          bearing: 0,
          attributionControl: false,
          maxZoom: 19,
          minZoom: 9,
        });
        mapRef.current = map;
        map.addControl(new maplibre.AttributionControl({ compact: true }), "top-left");
        map.dragRotate.disable();
        map.touchZoomRotate.disableRotation();
        map.on("dragstart", () => setFollowing(false));
        pointMarkers.current = points.map((point) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = styles.poiMarker;
          button.textContent = glyphs[point.label] ?? "発";
          button.setAttribute("aria-label", `${point.title}を選ぶ`);
          button.addEventListener("click", () => {
            setSelected(point);
            onSelectionChange?.(point);
            map?.easeTo({ center: [point.position[1], point.position[0]], zoom: Math.max(map.getZoom(), 15.2), duration: 650 });
          });
          return new maplibre.Marker({ element: button, anchor: "bottom" }).setLngLat([point.position[1], point.position[0]]).addTo(map!);
        });
        map.once("style.load", () => {
          if (!map) return;
          const route = points.map((point) => [point.position[1], point.position[0]]);
          map.addSource("island-exploration-route", {
            type: "geojson",
            lineMetrics: true,
            data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: route } },
          });
          map.addLayer({
            id: "island-exploration-route-glow",
            type: "line",
            source: "island-exploration-route",
            paint: { "line-color": "#fff8d8", "line-width": 11, "line-opacity": 0.58, "line-blur": 2 },
            layout: { "line-cap": "round", "line-join": "round" },
          });
          map.addLayer({
            id: "island-exploration-route",
            type: "line",
            source: "island-exploration-route",
            paint: { "line-color": "#2d8b7a", "line-width": 5, "line-opacity": 0.82, "line-dasharray": [1.5, 1.1] },
            layout: { "line-cap": "round", "line-join": "round" },
          });
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
      pointMarkers.current.forEach((marker) => marker.remove());
      pointMarkers.current = [];
      currentMarker.current?.remove();
      currentMarker.current = null;
      map?.remove();
      mapRef.current = null;
    };
  }, [center, onSelectionChange, points]);

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

      <button type="button" className={styles.locationCard} onClick={onNextIsland} aria-label={`${islandName}を表示中。次の島へ切り替える`}>
        <span aria-hidden="true">♥</span>
        <div><strong>{islandName} / {currentPosition ? "現在地" : "島中心"}</strong><small>{currentPosition ? "探索中" : "仮位置で準備中"} · 次の島へ</small></div>
      </button>
      <button type="button" className={styles.clockCard} onClick={onOpenMissions}><strong>{completedCount}/{totalCount}</strong><small>訪問</small></button>
      <button type="button" className={styles.compassButton} onClick={() => mapRef.current?.easeTo({ bearing: 0, duration: 350 })} aria-label="地図を北向きに戻す">△</button>

      <button type="button" className={styles.routeCard} onClick={onOpenMissions}>
        <span><strong>{nextTitle || `${islandName}を開拓`}</strong><small>次の探索地点</small></span>
        <b>{completedCount}/{totalCount}</b>
      </button>

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
      </article>}

      <aside className={styles.companionSheet}>
        <div className={styles.sheetHandle} />
        <header><img src="/sanporoid/map/conversation_sanporoido_icon_map.webp" alt="" /><strong>さんぽろいど</strong><span>{completedCount}/{totalCount} 地点</span></header>
        <p>{selected ? `${selected.title}を選びました。現地の安全と掲示を確認して近づこう。` : locationMessage}</p>
        <nav><button type="button" onClick={onRequestLocation}>✧ まわり</button><button type="button" onClick={onOpenMissions}>◉ 探索開始</button><button type="button" onClick={onOpenGuide}>⌃ 会話をひらく</button></nav>
      </aside>

      <footer className={styles.mapStatus}>{mapStatus} · © OpenStreetMap contributors</footer>
    </section>
  );
}
