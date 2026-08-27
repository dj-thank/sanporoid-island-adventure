"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { LatLng, MapPoint, MapRoute } from "./island-data";
import styles from "./discover.module.css";

type Props = {
  center: LatLng;
  zoom: number;
  points: MapPoint[];
  routes?: MapRoute[];
  label: string;
  tone?: "light" | "dark";
};

const pointColors: Record<string, string> = {
  HIKE: "#f15a3a",
  VOLCANO: "#f15a3a",
  GEOLOGY: "#f15a3a",
  SWIM: "#087b88",
  SURF: "#087b88",
  COAST: "#087b88",
  SUNSET: "#e29432",
  STARS: "#162f4a",
  BATH: "#8a4d79",
  CRAFT: "#768b35",
  ART: "#768b35",
  TOWN: "#5a655e",
  FOREST: "#426443",
  GATE: "#151b1c",
  FLIGHT: "#151b1c",
  TOKYO: "#151b1c",
};

export default function IslandMap({ center, zoom, points, routes = [], label, tone = "light" }: Props) {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function createMap() {
      if (!mapElement.current || mapInstance.current) return;
      const L = await import("leaflet");
      if (cancelled || !mapElement.current) return;

      const map = L.map(mapElement.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: true,
      }).setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      routes.forEach((route) => {
        L.polyline(route.positions, {
          color: route.color,
          weight: 4,
          opacity: 0.9,
          dashArray: route.dash ? "9 9" : undefined,
          lineCap: "round",
        })
          .bindTooltip(route.label, { sticky: true })
          .addTo(map);
      });

      points.forEach((point) => {
        const marker = L.circleMarker(point.position, {
          radius: point.label === "TOKYO" || point.label === "FLIGHT" ? 6 : 8,
          color: "#fffdf4",
          weight: 3,
          fillColor: pointColors[point.label] ?? "#f15a3a",
          fillOpacity: 1,
        });

        const popup = document.createElement("div");
        popup.className = "island-map-popup";
        const kicker = document.createElement("small");
        kicker.textContent = point.label;
        const title = document.createElement("strong");
        title.textContent = point.title;
        const copy = document.createElement("p");
        copy.textContent = point.summary;
        popup.append(kicker, title, copy);
        if (point.researchedFacts?.length) {
          const factsTitle = document.createElement("b");
          factsTitle.textContent = "調査で確認できたこと";
          const facts = document.createElement("ul");
          point.researchedFacts.forEach((fact) => {
            const item = document.createElement("li");
            item.textContent = fact;
            facts.append(item);
          });
          popup.append(factsTitle, facts);
        }
        if (point.cautions?.length) {
          const warning = document.createElement("p");
          warning.textContent = `当日確認: ${point.cautions.join("、")}`;
          warning.setAttribute("role", "note");
          popup.append(warning);
        }
        point.sources?.slice(0, 3).forEach((source) => {
          const link = document.createElement("a");
          link.href = source.url;
          link.target = "_blank";
          link.rel = "noreferrer";
          link.textContent = `${source.label} ↗`;
          popup.append(link);
        });

        marker.bindPopup(popup).bindTooltip(point.title, { direction: "top", offset: [0, -7] }).addTo(map);
      });

      mapInstance.current = map;
      setReady(true);
    }

    createMap();

    return () => {
      cancelled = true;
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [center, points, routes, zoom]);

  return (
    <div className={`${styles.mapFrame} ${tone === "dark" ? styles.mapFrameDark : ""}`} aria-label={label}>
      <div className={styles.mapToolbar}>
        <span>LIVE GEOGRAPHY</span>
        <p>ドラッグで移動 · ＋−で拡大</p>
      </div>
      <div ref={mapElement} className={styles.mapCanvas} />
      {!ready && <div className={styles.mapLoading}>地図を読み込んでいます</div>}
    </div>
  );
}
