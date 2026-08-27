"use client";

import "cesium/Build/Cesium/Widgets/widgets.css";
import { useEffect, useRef, useState } from "react";
import type { Entity, Viewer as CesiumViewer } from "cesium";
import type { MapPoint } from "../discover/island-data";
import styles from "./cesium-island-map.module.css";

type Props = {
  center: [number, number];
  islandName: string;
  points: MapPoint[];
  currentPosition: [number, number] | null;
  onRequestLocation: () => void;
};

const pointColors: Record<string, string> = {
  HIKE: "#f15a3a", VOLCANO: "#f15a3a", GEOLOGY: "#f15a3a", SWIM: "#087b88", SURF: "#087b88",
  COAST: "#087b88", SUNSET: "#e29432", STARS: "#6657c7", BATH: "#8a4d79", CRAFT: "#768b35",
  ART: "#768b35", TOWN: "#5a655e", FOREST: "#426443", GATE: "#151b1c", "OFFICIAL DATA": "#0c6573",
};

export default function CesiumIslandMap({ center, islandName, points, currentPosition, onRequestLocation }: Props) {
  const shellRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<CesiumViewer | null>(null);
  const cesiumRef = useRef<typeof import("cesium") | null>(null);
  const [selected, setSelected] = useState<MapPoint | null>(null);
  const [status, setStatus] = useState("地図までスクロールするか「3D起動」を押すと読み込みます。");
  const [mode, setMode] = useState<"3D" | "2D">("3D");
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || typeof IntersectionObserver === "undefined") {
      const fallback = window.setTimeout(() => setShouldLoad(true), 0);
      return () => window.clearTimeout(fallback);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShouldLoad(true); observer.disconnect(); }
    }, { rootMargin: "300px" });
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let selectedListener: (() => void) | undefined;
    let imageryErrorListener: (() => void) | undefined;

    async function initialize() {
      if (!shouldLoad || !containerRef.current || viewerRef.current) return;
      try {
        const Cesium = await import("cesium");
        if (cancelled || !containerRef.current) return;
        cesiumRef.current = Cesium;
        const imagery = new Cesium.OpenStreetMapImageryProvider({ url: "https://tile.openstreetmap.org/" });
        const viewer = new Cesium.Viewer(containerRef.current, {
          baseLayer: new Cesium.ImageryLayer(imagery),
          terrainProvider: new Cesium.EllipsoidTerrainProvider(),
          animation: false,
          timeline: false,
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          navigationHelpButton: false,
          sceneModePicker: false,
          fullscreenButton: false,
          infoBox: false,
          selectionIndicator: true,
          requestRenderMode: true,
          maximumRenderTimeChange: 30,
        });
        viewerRef.current = viewer;
        let fallbackActive = false;
        imageryErrorListener = imagery.errorEvent.addEventListener(() => {
          if (fallbackActive || viewer.isDestroyed()) return;
          fallbackActive = true;
          viewer.imageryLayers.removeAll();
          viewer.imageryLayers.add(new Cesium.ImageryLayer(new Cesium.GridImageryProvider({
            color: Cesium.Color.fromCssColorString("#49747d"),
            glowColor: Cesium.Color.fromCssColorString("#0d2d35"),
            backgroundColor: Cesium.Color.fromCssColorString("#06171d"),
          })));
          setStatus("画像地図へ接続できないため、オフライン格子と保存済み地点で表示しています。");
        });
        viewer.scene.globe.enableLighting = true;
        viewer.scene.globe.showGroundAtmosphere = true;
        viewer.scene.fog.enabled = true;
        viewer.scene.fog.density = 0.0002;
        viewer.resolutionScale = Math.min(window.devicePixelRatio, 1.35);
        viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;

        addPointEntities(Cesium, viewer, points);
        flyHome(Cesium, viewer, center);
        selectedListener = viewer.selectedEntityChanged.addEventListener((entity?: Entity) => {
          const point = entity ? points.find((candidate) => candidate.id === entity.id) ?? null : null;
          setSelected(point);
        });
        setStatus("地点を押すと、島情報・現行注意・公式出典を表示します。");
      } catch (error) {
        setStatus(error instanceof Error ? `3D地図を開始できません: ${error.message}` : "3D地図を開始できません。地点一覧は下で確認できます。");
      }
    }

    void initialize();
    return () => {
      cancelled = true;
      selectedListener?.();
      imageryErrorListener?.();
      if (viewerRef.current && !viewerRef.current.isDestroyed()) viewerRef.current.destroy();
      viewerRef.current = null;
      cesiumRef.current = null;
    };
  }, [center, points, shouldLoad]);

  useEffect(() => {
    const Cesium = cesiumRef.current;
    const viewer = viewerRef.current;
    if (!Cesium || !viewer || viewer.isDestroyed()) return;
    viewer.entities.removeById("sanporoid-current-location");
    if (currentPosition) {
      viewer.entities.add({
        id: "sanporoid-current-location",
        name: "現在地",
        position: Cesium.Cartesian3.fromDegrees(currentPosition[1], currentPosition[0], 18),
        point: { pixelSize: 15, color: Cesium.Color.fromCssColorString("#d6ea4b"), outlineColor: Cesium.Color.fromCssColorString("#17323a"), outlineWidth: 4, disableDepthTestDistance: Number.POSITIVE_INFINITY },
        label: { text: "現在地", font: "700 14px sans-serif", fillColor: Cesium.Color.WHITE, showBackground: true, backgroundColor: Cesium.Color.fromCssColorString("#17323a").withAlpha(0.86), pixelOffset: new Cesium.Cartesian2(0, -26), disableDepthTestDistance: Number.POSITIVE_INFINITY },
      });
      viewer.scene.requestRender();
    }
  }, [currentPosition]);

  function resetView() {
    const Cesium = cesiumRef.current;
    const viewer = viewerRef.current;
    if (Cesium && viewer) flyHome(Cesium, viewer, center);
  }

  function toggleMode() {
    const viewer = viewerRef.current;
    if (!viewer) return;
    if (mode === "3D") {
      viewer.scene.morphTo2D(0.8);
      setMode("2D");
    } else {
      viewer.scene.morphTo3D(0.8);
      setMode("3D");
    }
  }

  return (
    <section ref={shellRef} className={styles.cesiumShell} aria-label={`${islandName}のCesium開拓地図`}>
      <div className={styles.toolbar}>
        <div><small>CESIUM 3D ISLAND EXPLORER</small><strong>{islandName} · {points.length}地点レイヤー</strong></div>
        <div><button onClick={() => setShouldLoad(true)} disabled={shouldLoad}>{shouldLoad ? "3D読込済み" : "3D起動"}</button><button onClick={onRequestLocation}>現在地</button><button onClick={resetView}>島全体</button><button onClick={toggleMode}>{mode === "3D" ? "2Dへ" : "3Dへ"}</button></div>
      </div>
      <div className={styles.viewport} ref={containerRef} />
      <p className={styles.status} aria-live="polite">{status}</p>
      {selected ? <article className={styles.selectedCard}>
        <div><small>{selected.label}</small><h3>{selected.title}</h3><p>{selected.summary}</p></div>
        <div>{selected.researchedFacts?.length ? <><strong>調査で確認できたこと</strong><ul>{selected.researchedFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul></> : <p>地点の基本情報を表示しています。</p>}</div>
        <div className={styles.caution}><strong>当日確認</strong><ul>{(selected.cautions ?? ["運航・通行・天候・営業を公式案内で確認"]).map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div className={styles.sourceLinks}>{selected.sources?.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label} ↗</a>)}</div>
      </article> : <div className={styles.emptyCard}>地図上の丸い地点を押すと、Sanporoidの島情報がここに開きます。</div>}
      <p className={styles.boundary}>CesiumJS / OpenStreetMap。3D表示は観光・探索用であり、海上航法・避難経路・登山路の安全証明には使用しません。地形・画像タイルは通信時に取得します。</p>
    </section>
  );
}

function addPointEntities(Cesium: typeof import("cesium"), viewer: CesiumViewer, points: MapPoint[]) {
  points.forEach((point) => {
    viewer.entities.add({
      id: point.id,
      name: point.title,
      position: Cesium.Cartesian3.fromDegrees(point.position[1], point.position[0], 24),
      point: {
        pixelSize: point.label === "OFFICIAL DATA" ? 12 : 10,
        color: Cesium.Color.fromCssColorString(pointColors[point.label] ?? "#f15a3a"),
        outlineColor: Cesium.Color.fromCssColorString("#fffdf4"),
        outlineWidth: 3,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: point.title,
        font: "700 12px sans-serif",
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 3,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(0, -21),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 35_000),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
  });
}

function flyHome(Cesium: typeof import("cesium"), viewer: CesiumViewer, center: [number, number]) {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(center[1], center[0], 12_000),
    orientation: { heading: 0, pitch: Cesium.Math.toRadians(-48), roll: 0 },
    duration: 1.1,
  });
}
