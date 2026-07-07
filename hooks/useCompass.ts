import { calculateHeading, Magnetometer } from "@/services/sensors";
import { useEffect, useState } from "react";

export function useCompass() {
  const [heading, setHeading] = useState<number | null>(null);

  useEffect(() => {
    Magnetometer.setUpdateInterval(250);

    const subscription = Magnetometer.addListener((data) => {
      setHeading(calculateHeading(data));
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return { heading };
}