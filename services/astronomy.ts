import {
    Body,
    Equator,
    Horizon,
    Observer,
} from "astronomy-engine";

import { CelestialObject } from "@/types/astronomy";

const BODIES = [
  { name: "Sun", body: Body.Sun, type: "sun" },
  { name: "Moon", body: Body.Moon, type: "moon" },
  { name: "Mercury", body: Body.Mercury, type: "planet" },
  { name: "Venus", body: Body.Venus, type: "planet" },
  { name: "Mars", body: Body.Mars, type: "planet" },
  { name: "Jupiter", body: Body.Jupiter, type: "planet" },
  { name: "Saturn", body: Body.Saturn, type: "planet" },
] as const;

export function getVisibleCelestialObjects(params: {
  latitude: number;
  longitude: number;
  date?: Date;
}): CelestialObject[] {
  const date = params.date ?? new Date();

  const observer = new Observer(
    params.latitude,
    params.longitude,
    0
  );

  return BODIES.map((item) => {
    const equator = Equator(item.body, date, observer, true, true);

    const horizon = Horizon(
      date,
      observer,
      equator.ra,
      equator.dec,
      "normal"
    );

    return {
      name: item.name,
      type: item.type,
      altitude: horizon.altitude,
      azimuth: horizon.azimuth,
      isVisible: horizon.altitude > 0,
    };
  });
}