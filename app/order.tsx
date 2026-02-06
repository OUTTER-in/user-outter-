import { API_CONFIG } from './deliveryConfig';

// When user submits order
const submitOrder = async () => {
  try {
    const response = await fetch(`${API_CONFIG.API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        items: cartItems,
        deliveryAddress: selectedAddress,
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Order saved to database!
      Alert.alert('Success', 'Order placed!');
      navigation.navigate('OrderTracking', { orderId: data.orderId });
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to place order');
  }
};