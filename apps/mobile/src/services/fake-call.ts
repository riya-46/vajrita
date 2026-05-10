import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useFakeCallStore } from "../store/fakeCall.store";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupNotifications() {
  await Notifications.setNotificationChannelAsync("fake-call", {
    name: "Fake Call Alerts",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 300, 150, 300],
    sound: "default",
  });

  const settings = await Notifications.getPermissionsAsync();
  if (!settings.granted) {
    await Notifications.requestPermissionsAsync();
  }

  Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as Record<string, string | undefined>;
    if (data.route === "/fake-call") {
      useFakeCallStore.getState().setScenario({
        callerName: data.callerName || "Emergency Contact",
        callerPhone: data.callerPhone || "+911234567890",
        ringtoneUrl: data.ringtoneUrl,
      });
      router.push({
        pathname: "/fake-call",
        params: {
          callerName: data.callerName,
          callerPhone: data.callerPhone,
          ringtoneUrl: data.ringtoneUrl,
        },
      });
    }
  });
}

export async function scheduleFakeCall(payload: {
  callerName: string;
  callerPhone: string;
  ringtoneUrl?: string;
  delaySeconds: number;
}) {
  useFakeCallStore.getState().setScenario({
    callerName: payload.callerName,
    callerPhone: payload.callerPhone,
    ringtoneUrl: payload.ringtoneUrl,
    scheduledAt: Date.now() + payload.delaySeconds * 1000,
  });

  setTimeout(() => {
    router.push({
      pathname: "/fake-call",
      params: {
        callerName: payload.callerName,
        callerPhone: payload.callerPhone,
        ringtoneUrl: payload.ringtoneUrl,
      },
    });
  }, payload.delaySeconds * 1000);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: payload.callerName,
      body: "Incoming call",
      data: {
        route: "/fake-call",
        callerName: payload.callerName,
        callerPhone: payload.callerPhone,
        ringtoneUrl: payload.ringtoneUrl,
      },
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: payload.delaySeconds,
      channelId: "fake-call",
    },
  });
}
