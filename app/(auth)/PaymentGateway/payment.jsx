import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RazorpayCheckout from 'react-native-razorpay';

const PaymentPage = () => {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    loadUserDetails();
  }, []);

  const loadUserDetails = async () => {
    try {
      const savedData = await AsyncStorage.getItem('createAccountFormData');
      if (savedData) {
        setUserDetails(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      const options = {
        description: 'Journey Routers - Account Setup',
        image: 'https://i.imgur.com/3g7nmJC.png', // Your logo URL
        currency: 'INR',
        key: 'rzp_test_1DP5mmOlF5G5ag', // Replace with your Razorpay key
        amount: '99900', // ₹999 in paise (999 * 100)
        name: 'Journey Routers',
        order_id: '', // Replace with order_id created from your server
        prefill: {
          email: userDetails?.email || '',
          contact: userDetails?.phone || '',
          name: `${userDetails?.firstName || ''} ${userDetails?.lastName || ''}`.trim(),
        },
        theme: { color: '#7c3aed' },
      };

      const data = await RazorpayCheckout.open(options);
      
      // Payment successful
      console.log('Payment Success:', data);
      await handlePaymentSuccess(data);
      
    } catch (error) {
      console.log('Payment Error:', error);
      
      if (error.code === RazorpayCheckout.PAYMENT_CANCELLED) {
        Alert.alert('Payment Cancelled', 'You cancelled the payment. Please try again to complete your setup.');
      } else {
        Alert.alert('Payment Failed', 'There was an error processing your payment. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      // Set account as created in AsyncStorage
      await AsyncStorage.setItem('createAccount', 'true');
      
      // Save payment details
      await AsyncStorage.setItem('paymentDetails', JSON.stringify({
        paymentId: paymentData.razorpay_payment_id,
        orderId: paymentData.razorpay_order_id,
        signature: paymentData.razorpay_signature,
        timestamp: new Date().toISOString(),
      }));

      // Clear form data as it's no longer needed
      await AsyncStorage.removeItem('createAccountFormData');
      await AsyncStorage.removeItem('createAccountCurrentStep');

      Alert.alert(
        'Payment Successful! 🎉',
        'Your account has been set up successfully. Welcome to Journey Routers!',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      console.error('Error handling payment success:', error);
      Alert.alert('Error', 'Payment was successful but there was an error setting up your account. Please contact support.');
    }
  };

  const handleSkipPayment = async () => {
    Alert.alert(
      'Skip Payment?',
      'You can skip the payment for now and complete it later from your profile settings.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Skip for Now',
          onPress: async () => {
            try {
              await AsyncStorage.setItem('createAccount', 'true');
              await AsyncStorage.removeItem('createAccountFormData');
              await AsyncStorage.removeItem('createAccountCurrentStep');
              router.replace('/(tabs)');
            } catch (error) {
              console.error('Error skipping payment:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 py-4" style={{ paddingTop: insets.top + 16 }}>
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </Pressable>
          <Text className="text-xl font-semibold text-gray-900">Complete Setup</Text>
          <View className="w-6" />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 py-8">
        {/* Success Icon */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="checkmark-circle" size={48} color="#10b981" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 text-center">Almost Done!</Text>
          <Text className="text-gray-600 text-center mt-2">
            Complete your account setup with our premium plan
          </Text>
        </View>

        {/* Pricing Card */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <LinearGradient
            colors={['#7c3aed', '#5b21b6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-xl p-6 mb-4"
          >
            <View className="items-center">
              <Text className="text-white text-lg font-medium">Premium Plan</Text>
              <View className="flex-row items-baseline mt-2">
                <Text className="text-white text-4xl font-bold">₹999</Text>
                <Text className="text-white/80 text-lg ml-1">/month</Text>
              </View>
            </View>
          </LinearGradient>

          <View className="space-y-3">
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text className="text-gray-700 ml-3">Unlimited quotations</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text className="text-gray-700 ml-3">Advanced analytics</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text className="text-gray-700 ml-3">Priority support</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text className="text-gray-700 ml-3">Custom branding</Text>
            </View>
          </View>
        </View>

        {/* User Details */}
        {userDetails && (
          <View className="bg-white rounded-xl p-4 mb-6">
            <Text className="text-gray-700 font-medium mb-2">Account Details:</Text>
            <Text className="text-gray-600">
              {userDetails.firstName} {userDetails.lastName}
            </Text>
            <Text className="text-gray-600">{userDetails.email}</Text>
            <Text className="text-gray-600">{userDetails.phone}</Text>
          </View>
        )}
      </View>

      {/* Payment Buttons */}
      <View className="px-6 py-4 space-y-3">
        <Pressable 
          onPress={handlePayment}
          disabled={isLoading}
          className="overflow-hidden rounded-full"
        >
          <LinearGradient 
            colors={["#7c3aed", "#5b21b6"]} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }} 
            style={{ paddingVertical: 16, borderRadius: 9999 }}
          >
            <View className="flex-row items-center justify-center">
              {isLoading && <ActivityIndicator size="small" color="white" className="mr-2" />}
              <Text className="text-center text-white font-semibold text-base">
                {isLoading ? 'Processing...' : 'Pay ₹999 & Complete Setup'}
              </Text>
            </View>
          </LinearGradient>
        </Pressable>

        <Pressable 
          onPress={handleSkipPayment}
          className="bg-gray-200 rounded-full py-4"
        >
          <Text className="text-center text-gray-700 font-semibold">Skip for Now</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PaymentPage;
