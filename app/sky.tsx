import { SkyCanvas } from "@/components/SkyCanvas";
import { useCompass } from "@/hooks/useCompass";
import { useDeviceOrientation } from "@/hooks/useDeviceOrientation";
import { getVisibleCelestialObjects } from "@/services/astronomy";
import { getCurrentLocation } from "@/services/location";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function SkyScreen() {
  const { heading } = useCompass();
  const { pitch, roll } = useDeviceOrientation();

  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLocation() {
      try {
        const currentLocation = await getCurrentLocation();
        setLocation(currentLocation);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error.");
      } finally {
        setLoading(false);
      }
    }

    loadLocation();
  }, []);

  const celestialObjects = location
    ? getVisibleCelestialObjects({
        latitude: location.latitude,
        longitude: location.longitude,
      })
    : [];

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.text}>Finding your location...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Visible Sky</Text>

      <Text style={styles.subtitle}>
        Based on your current location and time.
      </Text>

      <Link href="/compass" asChild>
        <Pressable style={styles.arButton}>
          <Text style={styles.arButtonText}>Open Compass Test</Text>
        </Pressable>
      </Link>

      <SkyCanvas objects={celestialObjects} heading={heading} pitch={pitch} />

      <View style={styles.locationCard}>
        <Text style={styles.smallText}>
          Latitude: {location?.latitude.toFixed(5)}
        </Text>
        <Text style={styles.smallText}>
          Longitude: {location?.longitude.toFixed(5)}
        </Text>
        <Text style={styles.smallText}>{new Date().toLocaleString()}</Text>
        <Text style={styles.smallText}>
          Heading: {heading !== null ? `${heading}°` : "Calibrating..."}
        </Text>
        <Text style={styles.smallText}>
          Pitch: {pitch !== null ? `${pitch}°` : "Calibrating..."}
        </Text>
        <Text style={styles.smallText}>
          Roll: {roll !== null ? `${roll}°` : "Calibrating..."}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Celestial Positions</Text>

      {celestialObjects.map((object) => (
        <View key={`${object.name}-position`} style={styles.positionCard}>
          <View style={styles.positionHeader}>
            {/* <Text style={styles.planetIcon}>
              {object.type === "sun" ? "☀️" : object.type === "moon" ? "🌙" : "🪐"}
            </Text> */}

            <View>
              <Text style={styles.objectName}>{object.name}</Text>
              <Text
                style={object.isVisible ? styles.visibleBadge : styles.hiddenBadge}
              >
                {object.isVisible ? "Visible now" : "Below horizon"}
              </Text>
            </View>
          </View>

          <View style={styles.positionGrid}>
            <View style={styles.metricRow}>
              <Text style={styles.metric}>Azimuth</Text>
              <Text style={styles.metricValue}>{object.azimuth.toFixed(1)}°</Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metric}>Altitude</Text>
              <Text style={styles.metricValue}>{object.altitude.toFixed(1)}°</Text>
            </View>

            {heading !== null && (
              <View style={styles.metricRow}>
                <Text style={styles.metric}>From Facing</Text>
                <Text style={styles.metricValue}>
                  {normalizeAngle(object.azimuth - heading).toFixed(1)}°
                </Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function normalizeAngle(angle: number) {
  let value = angle;

  while (value > 180) value -= 360;
  while (value < -180) value += 360;

  return value;
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 16,
    marginBottom: 20,
  },
  arButton: {
    backgroundColor: "#2563eb",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  arButtonText: {
    color: "white",
    fontWeight: "700",
  },
  locationCard: {
    backgroundColor: "#0f172a",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 14,
  },
  positionCard: {
    backgroundColor: "#0f172a",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  positionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  planetIcon: {
    fontSize: 28,
  },
  objectName: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
  },
  visibleBadge: {
    color: "#86efac",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  hiddenBadge: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  positionGrid: {
    gap: 8,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopColor: "#1e293b",
    borderTopWidth: 1,
    paddingTop: 8,
  },
  metric: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
  metricValue: {
    color: "white",
    fontSize: 15,
    fontWeight: "800",
  },
  text: {
    color: "white",
    fontSize: 16,
    marginVertical: 3,
  },
  smallText: {
    color: "#cbd5e1",
    fontSize: 14,
    marginVertical: 2,
  },
  error: {
    color: "#f87171",
    fontSize: 18,
    textAlign: "center",
  },
});