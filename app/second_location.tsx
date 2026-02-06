import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const GOOGLE_MAPS_API_KEY = "AIzaSyCqJ7Z0kRWRk7IueXLemwjtwkmL3P9Lm3w";
const { width } = Dimensions.get("window");

interface MarkerPosition {
  latitude: number;
  longitude: number;
}

interface PlaceSuggestion {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
  types?: string[];
}

interface PlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
}

interface PlaceDetails {
  name: string;
  businessType: string;
  formattedAddress: string;
  phoneNumber?: string;
  photos?: PlacePhoto[];
  rating?: number;
  userRatingsTotal?: number;
  openNow?: boolean;
  website?: string;
  placeId?: string;
}

interface AddressComponents {
  streetAddress: string;
  landmark: string;
  flatNumber: string;
  society: string;
  placeName: string;
  placeType: string;
}

const DeliveryLocationPicker: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [region, setRegion] = useState<Region>({
    latitude: 28.6139,
    longitude: 77.209,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [markerPosition, setMarkerPosition] = useState<MarkerPosition | null>(
    null,
  );

  const [addressComponents, setAddressComponents] = useState<AddressComponents>(
    {
      streetAddress: "",
      landmark: "",
      flatNumber: "",
      society: "",
      placeName: "",
      placeType: "",
    },
  );

  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [showNearbyPlaces, setShowNearbyPlaces] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingNearby, setLoadingNearby] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);

  const mapRef = useRef<MapView>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      try {
        console.log("Requesting location permission...");
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert("Permission Denied", "Please enable location services.", [
            { text: "OK" },
          ]);
          return;
        }

        setLoading(true);
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const { latitude, longitude } = currentLocation.coords;

        const newRegion: Region = {
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        };

        setLocation(currentLocation);
        setRegion(newRegion);
        setMarkerPosition({ latitude, longitude });

        await getAddressFromCoordinates(latitude, longitude);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Location error:", error);
        Alert.alert("Location Error", "Could not get your location.");
      }
    })();
  }, []);

  const getPlaceTypeLabel = (types: string[]): string => {
    const typeMap: { [key: string]: string } = {
      restaurant: "Restaurant",
      cafe: "Cafe",
      food: "Food Place",
      bar: "Bar",
      store: "Store",
      clothing_store: "Clothing Store",
      supermarket: "Supermarket",
      grocery_or_supermarket: "Grocery Store",
      shopping_mall: "Shopping Mall",
      hospital: "Hospital",
      pharmacy: "Pharmacy",
      bank: "Bank",
      atm: "ATM",
      gas_station: "Gas Station",
      parking: "Parking",
      lodging: "Hotel",
      gym: "Gym",
      school: "School",
      bakery: "Bakery",
      meal_delivery: "Food Delivery",
      meal_takeaway: "Takeaway",
    };

    for (const type of types) {
      if (typeMap[type]) {
        return typeMap[type];
      }
    }

    return "Location";
  };

  async function getPhoneNumber(placeId: string) {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_phone_number&key=AIzaSyCqJ7Z0kRWRk7IueXLemwjtwkmL3P9Lm3w`,
    );
    const data = await res.json();
    return data.result?.formatted_phone_number;
  }

  // NEW: Search for nearby places when map is tapped
  const searchNearbyPlaces = async (latitude: number, longitude: number) => {
    try {
      console.log("Searching for nearby places at:", latitude, longitude);
      setLoadingNearby(true);

      // Use Places Nearby Search API to find businesses at this location
      const radius = 50; // Search within 50 meters
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      console.log("Nearby search status:", data.status);

      if (data.status === "OK" && data.results && data.results.length > 0) {
        console.log("Found", data.results.length, "nearby places");

        // Filter out generic places and prioritize businesses
        const businesses = data.results.filter((place: any) => {
          const types = place.types || [];
          return (
            !types.includes("political") &&
            !types.includes("route") &&
            !types.includes("locality")
          );
        });

        if (businesses.length > 0) {
          setNearbyPlaces(businesses);
          setShowNearbyPlaces(true);
          setLoadingNearby(false);
          return businesses;
        }
      }

      // No businesses found
      setNearbyPlaces([]);
      setShowNearbyPlaces(false);
      setLoadingNearby(false);
      return null;
    } catch (error) {
      console.error("Nearby search error:", error);
      setLoadingNearby(false);
      return null;
    }
  };

  const pickClosestPlace = (
    places: any[],
    latitude: number,
    longitude: number,
  ) => {
    if (!places || places.length === 0) return null;

    const toRad = (v: number) => (v * Math.PI) / 180;

    const distance = (p: any) => {
      const dLat = toRad(p.geometry.location.lat - latitude);
      const dLon = toRad(p.geometry.location.lng - longitude);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(latitude)) *
          Math.cos(toRad(p.geometry.location.lat)) *
          Math.sin(dLon / 2) ** 2;
      return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    return places.sort((a, b) => distance(a) - distance(b))[0];
  };

  const fetchPlaceDetails = async (placeId: string) => {
    try {
      console.log("Fetching place details for:", placeId);

      const fields =
        "name,formatted_address,geometry,photos,rating,user_ratings_total,opening_hours,formatted_phone_number,website,types,business_status";
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.result) {
        const place = data.result;
        const businessType = place.types
          ? getPlaceTypeLabel(place.types)
          : "Location";

        const details: PlaceDetails & { geometry?: any } = {
          name: place.name || "Unknown Place",
          businessType: businessType,
          formattedAddress: place.formatted_address || "",
          phoneNumber: place.formatted_phone_number,
          photos: place.photos,
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
          openNow: place.opening_hours?.open_now,
          website: place.website,
          placeId: placeId,
          geometry: place.geometry, // ✅ store geometry
        };

        setPlaceDetails(details);

        setAddressComponents((prev) => ({
          ...prev,
          placeName: details.name,
          placeType: details.businessType,
          society: details.name,
        }));

        return details;
      }
      return null;
    } catch (error) {
      console.error("Error fetching place details:", error);
      return null;
    }
  };

  const getPhotoUrl = (
    photoReference: string,
    maxWidth: number = 400,
  ): string => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
  };

  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number,
    placeId?: string,
  ) => {
    try {
      console.log("Getting address for:", latitude, longitude);

      if (placeId) {
        const details = await fetchPlaceDetails(placeId);
        if (details) {
          setSearchQuery(details.name);

          const addressParts = details.formattedAddress
            .split(",")
            .map((s) => s.trim());
          const streetAddress = addressParts.slice(0, -2).join(", ");

          setAddressComponents((prev) => ({
            ...prev,
            streetAddress: streetAddress,
            placeName: details.name,
            placeType: details.businessType,
            society: details.name,
          }));

          return;
        }
      }

      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (addresses && addresses.length > 0) {
          const addr = addresses[0];

          const streetParts = [addr.streetNumber, addr.street].filter(Boolean);
          const areaParts = [addr.subregion, addr.city, addr.region].filter(
            Boolean,
          );

          const streetAddress =
            streetParts.length > 0
              ? `${streetParts.join(" ")}, ${areaParts.join(", ")}`
              : areaParts.join(", ");

          const landmark = addr.district || addr.subregion || "";
          const displayAddress = [
            streetParts.join(" "),
            addr.subregion,
            addr.city,
          ]
            .filter(Boolean)
            .join(", ");

          setAddressComponents((prev) => ({
            ...prev,
            streetAddress: streetAddress || "Address found",
            landmark: landmark,
            placeName: "",
            placeType: "",
          }));

          setSearchQuery(
            displayAddress || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          );
          setPlaceDetails(null);
          return;
        }
      } catch (expoError) {
        console.log("Expo reverseGeocodeAsync failed, trying Google API...");
      }

      await getAddressFromGoogle(latitude, longitude);
    } catch (error) {
      console.error("Error in getAddressFromCoordinates:", error);
      setAddressComponents((prev) => ({
        ...prev,
        streetAddress: `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      }));
      setSearchQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    }
  };

  const getAddressFromGoogle = async (latitude: number, longitude: number) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results && data.results.length > 0) {
        const result = data.results[0];

        let street = "";
        let sublocality = "";
        let locality = "";

        result.address_components?.forEach((component: any) => {
          const types = component.types;

          if (types.includes("route") || types.includes("street_address")) {
            street = component.long_name;
          }
          if (
            types.includes("sublocality_level_1") ||
            types.includes("sublocality")
          ) {
            sublocality = component.long_name;
          }
          if (types.includes("locality")) {
            locality = component.long_name;
          }
        });

        const addressParts = [street, sublocality, locality].filter(Boolean);
        const readableAddress = addressParts.join(", ");

        setAddressComponents((prev) => ({
          ...prev,
          streetAddress: readableAddress || result.formatted_address,
          landmark: sublocality || "",
        }));

        setSearchQuery(result.formatted_address);
      } else {
        setAddressComponents((prev) => ({
          ...prev,
          streetAddress: `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        }));
        setSearchQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    } catch (error) {
      console.error("Google API error:", error);
      setAddressComponents((prev) => ({
        ...prev,
        streetAddress: `Location selected`,
      }));
    }
  };

  const fetchPlaceSuggestions = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const locationBias = markerPosition
        ? `&location=${markerPosition.latitude},${markerPosition.longitude}&radius=50000`
        : "";

      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query,
      )}&key=${GOOGLE_MAPS_API_KEY}${locationBias}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.predictions) {
        setSuggestions(data.predictions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Autocomplete error:", error);
      setSuggestions([]);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (text.length >= 2) {
      searchTimeout.current = setTimeout(() => {
        fetchPlaceSuggestions(text);
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const getSuggestionIcon = (types?: string[]): string => {
    if (!types) return "📍";

    const iconMap: { [key: string]: string } = {
      restaurant: "🍽️",
      cafe: "☕",
      food: "🍔",
      bar: "🍺",
      store: "🏪",
      shopping_mall: "🏬",
      supermarket: "🛒",
      hospital: "🏥",
      pharmacy: "💊",
      bank: "🏦",
      gas_station: "⛽",
      lodging: "🏨",
      gym: "💪",
      school: "🏫",
      bakery: "🥐",
    };

    for (const type of types) {
      if (iconMap[type]) {
        return iconMap[type];
      }
    }

    return "📍";
  };

  const getCoordinatesFromPlaceId = async (placeId: string) => {
    try {
      setSelectedPlaceId(placeId);

      const fields = "geometry,name,formatted_address,photos,rating,types";
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.result && data.result.geometry) {
        const { lat, lng } = data.result.geometry.location;

        const newRegion: Region = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        };

        setRegion(newRegion);
        setMarkerPosition({ latitude: lat, longitude: lng });
        setShowSuggestions(false);

        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }

        await getAddressFromCoordinates(lat, lng, placeId);
      }
    } catch (error) {
      console.error("Error getting coordinates:", error);
    }
  };

  const handleSuggestionSelect = (item: PlaceSuggestion) => {
    console.log("Selected from search:", item.description);
    getCoordinatesFromPlaceId(item.place_id);
  };

  // NEW: Handle nearby place selection
  const handleNearbyPlaceSelect = async (place: any) => {
    console.log("Selected nearby place:", place.name);
    setShowNearbyPlaces(false);

    // Fetch full details and update UI
    const details = await fetchPlaceDetails(place.place_id);

    // Update search query
    setSearchQuery(place.name);

    // Update address
    const addressParts =
      place.vicinity?.split(",").map((s: string) => s.trim()) || [];
    const streetAddress = addressParts.join(", ");

    setAddressComponents((prev) => ({
      ...prev,
      streetAddress: streetAddress || place.vicinity || "",
    }));

    // ✅ Update marker position
    if (details && details.placeId) {
      // Use the geometry from fetched details
      const latLng = details?.geometry
        ? {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          }
        : markerPosition;

      if (latLng) {
        setMarkerPosition(latLng);

        // Animate the map to the selected marker
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              ...latLng,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            },
            1000,
          );
        }
      }
    }
  };

  // UPDATED: Handle map press - search for nearby businesses
  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    setMarkerPosition({ latitude, longitude });
    setSelectedPlaceId(null);
    setPlaceDetails(null);

    const nearbyResults = await searchNearbyPlaces(latitude, longitude);

    if (nearbyResults && nearbyResults.length > 0) {
      // AUTO-select closest business
      setNearbyPlaces(nearbyResults);
      setShowNearbyPlaces(true);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      setLoading(true);
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = currentLocation.coords;

      const newRegion: Region = {
        latitude,
        longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      };

      setRegion(newRegion);
      setMarkerPosition({ latitude, longitude });
      setSelectedPlaceId(null);
      setPlaceDetails(null);
      setShowNearbyPlaces(false);
      await getAddressFromCoordinates(latitude, longitude);

      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Could not get current location");
    }
  };

  const handleProceedToForm = () => {
    if (!markerPosition) {
      Alert.alert("Error", "Please select a location");
      return;
    }

    setShowAddressForm(true);
    setShowNearbyPlaces(false);
  };

  const handleBackToMap = () => {
    setShowAddressForm(false);
  };

  const handleConfirmAddress = async () => {
    if (!markerPosition) {
      Alert.alert("Error", "Please select a location");
      return;
    }

    if (!placeDetails && !addressComponents.flatNumber.trim()) {
      Alert.alert("Required Field", "Please enter your Flat / House number");
      return;
    }

    const fullAddress = {
      label: placeDetails ? placeDetails.name : "Home",
      society: addressComponents.society,
      street: addressComponents.streetAddress,
      flatNumber: addressComponents.flatNumber,
      landmark: addressComponents.landmark,
      fullAddress: placeDetails
        ? `${placeDetails.name + " " + addressComponents.society}, ${addressComponents.streetAddress}`
        : `${addressComponents.flatNumber + " / " + addressComponents.society}, ${addressComponents.streetAddress}`,
      coordinates: markerPosition,
      businessDetails: placeDetails || null,
    };

    // ✅ ONLY LOG — no AsyncStorage, no navigation
    console.log("FINAL SELECTED ADDRESS ↓↓↓");
    console.log(JSON.stringify(fullAddress, null, 2));

    Alert.alert("Success", "Address printed in terminal");
  };

  if (loading && !location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  // Form View
  if (showAddressForm) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formHeader}>
            <TouchableOpacity
              onPress={handleBackToMap}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>← Back to Map</Text>
            </TouchableOpacity>
            <Text style={styles.formTitle}>
              {placeDetails
                ? "Confirm Business Location"
                : "Complete Your Address"}
            </Text>
          </View>

          {placeDetails && (
            <View style={styles.businessCard}>
              <View style={styles.businessHeader}>
                <Text style={styles.businessIcon}>
                  {getSuggestionIcon(
                    placeDetails.businessType
                      ? [placeDetails.businessType.toLowerCase()]
                      : [],
                  )}
                </Text>
                <View style={styles.businessInfo}>
                  <Text style={styles.businessName}>{placeDetails.name}</Text>
                  <Text style={styles.businessType}>
                    {placeDetails.businessType}
                  </Text>
                  {placeDetails.rating && (
                    <Text style={styles.ratingText}>
                      ⭐ {placeDetails.rating}
                    </Text>
                  )}
                </View>
              </View>

              {placeDetails.photos && placeDetails.photos.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.photosContainer}
                >
                  {placeDetails.photos.slice(0, 5).map((photo, index) => (
                    <Image
                      key={index}
                      source={{ uri: getPhotoUrl(photo.photo_reference) }}
                      style={styles.placePhoto}
                      resizeMode="cover"
                    />
                  ))}
                </ScrollView>
              )}
              {placeDetails.phoneNumber ? (
                <Text style={{ marginTop: 8 }}>
                  📞 {placeDetails.phoneNumber}
                </Text>
              ) : (
                <Text style={{ marginTop: 8, color: "#777" }}>
                  📞 Not available on Google
                </Text>
              )}
            </View>
          )}

          <View style={styles.locationPreview}>
            <Text style={styles.previewLabel}>📍 Selected Location:</Text>
            <Text style={styles.previewText}>{searchQuery}</Text>
          </View>

          {!placeDetails && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Flat / House No. <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Flat 301"
                  value={addressComponents.flatNumber}
                  onChangeText={(text) =>
                    setAddressComponents({
                      ...addressComponents,
                      flatNumber: text,
                    })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Society / Apartment (Optional)
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Green Valley"
                  value={addressComponents.society}
                  onChangeText={(text) =>
                    setAddressComponents({
                      ...addressComponents,
                      society: text,
                    })
                  }
                />
              </View>
            </>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Street Address</Text>
            <TextInput
              style={[styles.textInput, styles.autoFilledInput]}
              value={addressComponents.streetAddress}
              editable={true}
              multiline
              onChangeText={(text) =>
                setAddressComponents({
                  ...addressComponents,
                  streetAddress: text,
                })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Landmark (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Near City Mall"
              value={addressComponents.landmark}
              onChangeText={(text) =>
                setAddressComponents({ ...addressComponents, landmark: text })
              }
            />
          </View>

          <TouchableOpacity
            style={styles.confirmAddressButton}
            onPress={handleConfirmAddress}
          >
            <Text style={styles.confirmAddressButtonText}>Confirm Address</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Map View
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search restaurants, shops, or address..."
              value={searchQuery}
              onChangeText={handleSearchChange}
              onFocus={() => {
                if (searchQuery.length >= 2 && suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionSelect(item)}
                  >
                    <Text style={styles.suggestionIcon}>
                      {getSuggestionIcon(item.types)}
                    </Text>
                    <View style={styles.suggestionTextContainer}>
                      <Text style={styles.suggestionMainText}>
                        {item.structured_formatting?.main_text ||
                          item.description}
                      </Text>
                      {item.structured_formatting?.secondary_text && (
                        <Text style={styles.suggestionSecondaryText}>
                          {item.structured_formatting.secondary_text}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          )}
        </View>

        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {markerPosition && (
            <Marker
              coordinate={markerPosition}
              draggable
              title={placeDetails?.name}
              onDragEnd={(e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                handleMapPress({
                  nativeEvent: { coordinate: { latitude, longitude } },
                });
              }}
            />
          )}
        </MapView>

        {loadingNearby && (
          <View style={styles.loadingNearbyContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingNearbyText}>
              Searching for businesses...
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={handleUseCurrentLocation}
        >
          <Text style={styles.currentLocationText}>📍</Text>
        </TouchableOpacity>

        {/* NEW: Nearby Places Popup */}
        {showNearbyPlaces && nearbyPlaces.length > 0 && (
          <View style={styles.nearbyPlacesContainer}>
            <View style={styles.nearbyPlacesHeader}>
              <Text style={styles.nearbyPlacesTitle}>
                📍 Businesses at this location:
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowNearbyPlaces(false);
                  getAddressFromCoordinates(
                    markerPosition!.latitude,
                    markerPosition!.longitude,
                  );
                }}
              >
                <Text style={styles.nearbyPlacesClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.nearbyPlacesList}
              showsVerticalScrollIndicator={false}
            >
              {nearbyPlaces.map((place, index) => (
                <TouchableOpacity
                  key={place.place_id || index}
                  style={styles.nearbyPlaceItem}
                  onPress={() => handleNearbyPlaceSelect(place)}
                >
                  <Text style={styles.nearbyPlaceIcon}>
                    {getSuggestionIcon(place.types)}
                  </Text>
                  <View style={styles.nearbyPlaceInfo}>
                    <Text style={styles.nearbyPlaceName}>{place.name}</Text>
                    {place.vicinity && (
                      <Text style={styles.nearbyPlaceAddress}>
                        {place.vicinity}
                      </Text>
                    )}
                    {place.rating && (
                      <Text style={styles.nearbyPlaceRating}>
                        ⭐ {place.rating}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.useRegularAddressButton}
                onPress={() => {
                  setShowNearbyPlaces(false);
                  getAddressFromCoordinates(
                    markerPosition!.latitude,
                    markerPosition!.longitude,
                  );
                }}
              >
                <Text style={styles.useRegularAddressText}>
                  🏠 Use regular address instead
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        <View style={styles.bottomContainer}>
          {placeDetails ? (
            <View style={styles.businessQuickInfo}>
              <View style={styles.businessQuickHeader}>
                <Text style={styles.businessQuickIcon}>
                  {getSuggestionIcon(
                    placeDetails.businessType
                      ? [placeDetails.businessType.toLowerCase()]
                      : [],
                  )}
                </Text>
                <View style={styles.businessQuickText}>
                  <Text style={styles.businessQuickName}>
                    {placeDetails.name}
                  </Text>
                  <Text style={styles.businessQuickType}>
                    {placeDetails.businessType}
                  </Text>
                  {placeDetails.rating && (
                    <Text style={styles.businessQuickRating}>
                      ⭐ {placeDetails.rating}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.addressContainer}>
              <Text style={styles.addressLabel}>📍 Delivery Location:</Text>
              <Text style={styles.addressText} numberOfLines={2}>
                {addressComponents.streetAddress || "Tap on map or search..."}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.proceedButton,
              !addressComponents.streetAddress && styles.proceedButtonDisabled,
            ]}
            onPress={handleProceedToForm}
            disabled={!addressComponents.streetAddress}
          >
            <Text style={styles.proceedButtonText}>
              {placeDetails
                ? "Confirm This Business →"
                : "Proceed to Add Details →"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
  searchContainer: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16 },
  clearButton: { padding: 4 },
  clearButtonText: { fontSize: 18, color: "#999" },
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 300,
    width: width - 20, // full width minus horizontal margin
    alignSelf: "center", // center it horizontally
  },
  suggestionsList: { maxHeight: 300 },
  suggestionItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  suggestionIcon: { fontSize: 20, marginRight: 12 },
  suggestionTextContainer: { flex: 1 },
  suggestionMainText: { fontSize: 15, color: "#333", fontWeight: "500" },
  suggestionSecondaryText: { fontSize: 13, color: "#666", marginTop: 2 },
  map: { flex: 1 },
  loadingNearbyContainer: {
    position: "absolute",
    top: 120,
    alignSelf: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  loadingNearbyText: { marginLeft: 10, fontSize: 14, color: "#666" },
  currentLocationButton: {
    position: "absolute",
    bottom: 220,
    right: 20,
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  currentLocationText: { fontSize: 24 },
  nearbyPlacesContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    elevation: 10,
    paddingBottom: 100,
  },
  nearbyPlacesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  nearbyPlacesTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  nearbyPlacesClose: { fontSize: 24, color: "#999", padding: 5 },
  nearbyPlacesList: { maxHeight: 300 },
  nearbyPlaceItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    alignItems: "center",
  },
  nearbyPlaceIcon: { fontSize: 28, marginRight: 12 },
  nearbyPlaceInfo: { flex: 1 },
  nearbyPlaceName: { fontSize: 16, fontWeight: "600", color: "#333" },
  nearbyPlaceAddress: { fontSize: 13, color: "#666", marginTop: 2 },
  nearbyPlaceRating: { fontSize: 13, color: "#ff9800", marginTop: 4 },
  useRegularAddressButton: {
    padding: 15,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 10,
  },
  useRegularAddressText: { fontSize: 14, color: "#007AFF", fontWeight: "500" },
  bottomContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addressContainer: { marginBottom: 15 },
  addressLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    fontWeight: "600",
  },
  addressText: { fontSize: 16, color: "#333", fontWeight: "500" },
  businessQuickInfo: { marginBottom: 15 },
  businessQuickHeader: { flexDirection: "row", alignItems: "center" },
  businessQuickIcon: { fontSize: 32, marginRight: 12 },
  businessQuickText: { flex: 1 },
  businessQuickName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  businessQuickType: { fontSize: 14, color: "#666", marginTop: 2 },
  businessQuickRating: { fontSize: 14, color: "#ff9800", marginTop: 4 },
  proceedButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  proceedButtonDisabled: { backgroundColor: "#ccc" },
  proceedButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  formContainer: { flex: 1, backgroundColor: "#f8f9fa" },
  formHeader: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: { marginBottom: 10 },
  backButtonText: { color: "#007AFF", fontSize: 16 },
  formTitle: { fontSize: 24, fontWeight: "bold", color: "#333" },
  businessCard: {
    backgroundColor: "#fff",
    marginTop: 10,
    marginHorizontal: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  businessHeader: { flexDirection: "row", marginBottom: 12 },
  businessIcon: { fontSize: 40, marginRight: 12 },
  businessInfo: { flex: 1 },
  businessName: { fontSize: 20, fontWeight: "bold", color: "#333" },
  businessType: { fontSize: 14, color: "#666", marginTop: 4 },
  ratingText: {
    fontSize: 14,
    color: "#ff9800",
    fontWeight: "600",
    marginTop: 6,
  },
  photosContainer: { marginTop: 12, marginBottom: 8 },
  placePhoto: { width: 120, height: 120, borderRadius: 8, marginRight: 10 },
  locationPreview: {
    backgroundColor: "#fff",
    padding: 15,
    marginTop: 10,
    marginHorizontal: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  previewLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
    fontWeight: "600",
  },
  previewText: { fontSize: 14, color: "#333" },
  inputGroup: {
    backgroundColor: "#fff",
    padding: 15,
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  required: { color: "#ff3b30" },
  textInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  autoFilledInput: { backgroundColor: "#f9fafb" },
  confirmAddressButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    marginHorizontal: 15,
    marginTop: 25,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  confirmAddressButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default DeliveryLocationPicker;
