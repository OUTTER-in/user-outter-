import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OTP() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const verifyOTP = async () => {
    if (code.length !== 6) {
      alert("Please enter 6 digit OTP");
      return;
    }

    try {
      const confirmationResult = (global as any).confirmationResult;

      if (!confirmationResult) {
        alert("Session expired. Please try again.");
        router.replace("/");
        return;
      }

      await confirmationResult.confirm(code);

      // ✅ OTP verified
      router.replace("/home");
    } catch (error) {
      console.log("OTP verification error:", error);
      alert("Invalid OTP");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.card}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to your mobile number
        </Text>

        <TextInput
          style={styles.otpInput}
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={setCode}
          placeholder="••••••"
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity style={styles.button} onPress={verifyOTP}>
          <Text style={styles.buttonText}>Verify & Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/")}>
          <Text style={styles.changeText}>Change phone number</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    justifyContent: "center",
    padding: 24,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,

    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    // Android shadow
    elevation: 8,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },

  otpInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingVertical: 14,
    fontSize: 20,
    letterSpacing: 10,
    textAlign: "center",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#0A84FF",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  changeText: {
    marginTop: 18,
    textAlign: "center",
    color: "#0A84FF",
    fontWeight: "600",
  },
});
