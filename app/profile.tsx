import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../firebaseConfig";

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        router.replace("/login");
        return;
      }

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.name || "");
        setEmail(userData.email || user.email || "");
        setMobile(userData.mobile || "");
        setDob(userData.dob || "");
      } else {
        // Fallback to auth data
        setEmail(user.email || "");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading user data:", error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Update Firestore
      await updateDoc(doc(db, "users", user.uid), {
        name,
        mobile,
        dob,
      });

      Alert.alert("Success", "Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", error.message);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            await AsyncStorage.clear();
            router.replace("/login");
          } catch (error: any) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
        >
          <Text style={styles.editBtn}>{isEditing ? "Save" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../assets/appsize.png")}
              style={styles.avatar}
              resizeMode="cover"
            />
            {isEditing && (
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.userName}>{name || "User"}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>

        {/* Info Cards */}
        <View style={styles.content}>
          {/* Personal Information */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#0A84FF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.cardTitle}>Personal Information</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={name}
                onChangeText={setName}
                editable={isEditing}
                placeholder="Enter your name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={email}
                editable={false}
                placeholder="Email"
              />
              <Text style={styles.hint}>Email cannot be changed</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={mobile}
                onChangeText={setMobile}
                editable={isEditing}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={dob}
                onChangeText={setDob}
                editable={isEditing}
                placeholder="DD/MM/YYYY"
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons
                name="settings-outline"
                size={20}
                color="#0A84FF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.cardTitle}>Quick Actions</Text>
            </View>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => router.push("/saved_addresses")}
            >
              <View style={styles.actionLeft}>
                <Ionicons name="location-outline" size={22} color="#666" />
                <Text style={styles.actionText}>Saved Addresses</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => router.push("/order")}
            >
              <View style={styles.actionLeft}>
                <Ionicons name="receipt-outline" size={22} color="#666" />
                <Text style={styles.actionText}>Order History</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionLeft}>
                <Ionicons name="help-circle-outline" size={22} color="#666" />
                <Text style={styles.actionText}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#0A84FF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.cardTitle}>App Information</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>2024.02.06</Text>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backBtn: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  editBtn: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A84FF",
  },

  profileSection: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#fff",
  },

  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E7EB",
  },

  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0A84FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },

  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 14,
    color: "#666",
  },

  content: {
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#fff",
  },

  inputDisabled: {
    backgroundColor: "#F8F9FB",
    color: "#999",
  },

  hint: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },

  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  actionText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  infoLabel: {
    fontSize: 14,
    color: "#666",
  },

  infoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#FF3B30",
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
  },
});