export function normalizePhoneNumber(value: string) {
  const cleaned = value.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  if (cleaned.startsWith("0")) {
    return `+91${cleaned.slice(1)}`;
  }

  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  return cleaned;
}

export function isValidPhoneNumber(value: string) {
  return /^\+?[1-9]\d{7,14}$/.test(normalizePhoneNumber(value));
}
