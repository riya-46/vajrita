import { useEffect } from "react";
import { getSecureValue, storageKeys } from "../services/secure-storage";
import { useAuthStore } from "../store/auth.store";
import { restoreSession } from "../services/auth";
import { setupNotifications } from "../services/fake-call";

export function useAuthBootstrap() {
  const setOnboardingSeen = useAuthStore((state) => state.setOnboardingSeen);
  const setBootstrapped = useAuthStore((state) => state.setBootstrapped);
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    const bootstrap = async () => {
      const [onboardingSeen, accessToken] = await Promise.all([
        getSecureValue(storageKeys.onboardingSeen),
        getSecureValue(storageKeys.accessToken),
      ]);

      if (onboardingSeen === "true") {
        setOnboardingSeen(true);
      }

      if (accessToken) {
        setSession({
          accessToken,
          user: {
            id: "",
            name: "",
            phone: "",
            verified: true,
            trustedContactsCount: 0,
            createdAt: new Date().toISOString(),
          },
        });
        await restoreSession();
      } else {
        setBootstrapped(true);
      }

      await setupNotifications();
    };

    bootstrap().catch(() => {
      setBootstrapped(true);
    });
  }, [setBootstrapped, setOnboardingSeen, setSession]);
}
