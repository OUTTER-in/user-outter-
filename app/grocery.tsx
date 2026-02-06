import React, { useState, useEffect } from 'react';
import { router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { auth } from "../firebaseConfig";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  note?: string;
}

interface Order {
  id: string;
  items: CartItem[];
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered';
  createdAt: string;
}

export default function GroceryOrderScreen({ navigation }: any) {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const addItemToCart = () => {
    if (!itemName.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    const newItem: CartItem = {
      id: Date.now().toString(),
      name: itemName.trim(),
      quantity: parseInt(quantity) || 1,
      note: note.trim() || undefined,
    };

    setCart([...cart, newItem]);
    
    // Reset form
    setItemName('');
    setQuantity('1');
    setNote('');
  };

  const removeItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    ));
  };

  const createOrder = async () => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not logged in");
    }

    const totalAmount = cart.reduce(
      (sum, item) => sum + 0 * item.quantity,
      0
    );

    const { data: order, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user.uid,
          total_amount: totalAmount,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(
        cart.map((item) => ({
          order_id: order.id,
          item_name: item.name,
          quantity: item.quantity,
          note: item.note || null,
        }))
      );

    if (itemsError) throw itemsError;

    return order;
  };

  const proceedToCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert("Error", "Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      await createOrder();

      Alert.alert("Success", "Your order has been placed!");
      setCart([]);

    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

return (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
    <View style={{ flex: 1 }}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/home")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="bag-handle" size={32} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Groceries</Text>
            <Text style={styles.headerSubtitle}>
              ✨ Add items to your order
            </Text>
          </View>
        </View>
      </View>

      {/* SCROLL CONTENT */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: cart.length > 0 ? 200 : 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
          {/* EVERYTHING INSIDE YOUR SCROLLVIEW STAYS EXACTLY SAME */}
        <View style={styles.addItemCard}>
          <View style={styles.cardHeader}>
            <View style={styles.addIconContainer}>
              <Ionicons name="add" size={24} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>Add New Item</Text>
          </View>

          <View style={styles.formRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ITEM NAME *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Rice, Milk"
                placeholderTextColor="#999"
                value={itemName}
                onChangeText={setItemName}
              />
            </View>

            <View style={styles.qtyGroup}>
              <Text style={styles.label}>QTY*</Text>
              <View style={styles.qtyContainer}>
                <TextInput
                  style={styles.qtyInput}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="number-pad"
                />
                <View style={styles.qtyButtons}>
                  <TouchableOpacity
                    onPress={() => setQuantity((parseInt(quantity) + 1).toString())}
                    style={styles.qtyButton}
                  >
                    <Ionicons name="chevron-up" size={16} color="#666" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setQuantity(Math.max(1, parseInt(quantity) - 1).toString())}
                    style={styles.qtyButton}
                  >
                    <Ionicons name="chevron-down" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>NOTE (OPTIONAL)</Text>
            <TextInput
              style={[styles.input, styles.noteInput]}
              placeholder="Any specific details..."
              placeholderTextColor="#999"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity style={styles.addButton} onPress={addItemToCart}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cartSection}>
          <View style={styles.cartHeader}>
            <Text style={styles.cartTitle}>Your Cart</Text>
            <View style={styles.itemBadge}>
              <Text style={styles.itemBadgeText}>{cart.length} item{cart.length !== 1 ? 's' : ''}</Text>
            </View>
          </View>

          {cart.length === 0 ? (
            <View style={styles.emptyCart}>
              <Ionicons name="cart-outline" size={48} color="#ccc" />
              <Text style={styles.emptyCartText}>Your cart is empty</Text>
            </View>
          ) : (
            cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemIcon}>
                  <Ionicons name="cube" size={24} color="#2196F3" />
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.note && (
                    <Text style={styles.itemNote}>Note: {item.note}</Text>
                  )}
                </View>
                <View style={styles.itemActions}>
                  <View style={styles.qtyBadge}>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      style={styles.qtyActionButton}
                    >
                      <Ionicons name="remove" size={16} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>x{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      style={styles.qtyActionButton}
                    >
                      <Ionicons name="add" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Ionicons name="trash-outline" size={20} color="#f44336" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
              </ScrollView>

      {/* FIXED FOOTER */}
      {cart.length > 0 && (
        <View
          style={[
            styles.footer,
            { paddingBottom:  insets.bottom-40 }
          ]}
        >
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={proceedToCheckout}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="bag-check" size={24} color="#fff" />
                <Text style={styles.checkoutButtonText}>
                  Proceed to Checkout
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.readyText}>
            {cart.length} item
            {cart.length !== 1 ? "s" : ""} ready for delivery 🚀
          </Text>
        </View>
      )}
    </View>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  addItemCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  addIconContainer: {
    backgroundColor: '#2196F3',
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  qtyGroup: {
    width: 100,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#333',
  },
  noteInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    overflow: 'hidden',
  },
  qtyInput: {
    flex: 1,
    padding: 14,
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
  },
  qtyButtons: {
    paddingRight: 4,
  },
  qtyButton: {
    padding: 4,
  },
  addButton: {
    backgroundColor: '#64B5F6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cartSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cartTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  itemBadge: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  itemBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCart: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyCartText: {
    color: '#999',
    fontSize: 16,
    marginTop: 12,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  itemIcon: {
    backgroundColor: '#E3F2FD',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemNote: {
    fontSize: 13,
    color: '#666',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 4,
  },
  qtyActionButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  footer: {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "#fff",
  paddingHorizontal: 20,
  paddingTop: 20,
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  elevation: 25,
},
  checkoutButton: {
    backgroundColor: '#2196F3',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  readyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 13,
    marginTop: 12,
  },
});