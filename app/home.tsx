import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
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

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

export default function Home() {
  type AddressType = {
    label: string;
    society: string;
    street: string;
    flatNumber: string;
    landmark: string;
    fullAddress: string;
    coordinates: any;
  };

  const { address } = useLocalSearchParams();
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  useEffect(() => {
    if (address) {
      setSelectedAddress(JSON.parse(address as string));
    }
  }, [address]);

  const insets = useSafeAreaInsets();

  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<AddressType>({
    label: "Home",
    society: "Panchal society",
    street: "Sector 12",
    flatNumber: "",
    landmark: "",
    fullAddress: "",
    coordinates: null,
  });

  // Check if this is first launch and setup location
  useFocusEffect(
    useCallback(() => {
      loadSavedLocation(); // show saved immediately
      fetchLiveLocation(); // update in background
    }, []),
  );

  // Reload location when returning from location picker

  // Check if app is launched for the first time
  const checkFirstLaunchAndSetupLocation = async () => {
    try {
      setLocationLoading(true);

      // Check if user has already set up their address
      const hasCompletedSetup = await AsyncStorage.getItem(
        "hasCompletedLocationSetup",
      );
      const savedLocation = await AsyncStorage.getItem("userAddress");

      if (!hasCompletedSetup || !savedLocation) {
        // First time user - need to set up location
        console.log("First launch detected - navigating to location picker");
        setIsFirstLaunch(true);

        // Small delay for better UX
        setTimeout(() => {
          router.push("/first_location");
        }, 500);
      } else {
        // Returning user - load saved location
        console.log("Returning user - loading saved location");
        setIsFirstLaunch(false);
        await loadSavedLocation();
      }

      setLocationLoading(false);
    } catch (error) {
      console.error("Error checking first launch:", error);
      setLocationLoading(false);
    }
  };

  // Load saved location from AsyncStorage
  const loadSavedLocation = async () => {
    try {
      const savedLocation = await AsyncStorage.getItem("userAddress");

      if (savedLocation) {
        const addressData = JSON.parse(savedLocation);
        console.log("Loaded saved address:", addressData);
        setCurrentAddress(addressData);
      } else {
        // No saved location - show default
        setCurrentAddress({
          label: "Location",
          society: "Name of the society/house",
          street: "Tap to set address",
          flatNumber: "",
          landmark: "",
          fullAddress: "",
          coordinates: null,
        });
      }
    } catch (error) {
      console.error("Error loading saved location:", error);
    }
  };

  // Handle location click - navigate to location picker
  const handleLocationClick = () => {
    router.push("/saved_addresses");
  };

  // Format display text for header

  const getDisplayText = () => {
    if (currentAddress.fullAddress) 
      return currentAddress.fullAddress;
    if (currentAddress.street) return currentAddress.street;
    if (currentAddress.society) return currentAddress.society;
    return "Tap to set location";
  };

  // Get label for display
  const getDisplayLabel = () => {
    // If it's a business, show business name as label
    if (
      currentAddress.label &&
      currentAddress.label !== "Home" &&
      currentAddress.label !== "Current Location" &&
      currentAddress.label !== "Location"
    ) {
      return currentAddress.label; // Business name
    }
    return currentAddress.label; // "Home" or "Current Location"
  };

  const fetchLiveLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
        setLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode.length > 0) {
        const place = geocode[0];

        const addressData: AddressType = {
          label: "Current Location",
          society: place.name || "",
          street: place.street || place.district || "",
          flatNumber: "",
          landmark: place.subregion || "",
          fullAddress: `${place.name || ""}, ${place.street || ""}, ${place.city || ""}`,
          coordinates: location.coords,
        };

        setCurrentAddress(addressData);
        await AsyncStorage.setItem("userAddress", JSON.stringify(addressData));
      }
    } catch (err) {
      console.log("GPS error:", err);
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleLocationClick}
          style={styles.locationContainer}
          activeOpacity={0.7}
        >
          <Text style={styles.deliverText}>Deliver to</Text>
          <View style={styles.locationRow}>
            {locationLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : (
              <>
                <Ionicons name="location-outline" size={18} color="#ffffff" />
                <View style={styles.addressTextContainer}>
                  <Text style={styles.location} numberOfLines={3}>
                    {getDisplayText()}
                  </Text>
                  {currentAddress.landmark && (
                    <Text style={styles.landmark} numberOfLines={1}>
                      Near {currentAddress.landmark}
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-down" size={16} color="#ffffff" />
              </>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={30} color="#ffffff" />
            <View style={styles.dot} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/profile")}>
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
          <TouchableOpacity
            style={[styles.bigCard, { backgroundColor: "#1973cc" }]}
            onPress={() => router.push("/second_location")}
            activeOpacity={0.8}
          >
            <Ionicons name="cube-outline" size={32} color="#fff" />
            <Text style={styles.bigTitle}>Get Goods</Text>
            <Text style={styles.bigSub}>From market or anywhere</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bigCard, { backgroundColor: "#00a6ff" }]}
            onPress={() => router.push("/second_location")}
            activeOpacity={0.8}
          >
            <Ionicons name="swap-horizontal-outline" size={32} color="#fff" />
            <Text style={styles.bigTitle}>Pickup & Drop</Text>
            <Text style={styles.bigSub}>From home or anywhere</Text>
          </TouchableOpacity>
        </View>

        {/* ALL SERVICES */}
        <Text style={styles.section}>Services Provided</Text>

        <View style={styles.services}>
          {services.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.serviceItem}
              onPress={() =>
                router.push({
                  pathname: "/cart_restorent",
                  params: { type: item.type },
                })
              }
            >
              <View style={[styles.serviceIcon, { backgroundColor: item.bg }]}>
                {item.icon}
              </View>
              <Text style={styles.serviceText}>{item.name}</Text>
            </TouchableOpacity>
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

          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/order")}>
            <Ionicons name="receipt-outline" size={22} />
            <Text style={styles.tabText}>Orders</Text>
          </TouchableOpacity>

          {/* CENTER TAB */}
          <TouchableOpacity
            style={styles.centerTab}
            onPress={handleLocationClick}
          >
            <Ionicons name="location-outline" size={26} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/wallet")}>
            <Ionicons name="wallet-outline" size={22} />
            <Text style={styles.tabText}>Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/profile")}>
            <View style={styles.container}>
              <Image
                source={require("../assets/appsize.png")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
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

/* ---------- DATA ---------- */

const services = [
  {
    name: "Food",
    bg: "#FFE5E5",
    icon: <MaterialIcons name="restaurant" size={22} color="#FF7A00" />,
    type: "food",
  },
  {
    name: "Grocery",
    bg: "#E7F7EC",
    icon: <Ionicons name="cart-outline" size={22} color="#2ECC71" />,
    type: "groceries",
  },
  {
    name: "Printout",
    bg: "#FFEFF5",
    icon: <Ionicons name="print-outline" size={22} color="#FF4081" />,
    type: "documents",
  },
  {
    name: "Documents",
    bg: "#EAF1FF",
    icon: <Ionicons name="document-outline" size={22} color="#007AFF" />,
    type: "documents",
  },
  {
    name: "Gifts",
    bg: "#FFEAF4",
    icon: <Ionicons name="gift-outline" size={22} color="#FF69B4" />,
    type: "gifts",
  },
  {
    name: "Medicine",
    bg: "#EAFBF3",
    icon: <Ionicons name="medkit-outline" size={22} color="#2ECC71" />,
    type: "medicines",
  },
  {
    name: "fresh plants and flowers",
    bg: "#FFF3E0",
    icon: <Ionicons name="bag-outline" size={22} color="#51ff00ff" />,
    type: "flowers",
  },
  {
    name: "Courier",
    bg: "#EAF1FF",
    icon: <Ionicons name="car-outline" size={22} color="#007AFF" />,
    type: "groceries",
  },
];

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F9FB" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "#0A84FF",
    padding: 35,
    paddingTop: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  locationContainer: {
    flex: 1,
    marginRight: 12,
  },

  deliverText: {
    fontSize: 12,
    color: "#ffffff",
    marginBottom: 4,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  loadingText: {
    color: "#ffffff",
    fontSize: 14,
  },

  addressTextContainer: {
    flex: 1,
    marginHorizontal: 4,
  },

  location: {
    fontWeight: "600",
    color: "#ffffff",
    fontSize: 14,
  },

  landmark: {
    fontSize: 11,
    color: "#E0E0E0",
    marginTop: 2,
  },

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

  title: {
    padding: 25,
    fontSize: 26,
    fontWeight: "700",
    paddingHorizontal: 16,
  },
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  tabText: {
    fontSize: 11,
    color: "#777",
  },

  centerTab: {
    flex: 1,
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
});