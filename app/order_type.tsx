import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

interface CategoryCardProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    color: string;
    onPress: () => void;
}

export default function CategoryScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>What’s on your list?</Text>
            <Text style={styles.subtitle}>Choose a category to get started</Text>

            <CategoryCard
                icon={<Ionicons name="cart" size={24} color="#fff" />}
                title="Groceries"
                subtitle="Daily essentials & more"
                color="#3CB371"
                onPress={() =>
                    router.push({
                        pathname: "/cart_restorent",
                        params: { type: "groceries" },
                    })
                }
            />

            <CategoryCard
                icon={<Ionicons name="restaurant" size={24} color="#fff" />}
                title="Food / Restaurant"
                subtitle="Meals & snacks"
                color="#F57C00"
                onPress={() =>
                    router.push({
                        pathname: "/cart_restorent",
                        params: { type: "food" },
                    })
                }
            />

            <CategoryCard
                icon={<Ionicons name="document" size={24} color="#fff" />}
                title="Documents"
                subtitle="Files & documents"
                color="#1E88E5"
                onPress={() =>
                    router.push({
                        pathname: "/cart_restorent",
                        params: { type: "documents" },
                    })
                }
            />

            <CategoryCard
                icon={<MaterialIcons name="medical-services" size={24} color="#fff" />}
                title="Medicine"
                subtitle="Health & wellness"
                color="#D32F2F"
                onPress={() =>
                    router.push({
                        pathname: "/cart_restorent",
                        params: { type: "medicines" },
                    })
                }
            />

            <CategoryCard
                icon={<Ionicons name="gift" size={24} color="#fff" />}
                title="Gifts"
                subtitle="Presents & gifts"
                color="#8E24AA"
                onPress={() =>
                    router.push({
                        pathname: "/cart_restorent",
                        params: { type: "gifts" },
                    })
                }
            />

            <CategoryCard
                icon={<MaterialIcons name="local-florist" size={24} color="#fff" />}
                title="Flowers & Plants"
                subtitle="Fresh flowers & indoor plants"
                color="#4CAF50"
                onPress={() =>
                    router.push({
                        pathname: "/cart_restorent",
                        params: { type: "flowers" },
                    })
                }
            />
        </ScrollView>
    );
}

function CategoryCard({
    icon,
    title,
    subtitle,
    color,
    onPress,
}: CategoryCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={[styles.iconBox, { backgroundColor: color }]}>
                {icon}
            </View>
            <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardSubtitle}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F7FA" },
    content: { padding: 20 },

    title: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
    subtitle: { fontSize: 14, color: "#666", marginBottom: 20 },

    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },

    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },

    cardText: { flex: 1, marginLeft: 12 },

    cardTitle: { fontSize: 16, fontWeight: "600" },
    cardSubtitle: { fontSize: 13, color: "#777", marginTop: 2 },
});
