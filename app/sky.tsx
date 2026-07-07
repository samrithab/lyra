import { StyleSheet, Text, View } from "react-native";

export default function SkyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sky View</Text>

      <Text style={styles.subtitle}>
        This is where the interactive sky map will live.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "700",
  },

  subtitle: {
    color: "#CBD5E1",
    marginTop: 16,
    textAlign: "center",
    fontSize: 16,
  },
});