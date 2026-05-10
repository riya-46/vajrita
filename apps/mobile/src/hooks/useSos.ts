import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getActiveSos, startSos, endSos } from "../api/sos";
import { queryKeys } from "../constants/query-keys";
import { getCurrentDeviceLocation, startTrackingRuntime, stopTrackingRuntime } from "../services/tracking-background";
import { useEmergencyStore } from "../store/emergency.store";
import { useTrackingStore } from "../store/tracking.store";

export function useSos() {
  const queryClient = useQueryClient();
  const setActiveSession = useEmergencyStore((state) => state.setActiveSession);
  const setActiveTracking = useTrackingStore((state) => state.setActiveTracking);

  const activeQuery = useQuery({
    queryKey: queryKeys.sosActive,
    queryFn: getActiveSos,
  });

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.sosActive }),
      queryClient.invalidateQueries({ queryKey: queryKeys.trackingActive }),
    ]);
  };

  return {
    activeQuery,
    startMutation: useMutation({
      mutationFn: async (payload: {
        contactIds: string[];
        channels: ("sms" | "whatsapp" | "call")[];
        trackingDuration: "15m" | "1h" | "until_stopped";
      }) => {
        const initialLocation = await getCurrentDeviceLocation();
        const session = await startSos({ ...payload, initialLocation });
        if (session.trackingSession?.id) {
          await startTrackingRuntime(session.trackingSession.id);
          setActiveTracking(session.trackingSession);
        }
        setActiveSession(session);
        return session;
      },
      onSuccess: invalidate,
    }),
    endMutation: useMutation({
      mutationFn: async (id: string) => {
        const session = await endSos(id);
        await stopTrackingRuntime();
        setActiveSession(null);
        setActiveTracking(null);
        return session;
      },
      onSuccess: invalidate,
    }),
  };
}
