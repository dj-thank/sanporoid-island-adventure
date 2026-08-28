export type CatalogStar = {
  name: string;
  japanese: string;
  constellation: string;
  constellationCode: string;
  raHours: number;
  decDegrees: number;
  magnitude: number;
};

export type SkyStar = CatalogStar & {
  altitude: number;
  azimuth: number;
  delta: number;
};

export type ProjectedStar = SkyStar & {
  x: number;
  y: number;
  inView: boolean;
};

export function deviceViewFromOrientation({ alpha, beta, gamma, fallbackHeading }: {
  alpha: number;
  beta: number;
  gamma: number;
  fallbackHeading?: number;
}) {
  const x = radians(beta);
  const y = radians(gamma);
  const z = radians(alpha);
  const viewX = -Math.cos(z) * Math.sin(y) - Math.sin(z) * Math.sin(x) * Math.cos(y);
  const viewY = -Math.sin(z) * Math.sin(y) + Math.cos(z) * Math.sin(x) * Math.cos(y);
  const viewZ = -Math.cos(x) * Math.cos(y);
  const horizontalLength = Math.hypot(viewX, viewY);
  const heading = horizontalLength < 0.035 && Number.isFinite(fallbackHeading)
    ? normalizeDegrees(fallbackHeading as number)
    : horizontalLength < 1e-6
      ? normalizeDegrees(360 - alpha)
      : normalizeDegrees(degrees(Math.atan2(viewX, viewY)));
  const altitude = clamp(degrees(Math.asin(clamp(viewZ, -1, 1))), -90, 90);
  return { heading: snapAngle(heading), altitude: snapAngle(altitude) };
}

export function isHeadingReliable(beta: number, gamma: number) {
  const x = radians(beta);
  const y = radians(gamma);
  const horizontalLength = Math.hypot(
    Math.sin(y),
    Math.sin(x) * Math.cos(y),
  );
  return horizontalLength >= 0.035;
}

export function sensorSmoothingAmount(deltaDegrees: number, elapsedMs: number, accuracy?: number) {
  const delta = Math.abs(normalizeSigned(deltaDegrees));
  const base = delta < 2 ? 0.12 : delta < 10 ? 0.23 : delta < 35 ? 0.42 : 0.72;
  const timeFactor = clamp(elapsedMs / 45, 0.7, 1.35);
  const accuracyFactor = accuracy !== undefined && accuracy > 25 ? 0.72 : 1;
  return clamp(base * timeFactor * accuracyFactor, 0.08, 0.78);
}

export function apparentAltitude(geometricAltitude: number) {
  if (geometricAltitude <= -1 || geometricAltitude >= 89.9) return geometricAltitude;
  const correctionArcMinutes = 1.02 / Math.tan(radians(geometricAltitude + 10.3 / (geometricAltitude + 5.11)));
  return clamp(geometricAltitude + correctionArcMinutes / 60, -90, 90);
}

export function smoothHeading(previous: number, next: number, amount = 0.18) {
  return normalizeDegrees(previous + normalizeSigned(next - previous) * amount);
}

export function calculateSky(catalog: CatalogStar[], date: Date, latitude: number, longitude: number, heading: number): SkyStar[] {
  const julianDate = date.getTime() / 86_400_000 + 2440587.5;
  const days = julianDate - 2451545;
  const localSidereal = normalizeDegrees(280.46061837 + 360.98564736629 * days + longitude);
  const lat = radians(latitude);
  return catalog.map((star) => {
    const hourAngle = radians(normalizeSigned(localSidereal - star.raHours * 15));
    const dec = radians(star.decDegrees);
    const altitude = Math.asin(Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(hourAngle));
    const azimuth = Math.atan2(-Math.sin(hourAngle) * Math.cos(dec), Math.sin(dec) * Math.cos(lat) - Math.cos(dec) * Math.sin(lat) * Math.cos(hourAngle));
    const azimuthDegrees = normalizeDegrees(degrees(azimuth));
    return { ...star, altitude: apparentAltitude(degrees(altitude)), azimuth: azimuthDegrees, delta: normalizeSigned(azimuthDegrees - heading) };
  });
}

export function projectStar(star: SkyStar, viewAltitude: number, horizontalFov = 150, verticalFov = 100): ProjectedStar {
  const x = 50 + star.delta / horizontalFov * 100;
  const y = 50 - (star.altitude - viewAltitude) / verticalFov * 100;
  return { ...star, x, y, inView: Math.abs(star.delta) <= horizontalFov / 2 && Math.abs(star.altitude - viewAltitude) <= verticalFov / 2 };
}

export function normalizeDegrees(value: number) { return ((value % 360) + 360) % 360; }
export function normalizeSigned(value: number) { const normalized = normalizeDegrees(value); return normalized > 180 ? normalized - 360 : normalized; }
export function cardinal(value: number) { return ["北", "北東", "東", "南東", "南", "南西", "西", "北西"][Math.round(normalizeDegrees(value) / 45) % 8]; }
export function sideLabel(delta: number) { return Math.abs(delta) < 8 ? "正面" : delta > 0 ? "右側" : "左側"; }
export function radians(value: number) { return value * Math.PI / 180; }
export function degrees(value: number) { return value * 180 / Math.PI; }
function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }
function snapAngle(value: number) {
  if (Math.abs(value) < 1e-10) return 0;
  if (Math.abs(value - 90) < 1e-10) return 90;
  if (Math.abs(value + 90) < 1e-10) return -90;
  return value;
}
