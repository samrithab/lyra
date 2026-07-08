import { CelestialObject } from "@/types/astronomy";
import { StyleSheet, Text, View } from "react-native";

interface SkyCanvasProps {
  objects: CelestialObject[];
  heading: number | null;
  pitch: number | null;
}

const WINDOW_WIDTH = 340;
const WINDOW_HEIGHT = 280;
const HORIZON_Y = 210;
const HORIZONTAL_FOV = 70;

export function SkyCanvas({ objects, heading }: SkyCanvasProps) {
  function normalizeAngle(angle: number) {
    let value = angle;

    while (value > 180) value -= 360;
    while (value < -180) value += 360;

    return value;
  }

  function getDirectionLabel(degrees: number | null) {
    if (degrees === null) return "Calibrating...";

    if (degrees >= 337.5 || degrees < 22.5) return "North";
    if (degrees >= 22.5 && degrees < 67.5) return "Northeast";
    if (degrees >= 67.5 && degrees < 112.5) return "East";
    if (degrees >= 112.5 && degrees < 157.5) return "Southeast";
    if (degrees >= 157.5 && degrees < 202.5) return "South";
    if (degrees >= 202.5 && degrees < 247.5) return "Southwest";
    if (degrees >= 247.5 && degrees < 292.5) return "West";
    return "Northwest";
  }

  function projectObject(object: CelestialObject) {
    if (heading === null) return null;

    const relativeAzimuth = normalizeAngle(object.azimuth - heading);

    if (Math.abs(relativeAzimuth) > HORIZONTAL_FOV / 2) {
      return null;
    }

    const x =
      WINDOW_WIDTH / 2 +
      (relativeAzimuth / (HORIZONTAL_FOV / 2)) * (WINDOW_WIDTH / 2 - 28);

    // altitude 0° = horizon, 90° = top
    const clampedAltitude = Math.max(0, Math.min(90, object.altitude));

    const y = HORIZON_Y - (clampedAltitude / 90) * (HORIZON_Y - 24);

    return { x, y, relativeAzimuth };
  }

  const visibleObjects = objects
    .filter((object) => object.isVisible)
    .map((object) => ({
      ...object,
      position: projectObject(object),
    }))
    .filter((object) => object.position !== null);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>
        Facing {getDirectionLabel(heading)}{" "}
        {heading !== null ? `(${heading}°)` : ""}
      </Text>

      <View style={styles.window}>
        <Text style={styles.skyLabel}>Sky</Text>

        {visibleObjects.map((object) => (
          <View
            key={object.name}
            style={[
              styles.object,
              {
                left: object.position!.x,
                top: object.position!.y,
              },
            ]}
          >
            <Text style={styles.objectSymbol}>
              {object.type === "sun" ? "☀" : object.type === "moon" ? "☾" : "●"}
            </Text>
            <Text style={styles.objectName}>{object.name}</Text>
          </View>
        ))}

        <View style={styles.horizonLine} />
        <Text style={styles.horizonText}>Horizon</Text>

        <View style={styles.ground} />
      </View>

      <Text style={styles.caption}>
        Objects appear only when they are within your current facing direction.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  heading: {
    color: "#e0f2fe",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  window: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#334155",
    position: "relative",
  },
  skyLabel: {
    position: "absolute",
    top: 14,
    alignSelf: "center",
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  object: {
    position: "absolute",
    alignItems: "center",
    transform: [{ translateX: -18 }, { translateY: -18 }],
  },
  objectSymbol: {
    color: "#facc15",
    fontSize: 18,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowRadius: 6,
  },
  objectName: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowRadius: 6,
  },
  horizonLine: {
    position: "absolute",
    top: HORIZON_Y,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#94a3b8",
  },
  horizonText: {
    position: "absolute",
    top: HORIZON_Y + 6,
    alignSelf: "center",
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "700",
  },
  ground: {
    position: "absolute",
    top: HORIZON_Y + 1,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
  },
  caption: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 12,
    textAlign: "center",
    maxWidth: 320,
  },
});