import { SkyCanvas } from "@/components/SkyCanvas";
import { useCompass } from "@/hooks/useCompass";
import { useDeviceOrientation } from "@/hooks/useDeviceOrientation";
import { getVisibleCelestialObjects } from "@/services/astronomy";
import { getCurrentLocation } from "@/services/location";
import { useEffect, useState } from "react";

import {
    ActivityIndicator,
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

        <SkyCanvas
            objects={celestialObjects}
            heading={heading}
            pitch={pitch}
        />

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

      {celestialObjects.map((object) => (
        <View key={object.name} style={styles.card}>
          <Text style={styles.objectName}>{object.name}</Text>

          <Text style={styles.text}>
            Altitude: {object.altitude.toFixed(1)}°
          </Text>

          <Text style={styles.text}>
            Azimuth: {object.azimuth.toFixed(1)}°
          </Text>

          <Text style={object.isVisible ? styles.visible : styles.hidden}>
            {object.isVisible ? "Visible" : "Below horizon"}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
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
  locationCard: {
    backgroundColor: "#0f172a",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#0f172a",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  objectName: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
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
  visible: {
    color: "#86efac",
    fontSize: 15,
    marginTop: 8,
    fontWeight: "700",
  },
  hidden: {
    color: "#94a3b8",
    fontSize: 15,
    marginTop: 8,
    fontWeight: "700",
  },
  error: {
    color: "#f87171",
    fontSize: 18,
    textAlign: "center",
  },
});