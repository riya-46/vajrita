import type { FakeCallConfigDto } from "@vajrita/shared";
import { apiRequest } from "./client";

export function getFakeCallConfig() {
  return apiRequest<FakeCallConfigDto>("/api/fake-call/config");
}

export function updateFakeCallConfig(input: FakeCallConfigDto) {
  return apiRequest<FakeCallConfigDto>("/api/fake-call/config", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
