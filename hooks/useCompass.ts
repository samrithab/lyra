import * as Location from "expo-location";
import { useEffect, useState } from "react";

export function useCompass() {
  const [heading, setHeading] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function startCompass() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        return;
      }

      subscription = await Location.watchHeadingAsync((data) => {
        const value =
          data.trueHeading && data.trueHeading >= 0
            ? data.trueHeading
            : data.magHeading;

        setHeading(Math.round(value));
        setAccuracy(data.accuracy ?? null);
      });
    }

    startCompass();

    return () => {
      subscription?.remove();
    };
  }, []);

  return { heading, accuracy };
}