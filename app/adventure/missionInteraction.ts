export type MapPointAction =
  | { kind: "mission"; missionId: string }
  | { kind: "point" };

export function actionForMapPoint(pointId: string): MapPointAction {
  const prefix = "mission:";
  if (!pointId.startsWith(prefix)) return { kind: "point" };
  const missionId = pointId.slice(prefix.length).trim();
  return missionId ? { kind: "mission", missionId } : { kind: "point" };
}
