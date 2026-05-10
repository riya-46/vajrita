import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "../../src/components/ui/Button";
import { Header } from "../../src/components/ui/Header";
import { OTPInput } from "../../src/components/ui/OTPInput";
import { Screen } from "../../src/components/ui/Screen";
import { completeOtpLogin, resendOtp } from "../../src/services/auth";
import { useAuthStore } from "../../src/store/auth.store";

export default function OtpScreen() {
  const { pendingPhone } = useAuthStore();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await completeOtpLogin(code);
      router.replace("/(tabs)/home");
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setError(null);
      await resendOtp();
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : "Unable to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <Screen header={<Header title="Verify OTP" subtitle={`We sent a code to ${pendingPhone || "your phone"}.`} />}>
      <View className="flex-1 justify-between pb-10">
        <View className="gap-6">
          <OTPInput value={code} onChangeText={setCode} error={error} />
          <Button variant="ghost" loading={resending} onPress={handleResend}>
            Resend OTP
          </Button>
          <Text className="text-sm leading-6 text-muted">
            On some Android devices, OTP may auto-verify. If that happens, continue directly to the app.
          </Text>
        </View>
        <Button loading={loading} onPress={handleVerify}>
          Verify and Continue
        </Button>
      </View>
    </Screen>
  );
}
