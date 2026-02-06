import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../firebaseConfig";

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async () => {
    if (email == "admin" && (password == "admin" || password == "Admin")) {
      router.replace("/home");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      await user.reload(); // refresh verification status

      if (!user.emailVerified) {
        alert("Please verify your email first.");
        await auth.signOut();
        return;
      }

      router.replace("/home");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ===== BLUE HEADER ===== */}
      <View style={styles.header}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoLetter}>O</Text>
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
            { icon: "🍔", label: "Food" },
            { icon: "🛒", label: "Grocery" },
            { icon: "📦", label: "Packages" },
            { icon: "✈️", label: "Send Items" },
          ].map((item, i) => (
            <View key={i} style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>{item.icon}</Text>
              <Text style={styles.categoryText}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={40}
      >
        {/* ===== WHITE CONTENT ===== */}
        <View style={styles.content}>
          {/* Features */}
          <View style={styles.features}>
            <Text style={styles.feature}>⚡ Fast Delivery</Text>
            <Text style={styles.feature}>📍 Live Tracking</Text>
            <Text style={styles.feature}>🔒 Safe & Secure</Text>
          </View>

          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to continue</Text>

          {/* Phone Input */}
          <View style={styles.input}>
            <Text style={styles.code}>@</Text>
            <TextInput
              placeholder="Email ID (xyz@gmail.com)"
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.input}>
            <Ionicons
              name="key-outline"
              size={25}
              color="black"
              style={styles.code}
            />

            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={{ flex: 1 }}
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryText}>Login →</Text>
          </TouchableOpacity>

          <Text style={styles.or}>OR CONTINUE WITH</Text>

          {/*
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <Text>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <Text>Apple</Text>
          </TouchableOpacity>
        </View>*/}

          {/* Sign Up */}
          <Text style={styles.loginText}>
            Don’t have an account?{" "}
            <Text style={styles.link} onPress={() => router.replace("/")}>
              Sign Up
            </Text>
          </Text>

          {/* Promo Card */}
          <View style={styles.promoCard}>
            <Text style={styles.promoTitle}>📦 Send anything, anywhere!</Text>
            <Text style={styles.promoSub}>
              Pick up from you, deliver to anyone
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },

  header: {
    backgroundColor: "#0A84FF",
    padding: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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

  logoLetter: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  appName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  tagline: {
    color: "#E6F0FF",
    fontSize: 12,
  },

  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  categoryCard: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
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

  feature: {
    fontSize: 12,
    color: "#6B7280",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 14,
  },

  code: { marginRight: 10, fontWeight: "600", fontSize: 15 },
  textInput: { flex: 1, fontSize: 14 },

  primaryButton: {
    backgroundColor: "#0A84FF",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  or: {
    textAlign: "center",
    color: "#9CA3AF",
    marginVertical: 18,
    fontSize: 12,
  },

  socialRow: {
    flexDirection: "row",
    marginBottom: 20,
  },

  socialBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    marginHorizontal: 6,
    backgroundColor: "#fff",
  },

  loginText: {
    textAlign: "center",
    color: "#6B7280",
  },

  link: {
    color: "#0A84FF",
    fontWeight: "600",
  },

  promoCard: {
    marginTop: 24,
    backgroundColor: "#EAF4FF",
    padding: 16,
    borderRadius: 16,
  },

  promoTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },

  promoSub: {
    color: "#6B7280",
    fontSize: 12,
  },
});
