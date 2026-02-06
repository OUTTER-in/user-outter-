// ItemsScreen.js
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { DELIVERY_THEMES } from "./deliverythemes";
import { DELIVERY_TYPES } from "./deliveryConfig";

export default function CartScreen() {
    const { type } = useLocalSearchParams();

    const theme = DELIVERY_THEMES[type as keyof typeof DELIVERY_THEMES];
    const config = DELIVERY_TYPES[type as keyof typeof DELIVERY_TYPES];

    if (!theme || !config) return null;

    return (
        <View style={{ flex: 1, backgroundColor: theme.bgColor }}>

            {/* Background watermark */}
            <Text
                style={{
                    position: "absolute",
                    top: 120,
                    alignSelf: "center",
                    fontSize: 110,
                    fontWeight: "900",
                    opacity: 0.08,
                    color: theme.accent,
                }}
            >
                {theme.watermark}
            </Text>

            {/* Main Card */}
            <View
                style={{
                    margin: 20,
                    padding: 16,
                    borderRadius: 20,
                    backgroundColor: "#fff",
                }}
            >
                <Text style={{ fontSize: 22, fontWeight: "800", color: theme.accent }}>
                    {config.title}
                </Text>

                <Text style={{ marginTop: 4 }}>{config.helper}</Text>
            </View>

            {/* Extra Fee (ONLY GIFTS) */}
            {config.extraFee > 0 && (
                <View
                    style={{
                        marginHorizontal: 20,
                        padding: 12,
                        borderRadius: 14,
                        backgroundColor: "#fff",
                        borderLeftWidth: 4,
                        borderLeftColor: theme.accent,
                    }}
                >
                    <Text>🎁 Gift wrapping & handling</Text>
                    <Text style={{ fontWeight: "700" }}>
                        ₹{config.extraFee}
                    </Text>
                </View>
            )}
        </View>
    );
}

