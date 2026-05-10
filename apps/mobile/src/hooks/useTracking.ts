import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getActiveTracking, startTracking, stopTracking } from "../api/tracking";
import { queryKeys } from "../constants/query-keys";
import { getCurrentDeviceLocation, startTrackingRuntime, stopTrackingRuntime } from "../services/tracking-background";
import { useTrackingStore } from "../store/tracking.store";

export function useTracking() {
  const queryClient = useQueryClient();
  const setActiveTracking = useTrackingStore((state) => state.setActiveTracking);

  const activeQuery = useQuery({
    queryKey: queryKeys.trackingActive,
    queryFn: getActiveTracking,
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.trackingActive });
  };

  return {
    activeQuery,
    startMutation: useMutation({
      mutationFn: async (payload: { contactIds: string[]; duration: "15m" | "1h" | "until_stopped" }) => {
        const initialLocation = await getCurrentDeviceLocation();
        const session = await startTracking({ ...payload, initialLocation });
        await startTrackingRuntime(session.id);
        setActiveTracking(session);
        return session;
      },
      onSuccess: invalidate,
    }),
    stopMutation: useMutation({
      mutationFn: async (id: string) => {
        const session = await stopTracking(id);
        await stopTrackingRuntime();
        setActiveTracking(null);
        return session;
      },
      onSuccess: invalidate,
    }),
  };
}
