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

export default function Home() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>O</Text>
          </View>
          <View>
            <Text style={styles.appName}>OUTTER</Text>
            <Text style={styles.tagline}>
              Delivering Everything, Everywhere
            </Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoryRow}>
          {[
            { label: "Food", icon: "🍔" },
            { label: "Grocery", icon: "🛒" },
            { label: "Packages", icon: "📦" },
            { label: "Send Items", icon: "✈️" },
          ].map((item, index) => (
            <View key={index} style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>{item.icon}</Text>
              <Text style={styles.categoryText}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.features}>
          <Text style={styles.feature}>⚡ Fast Delivery</Text>
          <Text style={styles.feature}>📍 Live Tracking</Text>
          <Text style={styles.feature}>🔒 Safe & Secure</Text>
        </View>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to start ordering</Text>

        <View style={styles.input}>
          <Text style={styles.code}>+91</Text>
          <TextInput
            placeholder="Enter mobile number"
            keyboardType="phone-pad"
            style={styles.textInput}
          />
        </View>

        <View style={styles.input}>
          <TextInput placeholder="Enter your name" style={styles.textInput} />
        </View>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryText}>Get OTP →</Text>
        </TouchableOpacity>

        <Text style={styles.or}>OR CONTINUE WITH</Text>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialText}>Apple</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.login}>
          Already have an account?{" "}
          <Text onPress={() => router.push("/login")} style={styles.loginLink}>
            Login
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
    padding: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  logoText: { color: "#fff", fontSize: 20, fontWeight: "700" },
  appName: { color: "#fff", fontSize: 22, fontWeight: "700" },
  tagline: { color: "#E6F0FF", fontSize: 12 },

  categoryRow: { flexDirection: "row", justifyContent: "space-between" },

  categoryCard: {
    width: 72,
    height: 72,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  categoryIcon: { fontSize: 20 },
  categoryText: { color: "#fff", fontSize: 11, marginTop: 4 },

  content: { padding: 24 },

  features: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  feature: { fontSize: 12, color: "#6B7280" },

  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 14,
  },

  code: { marginRight: 10, fontWeight: "600" },
  textInput: { flex: 1, fontSize: 14 },

  primaryButton: {
    backgroundColor: "#0A84FF",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },

  primaryText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  or: {
    textAlign: "center",
    color: "#9CA3AF",
    marginVertical: 18,
    fontSize: 12,
  },

  socialRow: { flexDirection: "row", marginBottom: 24 },

  socialBtn: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginHorizontal: 6,
  },

  socialText: { fontSize: 14, fontWeight: "500" },

  login: { textAlign: "center", fontSize: 13, color: "#6B7280" },
  loginLink: { color: "#0A84FF", fontWeight: "600" },
});
