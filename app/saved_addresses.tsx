import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SavedAddress = {
  id: string;
  label: string;
  society: string;
  street: string;
  flatNumber: string;
  landmark: string;
  fullAddress: string;
  coordinates: any;
  isDefault: boolean;
};

export default function SavedAddresses() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [currentAddress, setCurrentAddress] = useState<SavedAddress | null>(
    null,
  );

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, []),
  );

  const loadAddresses = async () => {
    try {
      // Load current address
      const savedLocation = await AsyncStorage.getItem("userAddress");
      if (savedLocation) {
        setCurrentAddress(JSON.parse(savedLocation));
      }

      // Load saved addresses
      const savedAddresses = await AsyncStorage.getItem("savedAddresses");
      if (savedAddresses) {
        const parsedAddresses = JSON.parse(savedAddresses);
        setAddresses(parsedAddresses);
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
    }
  };

  const setAsDefault = async (address: SavedAddress) => {
    try {
      // Save as current location
      await AsyncStorage.setItem("userAddress", JSON.stringify(address));

      // Update addresses list to reflect new default
      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === address.id,
      }));

      await AsyncStorage.setItem(
        "savedAddresses",
        JSON.stringify(updatedAddresses),
      );

      Alert.alert("Success", "Default address updated");
      loadAddresses();
      
      // Go back to home with updated address
      router.back();
    } catch (error) {
      console.error("Error setting default:", error);
      Alert.alert("Error", "Could not update default address");
    }
  };

  const deleteAddress = async (id: string) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedAddresses = addresses.filter(
                (addr) => addr.id !== id,
              );
              await AsyncStorage.setItem(
                "savedAddresses",
                JSON.stringify(updatedAddresses),
              );
              loadAddresses();
            } catch (error) {
              console.error("Error deleting address:", error);
            }
          },
        },
      ],
    );
  };

  const getIconForLabel = (label: string) => {
    const lowercaseLabel = label.toLowerCase();
    if (lowercaseLabel.includes("home")) return "home";
    if (lowercaseLabel.includes("work")) return "briefcase";
    if (lowercaseLabel.includes("hotel")) return "bed";
    if (lowercaseLabel.includes("restaurant")) return "restaurant";
    return "location";
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Current Location */}
        {currentAddress && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="location"
                size={20}
                color="#0A84FF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sectionTitle}>Current Location</Text>
            </View>

            <View style={[styles.addressCard, styles.currentCard]}>
              <View style={styles.addressIconBox}>
                <Ionicons
                  name={getIconForLabel(currentAddress.label)}
                  size={24}
                  color="#0A84FF"
                />
              </View>

              <View style={styles.addressInfo}>
                <Text style={styles.addressLabel}>
                  {currentAddress.label || "Current Location"}
                </Text>
                <Text style={styles.addressText} numberOfLines={2}>
                  {currentAddress.flatNumber && `${currentAddress.flatNumber}, `}
                  {currentAddress.society && `${currentAddress.society}, `}
                  {currentAddress.street}
                </Text>
                {currentAddress.landmark && (
                  <Text style={styles.landmark}>
                    Near {currentAddress.landmark}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Add New Address Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/first_location")}
        >
          <Ionicons name="add-circle-outline" size={24} color="#0A84FF" />
          <Text style={styles.addButtonText}>Add New Address</Text>
        </TouchableOpacity>

        {/* Saved Addresses List */}
        {addresses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Saved Addresses</Text>

            {addresses.map((address) => (
              <View key={address.id} style={styles.addressCard}>
                <View style={styles.addressIconBox}>
                  <Ionicons
                    name={getIconForLabel(address.label)}
                    size={24}
                    color="#666"
                  />
                </View>

                <View style={styles.addressInfo}>
                  <View style={styles.addressHeader}>
                    <Text style={styles.addressLabel}>{address.label}</Text>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.addressText} numberOfLines={2}>
                    {address.flatNumber && `${address.flatNumber}, `}
                    {address.society && `${address.society}, `}
                    {address.street}
                  </Text>

                  {address.landmark && (
                    <Text style={styles.landmark}>Near {address.landmark}</Text>
                  )}

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    {!address.isDefault && (
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => setAsDefault(address)}
                      >
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={18}
                          color="#0A84FF"
                        />
                        <Text style={styles.actionBtnText}>Set as Default</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.deleteBtn]}
                      onPress={() => deleteAddress(address.id)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                      <Text style={styles.deleteBtnText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {addresses.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons
              name="location-outline"
              size={64}
              color="#D1D5DB"
              style={{ marginBottom: 16 }}
            />
            <Text style={styles.emptyTitle}>No Saved Addresses</Text>
            <Text style={styles.emptyText}>
              Add your frequently used addresses for quick access
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
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

  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },

  addressCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  currentCard: {
    borderWidth: 2,
    borderColor: "#0A84FF",
  },

  addressIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F0F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  addressInfo: {
    flex: 1,
  },

  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  addressLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  addressText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  landmark: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },

  defaultBadge: {
    backgroundColor: "#E6F0FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  defaultText: {
    fontSize: 11,
    color: "#0A84FF",
    fontWeight: "600",
  },

  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F0F4FF",
  },

  actionBtnText: {
    fontSize: 13,
    color: "#0A84FF",
    fontWeight: "500",
  },

  deleteBtn: {
    backgroundColor: "#FFF1F0",
  },

  deleteBtnText: {
    fontSize: 13,
    color: "#FF3B30",
    fontWeight: "500",
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#0A84FF",
    borderStyle: "dashed",
  },

  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A84FF",
    marginLeft: 8,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
});