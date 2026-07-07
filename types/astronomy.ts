export interface CelestialObject {
  name: string;
  type: "sun" | "moon" | "planet";
  altitude: number;
  azimuth: number;
  isVisible: boolean;
}