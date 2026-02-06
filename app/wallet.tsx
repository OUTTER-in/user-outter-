import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Wallet() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wallet</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Wallet Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <TouchableOpacity>
              <Ionicons name="eye-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.balanceAmount}>₹0.00</Text>

          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.balanceBtn}>
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <Text style={styles.balanceBtnText}>Add Money</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.balanceBtn}>
              <Ionicons name="arrow-up-circle-outline" size={20} color="#fff" />
              <Text style={styles.balanceBtnText}>Send Money</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Options</Text>

          <View style={styles.optionsGrid}>
            <TouchableOpacity style={styles.optionCard}>
              <View style={[styles.optionIcon, { backgroundColor: "#E6F0FF" }]}>
                <Ionicons name="gift-outline" size={24} color="#0A84FF" />
              </View>
              <Text style={styles.optionText}>Rewards</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionCard}>
              <View style={[styles.optionIcon, { backgroundColor: "#FFF1E0" }]}>
                <Ionicons name="pricetag-outline" size={24} color="#FF9500" />
              </View>
              <Text style={styles.optionText}>Offers</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionCard}>
              <View style={[styles.optionIcon, { backgroundColor: "#E7F7EC" }]}>
                <Ionicons name="card-outline" size={24} color="#34C759" />
              </View>
              <Text style={styles.optionText}>Payment</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionCard}>
              <View style={[styles.optionIcon, { backgroundColor: "#FFEAF4" }]}>
                <Ionicons name="time-outline" size={24} color="#FF2D55" />
              </View>
              <Text style={styles.optionText}>History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Empty State */}
          <View style={styles.emptyState}>
            <Ionicons
              name="wallet-outline"
              size={64}
              color="#D1D5DB"
              style={{ marginBottom: 16 }}
            />
            <Text style={styles.emptyTitle}>No Transactions Yet</Text>
            <Text style={styles.emptyText}>
              Your wallet transactions will appear here
            </Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>

          <TouchableOpacity style={styles.paymentCard}>
            <View style={styles.paymentLeft}>
              <View
                style={[styles.paymentIcon, { backgroundColor: "#E6F0FF" }]}
              >
                <Ionicons name="card-outline" size={24} color="#0A84FF" />
              </View>
              <View>
                <Text style={styles.paymentTitle}>Credit/Debit Card</Text>
                <Text style={styles.paymentSub}>Add a new card</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentCard}>
            <View style={styles.paymentLeft}>
              <View
                style={[styles.paymentIcon, { backgroundColor: "#E7F7EC" }]}
              >
                <Ionicons name="cash-outline" size={24} color="#34C759" />
              </View>
              <View>
                <Text style={styles.paymentTitle}>UPI</Text>
                <Text style={styles.paymentSub}>Link UPI ID</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentCard}>
            <View style={styles.paymentLeft}>
              <View
                style={[styles.paymentIcon, { backgroundColor: "#FFF1E0" }]}
              >
                <Ionicons name="business-outline" size={24} color="#FF9500" />
              </View>
              <View>
                <Text style={styles.paymentTitle}>Net Banking</Text>
                <Text style={styles.paymentSub}>Link bank account</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
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

  balanceCard: {
    backgroundColor: "#0A84FF",
    margin: 16,
    padding: 24,
    borderRadius: 20,
    shadowColor: "#0A84FF",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  balanceLabel: {
    fontSize: 14,
    color: "#E0E0E0",
  },

  balanceAmount: {
    fontSize: 40,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },

  balanceActions: {
    flexDirection: "row",
    gap: 12,
  },

  balanceBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },

  balanceBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },

  seeAll: {
    fontSize: 14,
    color: "#0A84FF",
    fontWeight: "500",
  },

  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  optionCard: {
    width: "23%",
    alignItems: "center",
  },

  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  optionText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginTop: 8,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },

  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  paymentTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },

  paymentSub: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
});
