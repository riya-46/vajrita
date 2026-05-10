import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { storageKeys, getSecureValue, setSecureValue, deleteSecureValue } from "./secure-storage";
import { apiRequest } from "../api/client";

export const TRACKING_TASK_NAME = "vajrita-background-tracking";

function mapExpoLocation(location: Location.LocationObject) {
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    accuracy: location.coords.accuracy ?? undefined,
    speed: location.coords.speed ?? undefined,
    heading: location.coords.heading ?? undefined,
    timestamp: new Date(location.timestamp).toISOString(),
  };
}

TaskManager.defineTask(TRACKING_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.warn("Background tracking error", error.message);
    return;
  }

  const trackingId = await getSecureValue(storageKeys.activeTrackingId);
  const locations = (data as { locations?: Location.LocationObject[] } | undefined)?.locations;
  const latest = locations?.at(-1);

  if (!trackingId || !latest) {
    return;
  }

  try {
    await apiRequest(`/api/tracking/${trackingId}/ping`, {
      method: "POST",
      body: JSON.stringify({ location: mapExpoLocation(latest) }),
    });
  } catch (taskError) {
    console.warn("Background ping failed", taskError);
  }
});

let foregroundSubscription: Location.LocationSubscription | null = null;

export async function getCurrentDeviceLocation() {
  const current = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return mapExpoLocation(current);
}

export async function startTrackingRuntime(trackingId: string) {
  await setSecureValue(storageKeys.activeTrackingId, trackingId);

  const foreground = await Location.requestForegroundPermissionsAsync();
  if (!foreground.granted) {
    throw new Error("Foreground location permission is required");
  }

  const background = await Location.requestBackgroundPermissionsAsync();
  if (!background.granted) {
    throw new Error("Background location permission is required");
  }

  foregroundSubscription?.remove();
  foregroundSubscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 10000,
      distanceInterval: 5,
    },
    async (location) => {
      await apiRequest(`/api/tracking/${trackingId}/ping`, {
        method: "POST",
        body: JSON.stringify({ location: mapExpoLocation(location) }),
      }).catch(() => undefined);
    },
  );

  const started = await Location.hasStartedLocationUpdatesAsync(TRACKING_TASK_NAME);
  if (!started) {
    await Location.startLocationUpdatesAsync(TRACKING_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 10000,
      distanceInterval: 5,
      foregroundService: {
        notificationTitle: "VAJRITA is sharing location",
        notificationBody: "Live emergency location sharing is active.",
      },
      showsBackgroundLocationIndicator: false,
    });
  }
}

export async function stopTrackingRuntime() {
  foregroundSubscription?.remove();
  foregroundSubscription = null;

  const started = await Location.hasStartedLocationUpdatesAsync(TRACKING_TASK_NAME);
  if (started) {
    await Location.stopLocationUpdatesAsync(TRACKING_TASK_NAME);
  }

  await deleteSecureValue(storageKeys.activeTrackingId);
}
