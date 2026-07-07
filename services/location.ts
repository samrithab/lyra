import * as Location from "expo-location";

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export async function getCurrentLocation(): Promise<UserLocation> {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Location permission denied.");
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}