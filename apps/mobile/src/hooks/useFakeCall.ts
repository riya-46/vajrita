import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFakeCallConfig, updateFakeCallConfig } from "../api/fake-call";
import { queryKeys } from "../constants/query-keys";

export function useFakeCall() {
  const queryClient = useQueryClient();

  const configQuery = useQuery({
    queryKey: queryKeys.fakeCallConfig,
    queryFn: getFakeCallConfig,
  });

  return {
    configQuery,
    updateMutation: useMutation({
      mutationFn: updateFakeCallConfig,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.fakeCallConfig }),
    }),
  };
}
