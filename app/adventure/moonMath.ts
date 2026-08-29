import {
  Body,
  Equator,
  Horizon,
  Illumination,
  MoonPhase,
  Observer,
  SearchRiseSet,
} from "astronomy-engine";
import { cardinal, normalizeSigned } from "./starMath";

export type MoonPosition = {
  altitude: number;
  azimuth: number;
  direction: string;
  delta: number;
  phaseAngle: number;
  phaseLabel: string;
  illumination: number;
  ageDays: number;
  waxing: boolean;
};

export type MoonEvent = {
  at: Date;
  azimuth: number;
  direction: string;
};

export type MoonEvents = {
  rise: MoonEvent | null;
  set: MoonEvent | null;
};

export type MoonSnapshot = MoonPosition & MoonEvents;

const synodicMonthDays = 29.530588853;

export function calculateMoonPosition(
  date: Date,
  latitude: number,
  longitude: number,
  heading = 0,
): MoonPosition {
  const observer = new Observer(latitude, longitude, 0);
  const equatorial = Equator(Body.Moon, date, observer, true, true);
  const horizontal = Horizon(date, observer, equatorial.ra, equatorial.dec, "normal");
  const phaseAngle = MoonPhase(date);
  const illumination = Illumination(Body.Moon, date).phase_fraction;

  return {
    altitude: horizontal.altitude,
    azimuth: horizontal.azimuth,
    direction: cardinal(horizontal.azimuth),
    delta: normalizeSigned(horizontal.azimuth - heading),
    phaseAngle,
    phaseLabel: moonPhaseLabel(phaseAngle),
    illumination,
    ageDays: phaseAngle / 360 * synodicMonthDays,
    waxing: phaseAngle < 180,
  };
}

export function calculateMoonEvents(
  date: Date,
  latitude: number,
  longitude: number,
  limitDays = 3,
): MoonEvents {
  const observer = new Observer(latitude, longitude, 0);
  return {
    rise: moonEvent(observer, date, +1, limitDays),
    set: moonEvent(observer, date, -1, limitDays),
  };
}

export function calculateMoonSnapshot(
  date: Date,
  latitude: number,
  longitude: number,
  heading = 0,
): MoonSnapshot {
  return {
    ...calculateMoonPosition(date, latitude, longitude, heading),
    ...calculateMoonEvents(date, latitude, longitude),
  };
}

export function moonPhaseLabel(phaseAngle: number) {
  const phase = ((phaseAngle % 360) + 360) % 360;
  if (phase < 22.5 || phase >= 337.5) return "新月";
  if (phase < 67.5) return "満ちていく三日月";
  if (phase < 112.5) return "上弦";
  if (phase < 157.5) return "満ちていく月";
  if (phase < 202.5) return "満月";
  if (phase < 247.5) return "欠けていく月";
  if (phase < 292.5) return "下弦";
  return "明け方の細い月";
}

export function moonPhaseGlyph(phaseAngle: number) {
  const phase = ((phaseAngle % 360) + 360) % 360;
  return ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"][Math.floor((phase + 22.5) / 45) % 8];
}

function moonEvent(observer: Observer, start: Date, direction: 1 | -1, limitDays: number): MoonEvent | null {
  const event = SearchRiseSet(Body.Moon, observer, direction, start, limitDays);
  if (!event) return null;
  const equatorial = Equator(Body.Moon, event.date, observer, true, true);
  const horizontal = Horizon(event.date, observer, equatorial.ra, equatorial.dec, "normal");
  return {
    at: event.date,
    azimuth: horizontal.azimuth,
    direction: cardinal(horizontal.azimuth),
  };
}
