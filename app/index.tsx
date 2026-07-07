import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>✦</Text>

      <Text style={styles.title}>Lyra</Text>

      <Text style={styles.subtitle}>
        Explore the night sky with real-time planets and constellations.
      </Text>

      <Link href={{ pathname: "/sky" }} asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Start Stargazing</Text>
        </Pressable>
      </Link>
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

  logo: {
    fontSize: 70,
    color: "#fff",
    marginBottom: 20,
  },

  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#fff",
  },

  subtitle: {
    color: "#CBD5E1",
    textAlign: "center",
    fontSize: 17,
    marginTop: 16,
    lineHeight: 25,
    maxWidth: 320,
  },

  button: {
    marginTop: 48,
    backgroundColor: "#2563EB",
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 999,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});