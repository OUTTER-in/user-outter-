import {  Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePicker from '@react-native-community/datetimepicker';
import React from "react";
import { auth,db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dobText, setDobText] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  

  const handleSignup = async () => {
    try {
      if (!email || !password || !name || !mobile || !dobText) {
        alert("Please fill all fields");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);

      // Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name,
        mobile,
        dob: dobText,
        role: "customer",
        isVerified: false,
        createdAt: new Date(),
      });

      alert("Verification email sent. Check SPAM folder in MAIL if not found. Please verify before logging in.");

      await auth.signOut();   // IMPORTANT

      router.replace("/login");

    } catch (error: any) {
      alert(error.message+" Check SPAM Folder of mail for link. When verified click on login below.");
    }
  };

   {/*const handleRegister = async (): Promise<boolean> => {
    try {
      await addDoc(collection(db, "users"), {
        mobile,
        name,
        email,
        dob: dobText,
        createdAt: new Date(),
      });

      alert("User saved successfully!");
      return true;
    } catch (error) {
      console.log(error);
      alert("Error saving user");
      return false;
    }
  };

  const handleSignupPress = async () => {
      const success = await handleRegister();

      if (success) {
        Alert.alert(
          "Email Verification",
          "A verification link has been sent to your email. Please check your SPAM folder.",
          [
            {
              text: "OK",
              onPress: () => router.push("/login"),
            },
          ]
        );
      }
    };*/}

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
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={40}
      >
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
              placeholder="Mobile number"
              keyboardType="phone-pad"
              style={styles.textInput}
              value={mobile}
              onChangeText={setMobile}
            />
          </View>

          <View style={styles.input}>
            <Ionicons name="person-outline" size={25} color="black" style={styles.code}/>
            <TextInput placeholder="Name" style={styles.textInput} 
              value={name}
              onChangeText={setName}/>
          </View>
          <View style={styles.input}>
            <Text style={styles.code}>@</Text>
            <TextInput placeholder="Email ID (xyz@gmail.com)" style={styles.textInput} value={email}
              onChangeText={setEmail}
              autoCapitalize="none"/>
          </View>
          <View style={styles.input}>
            <Ionicons name="calendar-outline" size={25} color="black" style={styles.code}/>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setShowPicker(true)}
            >
              <Text style={{ fontSize: 14, color: dobText ? "black" : "#9CA3AF" }}>
                {dobText || "Date Of Birth"}
              </Text>
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                  setDobText(
                    selectedDate.toLocaleDateString("en-GB")
                  );
                }
              }}
            />
          )}
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

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSignup}
          >
            <Text style={styles.primaryText}>
              Verify Email & Sign Up →
            </Text>
          </TouchableOpacity>

          {/*<Text style={styles.or}>OR CONTINUE WITH</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
          </View>*/}

          <Text style={styles.login}>
            Already have an account?{" "}
            <Text onPress={() => router.push("/login")} style={styles.loginLink}>
              Login
            </Text>
          </Text>
        </View> 
        <View style={{ height: 50 }} />
      </KeyboardAwareScrollView>
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
  paddingHorizontal: 14,
  paddingVertical: 12,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  marginBottom: 14,
},

  code: { marginRight: 10, fontWeight: "600" , fontSize: 15 },
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
  loginLink: { color: "#0A84FF", fontWeight: "600"},
});
