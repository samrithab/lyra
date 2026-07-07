import { DeviceMotion, radiansToDegrees } from "@/services/sensors";
import { useEffect, useState } from "react";

export function useDeviceOrientation() {
  const [pitch, setPitch] = useState<number | null>(null);
  const [roll, setRoll] = useState<number | null>(null);

  useEffect(() => {
    DeviceMotion.setUpdateInterval(250);

    const subscription = DeviceMotion.addListener((motion) => {
      if (!motion.rotation) return;

      setPitch(Math.round(radiansToDegrees(motion.rotation.beta ?? 0)));
      setRoll(Math.round(radiansToDegrees(motion.rotation.gamma ?? 0)));
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return { pitch, roll };
}