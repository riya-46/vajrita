import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { Button } from "../../src/components/ui/Button";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { Header } from "../../src/components/ui/Header";
import { Input } from "../../src/components/ui/Input";
import { Screen } from "../../src/components/ui/Screen";
import { requestOtp } from "../../src/services/auth";
import { setSecureValue, storageKeys } from "../../src/services/secure-storage";
import { useAuthStore } from "../../src/store/auth.store";
import { isValidPhoneNumber, normalizePhoneNumber } from "../../src/utils/phone";

export default function PhoneScreen() {
  const setPendingAuth = useAuthStore((state) => state.setPendingAuth);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    const formattedPhone = normalizePhoneNumber(phone);
    if (name.trim().length < 2) {
      setError("Enter your name");
      return;
    }

    if (!isValidPhoneNumber(formattedPhone)) {
      setError("Enter a valid phone number with country code");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setPendingAuth(formattedPhone, name.trim());
      await Promise.all([
        setSecureValue(storageKeys.pendingPhone, formattedPhone),
        setSecureValue(storageKeys.pendingName, name.trim()),
      ]);
      await requestOtp(formattedPhone);
      router.push("/(auth)/otp");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen header={<Header title="Secure your safety profile" subtitle="Use your phone number to protect your account and emergency network." />}>
      <KeyboardAvoidingView className="flex-1 justify-between pb-10" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View className="gap-5">
          <Input label="Your name" value={name} onChangeText={setName} placeholder="Enter your full name" />
          <Input
            label="Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+91 9876543210"
            error={error}
          />
          <Text className="text-sm leading-6 text-muted">
            Firebase Phone Auth will verify this number. Use a real device for best OTP reliability.
          </Text>
          {error ? <ErrorState title="OTP could not be sent" message={error} /> : null}
        </View>
        <Button loading={loading} onPress={handleSendOtp}>
          Send OTP
        </Button>
      </KeyboardAvoidingView>
    </Screen>
  );
}
