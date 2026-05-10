import type { TrustedContactDto } from "@vajrita/shared";
import { apiRequest } from "./client";

export function listContacts() {
  return apiRequest<TrustedContactDto[]>("/api/contacts");
}

export function createContact(input: { name: string; phone: string; relationship: string }) {
  return apiRequest<TrustedContactDto>("/api/contacts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateContact(id: string, input: Partial<{ name: string; phone: string; relationship: string }>) {
  return apiRequest<TrustedContactDto>(`/api/contacts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteContact(id: string) {
  return apiRequest<{ deleted: true }>(`/api/contacts/${id}`, {
    method: "DELETE",
  });
}

export function sendContactVerification(id: string) {
  return apiRequest<{
    contact: TrustedContactDto;
    verificationId?: string;
    verificationLink?: string | null;
    providerStatus: string;
  }>(`/api/contacts/${id}/send-verification`, {
    method: "POST",
  });
}
