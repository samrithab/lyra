import { DeviceMotion, Magnetometer } from "expo-sensors";

export function calculateHeading(data: {
  x: number;
  y: number;
  z: number;
}): number {
  let heading = Math.atan2(data.x, data.y) * (180 / Math.PI);

  if (heading < 0) {
    heading += 360;
  }

  heading = (heading + 180) % 360;

  return Math.round(heading);
}

export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export { DeviceMotion, Magnetometer };
