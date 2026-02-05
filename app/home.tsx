import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Home() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.deliverText}>Deliver to</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={18} color="#ffffff" />
            <Text style={styles.location}>Home - Sector 12</Text>
            <Ionicons name="chevron-down" size={16} color="#ffffff" />
          </View>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={30} color="#ffffff" />
            <View style={styles.dot} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="person-circle-outline" size={34} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* TITLE */}
        <Text style={styles.title}>
          Your Own Personal <Text style={styles.highlight}>Delivery Guy!</Text>{" "}
          🚚
        </Text>
        <Text style={styles.subtitle}>Get anything delivered in minutes</Text>

        {/* MAIN CARDS */}
        <View style={styles.bigCards}>
          <View style={[styles.bigCard, { backgroundColor: "#1973cc" }]}>
            <Ionicons name="cube-outline" size={32} color="#fff" />
            <Text style={styles.bigTitle}>Get Goods</Text>
            <Text style={styles.bigSub}>From market or anywhere</Text>
          </View>

          <View style={[styles.bigCard, { backgroundColor: "#00a6ff" }]}>
            <Ionicons name="swap-horizontal-outline" size={32} color="#fff" />
            <Text style={styles.bigTitle}>Pickup & Drop</Text>
            <Text style={styles.bigSub}>From home or anywhere</Text>
          </View>
        </View>

        {/* ALL SERVICES */}
        <Text style={styles.section}>Services Provided</Text>

        <View style={styles.services}>
          {services.map((item, index) => (
            <View key={index} style={styles.serviceItem}>
              <View style={[styles.serviceIcon, { backgroundColor: item.bg }]}>
                {item.icon}
              </View>
              <Text style={styles.serviceText}>{item.name}</Text>
            </View>
          ))}
        </View>

        {/* LAST DELIVERY */}
        <View style={styles.deliveryCard}>
          <View style={styles.deliveryHeader}>
            <Ionicons name="cube" size={26} color="green" />
            <View>
              <Text style={styles.deliveryTitle}>Last Delivery</Text>
              <Text style={styles.deliverySub}>Grocery from Local Market</Text>
            </View>
            <Text style={styles.completed}>Completed</Text>
          </View>

          <Text style={styles.deliveryTime}>
            Delivered yesterday at 6:30 PM
          </Text>

          <Text style={styles.rate}>Rate your experience</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Ionicons key={i} name="star-outline" size={24} color="#ccc" />
            ))}
          </View>
        </View>

        {/* OFFERS */}
        <Text style={styles.section}>Special Offers</Text>

        <View style={styles.offers}>
          <View style={styles.offerCard}>
            <Feather name="percent" size={26} color="#007AFF" />
            <Text style={styles.offerTitle}>10% OFF</Text>
            <Text style={styles.offerSub}>First 3 orders</Text>
          </View>

          <View style={styles.offerCard}>
            <Ionicons name="gift-outline" size={26} />
            <Text style={styles.offerTitle}>Refer & Earn</Text>
            <Text style={styles.offerSub}>₹10 per friend</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BOTTOM TAB */}
      <View
        style={[
          styles.bottomTabWrapper,
          { bottom: insets.bottom > 0 ? insets.bottom : 12 },
        ]}
      >
        <View style={styles.bottomTab}>
          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="home-outline" size={22} />
            <Text style={styles.tabText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="receipt-outline" size={22} />
            <Text style={styles.tabText}>Orders</Text>
          </TouchableOpacity>

          {/* CENTER TAB */}
          <TouchableOpacity style={styles.centerTab}>
            <Ionicons name="location-outline" size={26} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="wallet-outline" size={22} />
            <Text style={styles.tabText}>Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem}>
            <View style={styles.container}>
              <Image
                source={require('../assets/appsize.png')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius:20,   // half of 40
                }}
  resizeMode="cover"
/>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function Tab({ icon, label, active, big }: any) {
  return (
    <View style={styles.tabItem}>
      <View
        style={[big && styles.bigTab, active && { backgroundColor: "#007AFF" }]}
      >
        <Ionicons
          name={icon}
          size={big ? 26 : 22}
          color={active ? "#fff" : "#777"}
        />
      </View>
      {!big && (
        <Text style={[styles.tabText, active && { color: "#007AFF" }]}>
          {label}
        </Text>
      )}
    </View>
  );
}

/* ---------- DATA ---------- */

const services = [
  {
    name: "Food",
    bg: "#FFE5E5",
    icon: <MaterialIcons name="restaurant" size={22} color="#FF7A00" />,
  },
  {
    name: "Grocery",
    bg: "#E7F7EC",
    icon: <Ionicons name="cart-outline" size={22} color="#2ECC71" />,
  },
  {
    name: "Printout",
    bg: "#FFEFF5",
    icon: <Ionicons name="print-outline" size={22} color="#FF4081" />,
  },
  {
    name: "Documents",
    bg: "#EAF1FF",
    icon: <Ionicons name="document-outline" size={22} color="#007AFF" />,
  },
  {
    name: "Gifts",
    bg: "#FFEAF4",
    icon: <Ionicons name="gift-outline" size={22} color="#FF69B4" />,
  },
  {
    name: "Medicine",
    bg: "#EAFBF3",
    icon: <Ionicons name="medkit-outline" size={22} color="#2ECC71" />,
  },
  {
    name: "Shopping",
    bg: "#FFF3E0",
    icon: <Ionicons name="bag-outline" size={22} color="#FF9800" />,
  },
  {
    name: "Courier",
    bg: "#EAF1FF",
    icon: <Ionicons name="car-outline" size={22} color="#007AFF" />,
  },
];

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F9FB" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    
    backgroundColor: "#0A84FF",
    padding: 35,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  deliverText: {  fontSize: 12, color: "#ffffff" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  location: { fontWeight: "600", color: "#ffffff" },

  headerIcons: { flexDirection: "row", gap: 12 },
  iconBtn: { position: "relative" },
  dot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    backgroundColor: "red",
    borderRadius: 4,
  },

  title: { padding:25,fontSize: 26, fontWeight: "700", paddingHorizontal: 16 },
  highlight: { color: "#007AFF" },
  subtitle: { color: "#777", paddingHorizontal: 16, marginBottom: 16 },

  bigCards: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
  },
  bigCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
  },
  bigTitle: { color: "#fff", fontSize: 16, fontWeight: "600", marginTop: 10 },
  bigSub: { color: "#E0E0E0", fontSize: 12 },

  section: {
    fontSize: 18,
    fontWeight: "600",
    margin: 16,
  },

  services: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 16,
  },
  serviceItem: { width: "21%", alignItems: "center" },
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceText: { fontSize: 12, marginTop: 6 },

  deliveryCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  deliveryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deliveryTitle: { fontWeight: "600" },
  deliverySub: { color: "#777", fontSize: 12 },
  completed: { marginLeft: "auto", color: "green" },
  deliveryTime: { marginTop: 10, color: "#777" },
  rate: { marginTop: 12 },
  stars: { flexDirection: "row", marginTop: 6 },

  offers: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
  },
  offerCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
  },
  offerTitle: { fontWeight: "600", marginTop: 8 },
  offerSub: { color: "#777", fontSize: 12 },
  bigTab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,
  },
  bottomTabWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },

  bottomTab: {
  flexDirection: "row",
  backgroundColor: "#fff",
  borderRadius: 28,
  paddingVertical: 12,
  width: "92%",
  alignItems: "center",

  // REMOVE justifyContent: "space-between"

  // Shadow (iOS)
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },

  // Shadow (Android)
  elevation: 8,
  },
tabItem: {
  flex: 1,                // 👈 Equal width for all tabs
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
},
  tabText: {
    fontSize: 11,
    color: "#777",
  },

  centerTab: {
  flex: 1,                // 👈 Important for equal spacing
  alignItems: "center",
  justifyContent: "center",

  width: 58,
  height: 58,
  borderRadius: 29,
  backgroundColor: "#007AFF",
  marginTop: -10,

  shadowColor: "#007AFF",
  shadowOpacity: 0.4,
  shadowRadius: 8,
  elevation: 10,
},
  container: {
    padding: 10,
    borderRadius: 28,
  },
  image: {
    width: 200,  // Static images need width and height specified in style
    height: 200, // unless using flexbox, in which case you may need to set { width: undefined, height: undefined }
    borderRadius: 28,
  }
});
