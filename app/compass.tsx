import { useCompass } from "@/hooks/useCompass";
import { StyleSheet, Text, View } from "react-native";

function getDirectionLabel(degrees: number | null) {
  if (degrees === null) return "Calibrating...";

  if (degrees >= 337.5 || degrees < 22.5) return "N";
  if (degrees >= 22.5 && degrees < 67.5) return "NE";
  if (degrees >= 67.5 && degrees < 112.5) return "E";
  if (degrees >= 112.5 && degrees < 157.5) return "SE";
  if (degrees >= 157.5 && degrees < 202.5) return "S";
  if (degrees >= 202.5 && degrees < 247.5) return "SW";
  if (degrees >= 247.5 && degrees < 292.5) return "W";
  return "NW";
}

export default function CompassScreen() {
  const { heading, accuracy } = useCompass();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Lyra Compass Test</Text>

      <Text style={styles.heading}>
        {heading !== null ? `${heading}°` : "—"}
      </Text>

      <Text style={styles.direction}>{getDirectionLabel(heading)}</Text>

      <Text style={styles.small}>
        Accuracy: {accuracy !== null ? accuracy : "—"}
      </Text>

      <Text style={styles.note}>
        Hold your phone flat and point the top edge of the phone toward a
        direction. Compare this with the iPhone Compass app.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  label: {
    color: "#94a3b8",
    fontSize: 16,
    marginBottom: 24,
  },
  heading: {
    color: "white",
    fontSize: 72,
    fontWeight: "800",
  },
  direction: {
    color: "#e0f2fe",
    fontSize: 44,
    fontWeight: "800",
    marginTop: 8,
  },
  small: {
    color: "#cbd5e1",
    fontSize: 16,
    marginTop: 20,
  },
  note: {
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 32,
  },
});