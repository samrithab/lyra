import { CelestialObject } from "@/types/astronomy";
import { Canvas, Circle, Group, Line, Text, useFont } from "@shopify/react-native-skia";
import { View } from "react-native";

interface SkyCanvasProps {
  objects: CelestialObject[];
  heading: number | null;
  pitch: number | null;
}

export function SkyCanvas({ objects, heading, pitch }: SkyCanvasProps) {
  const width = 340;
  const height = 340;
  const centerX = width / 2;
  const centerY = height / 2;

  const font = useFont(undefined, 13);

  function projectObject(object: CelestialObject) {
    const currentHeading = heading ?? 0;

    let relativeAzimuth = object.azimuth - currentHeading;

    if (relativeAzimuth > 180) relativeAzimuth -= 360;
    if (relativeAzimuth < -180) relativeAzimuth += 360;

    const x = centerX + relativeAzimuth * 2.2;

    const y = centerY - object.altitude * 2.2;

    return { x, y };
  }

  const visibleObjects = objects.filter((object) => object.isVisible);

  return (
    <View>
      <Canvas style={{ width, height }}>
        <Circle cx={centerX} cy={centerY} r={165} color="#0f172a" />

        <Circle cx={centerX} cy={centerY} r={2} color="white" />

        <Line
          p1={{ x: 20, y: centerY }}
          p2={{ x: width - 20, y: centerY }}
          color="#334155"
          strokeWidth={1}
        />

        {visibleObjects.map((object) => {
          const { x, y } = projectObject(object);

          if (x < 20 || x > width - 20 || y < 20 || y > height - 20) {
            return null;
          }

          return (
            <Group key={object.name}>
                <Circle
                cx={x}
                cy={y}
                r={object.type === "planet" ? 5 : 7}
                color={object.type === "moon" ? "#e5e7eb" : "#facc15"}
                />

                {font && (
                <Text
                    x={x + 8}
                    y={y - 8}
                    text={object.name}
                    font={font}
                    color="white"
                />
                )}
            </Group>
            );
        })}
      </Canvas>
    </View>
  );
}