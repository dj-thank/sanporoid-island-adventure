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

export function deviceViewFromOrientation({ alpha, beta, gamma, screenAngle = 0 }: {
  alpha: number;
  beta: number;
  gamma: number;
  screenAngle?: number;
}) {
  const landscape = Math.abs(screenAngle) === 90;
  return {
    heading: normalizeDegrees(360 - alpha + screenAngle),
    altitude: clamp(90 - Math.abs(landscape ? gamma : beta), -10, 90),
  };
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
    return { ...star, altitude: degrees(altitude), azimuth: azimuthDegrees, delta: normalizeSigned(azimuthDegrees - heading) };
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
