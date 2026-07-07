import { CelestialObject } from "@/types/astronomy";
import { Canvas, Circle, Line } from "@shopify/react-native-skia";
import { StyleSheet, Text, View } from "react-native";

interface SkyCanvasProps {
  objects: CelestialObject[];
  heading: number | null;
  pitch: number | null;
}

const stars = [
  { x: 60, y: 55 }, { x: 110, y: 90 }, { x: 250, y: 70 },
  { x: 290, y: 130 }, { x: 80, y: 210 }, { x: 220, y: 230 },
  { x: 155, y: 45 }, { x: 300, y: 250 }, { x: 45, y: 280 },
  { x: 180, y: 160 },
];

const constellationLines = [
  [{ x: 95, y: 120 }, { x: 130, y: 155 }],
  [{ x: 130, y: 155 }, { x: 165, y: 120 }],
  [{ x: 130, y: 155 }, { x: 125, y: 210 }],
  [{ x: 125, y: 210 }, { x: 95, y: 250 }],
  [{ x: 125, y: 210 }, { x: 165, y: 250 }],
];

export function SkyCanvas({ objects, heading }: SkyCanvasProps) {
  const width = 340;
  const height = 340;
  const centerX = width / 2;
  const centerY = height / 2;

  function projectObject(object: CelestialObject) {
    const currentHeading = heading ?? 0;

    let relativeAzimuth = object.azimuth - currentHeading;

    if (relativeAzimuth > 180) relativeAzimuth -= 360;
    if (relativeAzimuth < -180) relativeAzimuth += 360;

    const x = centerX + relativeAzimuth * 2.2;
    const y = centerY - object.altitude * 2.2;

    return { x, y };
  }

  const visibleObjects = objects
    .filter((object) => object.isVisible)
    .map((object) => ({
      ...object,
      position: projectObject(object),
    }))
    .filter(
      (object) =>
        object.position.x > 24 &&
        object.position.x < width - 24 &&
        object.position.y > 24 &&
        object.position.y < height - 24
    );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>
        {heading !== null ? `${heading}°` : "Calibrating..."}
      </Text>

      <View style={styles.sky}>
        <Canvas style={{ width, height }}>
          <Circle cx={centerX} cy={centerY} r={165} color="#020617" />
          <Circle cx={centerX} cy={centerY} r={164} color="#0f172a" />

          {stars.map((star, index) => (
            <Circle
              key={`star-${index}`}
              cx={star.x}
              cy={star.y}
              r={1.5}
              color="#e0f2fe"
            />
          ))}

          {constellationLines.map((line, index) => (
            <Line
              key={`line-${index}`}
              p1={line[0]}
              p2={line[1]}
              color="#475569"
              strokeWidth={1}
            />
          ))}

          <Line
            p1={{ x: 28, y: centerY }}
            p2={{ x: width - 28, y: centerY }}
            color="#334155"
            strokeWidth={1}
          />

          <Circle cx={centerX} cy={centerY} r={4} color="#ffffff" />

          {visibleObjects.map((object) => (
            <Circle
              key={object.name}
              cx={object.position.x}
              cy={object.position.y}
              r={object.type === "moon" ? 8 : 5}
              color={object.type === "moon" ? "#e5e7eb" : "#facc15"}
            />
          ))}
        </Canvas>

        <Text style={[styles.compass, styles.north]}>N</Text>
        <Text style={[styles.compass, styles.south]}>S</Text>
        <Text style={[styles.compass, styles.east]}>E</Text>
        <Text style={[styles.compass, styles.west]}>W</Text>

        {visibleObjects.map((object) => (
          <Text
            key={`${object.name}-label`}
            style={[
              styles.label,
              {
                left: object.position.x + 8,
                top: object.position.y - 14,
              },
            ]}
          >
            {object.name}
          </Text>
        ))}
      </View>

      <Text style={styles.caption}>
        Rotate your phone to scan the visible sky.
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
  sky: {
    width: 340,
    height: 340,
    position: "relative",
  },
  compass: {
    position: "absolute",
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "700",
  },
  north: {
    top: 10,
    left: 165,
  },
  south: {
    bottom: 10,
    left: 165,
  },
  east: {
    right: 12,
    top: 160,
  },
  west: {
    left: 12,
    top: 160,
  },
  label: {
    position: "absolute",
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  caption: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 12,
  },
});