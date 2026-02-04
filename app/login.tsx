import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>OUTTER</Text>
        <Text style={styles.tagline}>Delivering Everything, Everywhere</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        <View style={styles.input}>
          <Text>+91</Text>
          <TextInput
            placeholder="Enter mobile number"
            style={styles.textInput}
          />
        </View>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryText}>Login →</Text>
        </TouchableOpacity>

        <Text style={styles.or}>OR CONTINUE WITH</Text>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <Text>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <Text>Apple</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.loginText}>
          Don’t have an account?{" "}
          <Text style={styles.link} onPress={() => router.replace("/")}>
            Sign Up
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FB" },
  header: {
    backgroundColor: "#0A84FF",
    padding: 30,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  logo: { color: "#fff", fontSize: 24, fontWeight: "700" },
  tagline: { color: "#E6F0FF", fontSize: 12 },
  content: { padding: 24 },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  subtitle: { color: "#6B7280", textAlign: "center", marginBottom: 20 },
  input: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 14,
  },
  textInput: { flex: 1, marginLeft: 10 },
  primaryButton: {
    backgroundColor: "#0A84FF",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "600" },
  or: {
    textAlign: "center",
    color: "#9CA3AF",
    marginVertical: 18,
  },
  socialRow: { flexDirection: "row" },
  socialBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    marginHorizontal: 6,
  },
  loginText: { textAlign: "center", marginTop: 20 },
  link: { color: "#0A84FF", fontWeight: "600" },
});
