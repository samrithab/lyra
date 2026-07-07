import { Magnetometer } from "expo-sensors";

export function calculateHeading(data: {
  x: number;
  y: number;
  z: number;
}): number {
  let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);

  if (angle < 0) {
    angle += 360;
  }

  return Math.round(angle);
}

export { Magnetometer };
