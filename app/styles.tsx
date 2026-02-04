import { StyleSheet } from "react-native";

/* ---------- STYLES ---------- */
export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F9FB" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  deliverText: { fontSize: 12, color: "#777" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  location: { fontWeight: "600" },

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

  title: { fontSize: 26, fontWeight: "700", paddingHorizontal: 16 },
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

  bottomTab: {
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 8,
  },
  tabItem: { alignItems: "center" },
  tabText: { fontSize: 12, color: "#777" },
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: "92%",
    justifyContent: "space-between",
    alignItems: "center",

    // Shadow (iOS)
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    // Shadow (Android)
    elevation: 8,
  },
  tabItem: {
    alignItems: "center",
    gap: 2,
  },

  tabText: {
    fontSize: 11,
    color: "#777",
  },

  centerTab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,

    shadowColor: "#007AFF",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
});
