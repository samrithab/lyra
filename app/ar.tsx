import { useCompass } from "@/hooks/useCompass";
import { useDeviceOrientation } from "@/hooks/useDeviceOrientation";
import { getVisibleCelestialObjects } from "@/services/astronomy";
import { getCurrentLocation } from "@/services/location";
import { CelestialObject } from "@/types/astronomy";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

function normalizeAngle(angle: number) {
  let normalized = angle;

  while (normalized > 180) normalized -= 360;
  while (normalized < -180) normalized += 360;

  return normalized;
}

function projectToScreen(
  object: CelestialObject,
  heading: number | null,
  pitch: number | null
) {
  if (heading === null || pitch === null) return null;

  const horizontalFov = 60;
  const verticalFov = 45;

  const relativeAzimuth = normalizeAngle(object.azimuth - heading);
  const relativeAltitude = object.altitude - pitch;

  if (
    Math.abs(relativeAzimuth) > horizontalFov / 2 ||
    Math.abs(relativeAltitude) > verticalFov / 2
  ) {
    return null;
  }

  const x = width / 2 + (relativeAzimuth / (horizontalFov / 2)) * (width / 2);
  const y = height / 2 - (relativeAltitude / (verticalFov / 2)) * (height / 2);

  return { x, y };
}

export default function ARScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(true);
  const [objects, setObjects] = useState<CelestialObject[]>([]);
  const [error, setError] = useState("");

  const { heading } = useCompass();
  const { pitch } = useDeviceOrientation();

  useEffect(() => {
    async function loadSkyObjects() {
      try {
        const location = await getCurrentLocation();

        const visibleObjects = getVisibleCelestialObjects({
          latitude: location.latitude,
          longitude: location.longitude,
        }).filter((object) => object.isVisible);

        setObjects(visibleObjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load sky.");
      } finally {
        setLoading(false);
      }
    }

    loadSkyObjects();
  }, []);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Checking camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Camera Access</Text>
        <Text style={styles.text}>
          Lyra needs camera access to show the sky behind the overlay.
        </Text>

        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Allow Camera</Text>
        </Pressable>
      </View>
    );
  }

  const projectedObjects = objects
    .map((object) => ({
      ...object,
      position: projectToScreen(object, heading, pitch),
    }))
    .filter((object) => object.position !== null);

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" />

      <View style={styles.overlay}>
        <Text style={styles.debug}>
          Heading: {heading ?? "—"}° | Pitch: {pitch ?? "—"}°
        </Text>

        {loading && (
          <View style={styles.loadingBadge}>
            <ActivityIndicator color="white" />
            <Text style={styles.loadingText}>Loading sky...</Text>
          </View>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.crosshairHorizontal} />
        <View style={styles.crosshairVertical} />

        {projectedObjects.map((object) => (
          <View
            key={object.name}
            style={[
              styles.objectLabel,
              {
                left: object.position!.x,
                top: object.position!.y,
              },
            ]}
          >
            <Text style={styles.objectText}>
              {object.type === "moon"
                ? "☾ "
                : object.type === "sun"
                  ? "☀ "
                  : "• "}
              {object.name}
            </Text>
          </View>
        ))}

        <Link href="/sky" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backText}>Back to Sky Map</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  center: {
    flex: 1,
    backgroundColor: "#020617",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 12,
  },
  text: {
    color: "#cbd5e1",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#2563eb",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
  },
  debug: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    color: "white",
    fontSize: 13,
    fontWeight: "700",
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  loadingBadge: {
    position: "absolute",
    top: 105,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  loadingText: {
    color: "white",
    fontSize: 13,
  },
  error: {
    position: "absolute",
    top: 110,
    alignSelf: "center",
    color: "#fecaca",
    backgroundColor: "rgba(127, 29, 29, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  crosshairHorizontal: {
    position: "absolute",
    top: "50%",
    left: "43%",
    right: "43%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  crosshairVertical: {
    position: "absolute",
    left: "50%",
    top: "46%",
    bottom: "46%",
    width: 1,
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  objectLabel: {
    position: "absolute",
    transform: [{ translateX: -24 }, { translateY: -12 }],
  },
  objectText: {
    color: "white",
    fontSize: 17,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowRadius: 8,
  },
  backButton: {
    position: "absolute",
    bottom: 48,
    alignSelf: "center",
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  backText: {
    color: "white",
    fontWeight: "700",
  },
});