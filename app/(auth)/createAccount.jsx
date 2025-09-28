import { View, Text, TextInput, Pressable, ScrollView, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';

const CreateAccountPage = () => {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Step 2: Organization Info
    companyName: '',
    gstNumber: '',
    invoiceNumber: '',
    logo: null, // Will store base64 string
    
    // Step 3: Payment Info
    bankName: '',
    branchName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    qrCode: null // Will store base64 string
  });

  // Load saved form data and step on component mount
  useEffect(() => {
    loadSavedData();
  }, []);

  // Save form data whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveFormData();
    }
  }, [formData, currentStep, isLoading]);

  const loadSavedData = async () => {
    try {
      const savedFormData = await AsyncStorage.getItem('createAccountFormData');
      const savedStep = await AsyncStorage.getItem('createAccountCurrentStep');
      
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
      }
      
      if (savedStep) {
        setCurrentStep(parseInt(savedStep));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFormData = async () => {
    try {
      await AsyncStorage.setItem('createAccountFormData', JSON.stringify(formData));
      await AsyncStorage.setItem('createAccountCurrentStep', currentStep.toString());
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const clearSavedData = async () => {
    try {
      await AsyncStorage.removeItem('createAccountFormData');
      await AsyncStorage.removeItem('createAccountCurrentStep');
    } catch (error) {
      console.error('Error clearing saved data:', error);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Request permissions for image picker
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload images.');
      return false;
    }
    return true;
  };

  // Convert image to base64
  const convertToBase64 = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error converting to base64:', error);
      throw error;
    }
  };

  // Handle logo upload
  const handleLogoUpload = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Check file size (5MB limit) using legacy API
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        if (fileInfo.size > 5 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select an image smaller than 5MB.');
          return;
        }

        const base64 = await convertToBase64(asset.uri);
        updateFormData('logo', `data:image/jpeg;base64,${base64}`);
        Alert.alert('Success', 'Logo uploaded successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload logo. Please try again.');
      console.error('Logo upload error:', error);
    }
  };
  

  // Handle QR code upload
  const handleQRUpload = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Check file size (2MB limit for QR codes) using legacy API
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        if (fileInfo.size > 2 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select an image smaller than 2MB.');
          return;
        }

        const base64 = await convertToBase64(asset.uri);
        updateFormData('qrCode', `data:image/jpeg;base64,${base64}`);
        Alert.alert('Success', 'QR code uploaded successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload QR code. Please try again.');
      console.error('QR upload error:', error);
    }
  };
  
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 2:
        return formData.companyName;
      case 3:
        return formData.bankName && formData.accountNumber;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      Alert.alert('Missing Information', 'Please fill in all required fields before continuing.');
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Save the final form data
      await AsyncStorage.setItem('createAccountFormData', JSON.stringify(formData));
      
      // Navigate to payment page
      router.push('/(auth)/PaymentGateway/payment');
    } catch (error) {
      Alert.alert('Error', 'Failed to proceed to payment. Please try again.');
      console.error('Submit error:', error);
    }
  };

  const renderProgressBar = () => (
    <View className="bg-purple-100 h-2">
      <View 
        className="bg-purple-500 h-full transition-all duration-300"
        style={{ width: `${(currentStep / 3) * 100}%` }}
      />
    </View>
  );

  const renderStepTitle = () => {
    const titles = {
      1: { title: 'Personal Info', subtitle: 'Tell us about yourself' },
      2: { title: 'Organization Info', subtitle: 'Your company details' },
      3: { title: 'Payment Info', subtitle: 'Banking & payment setup' }
    };
    
    return (
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900">{titles[currentStep].title}</Text>
        <Text className="text-gray-600 mt-1">{titles[currentStep].subtitle}</Text>
      </View>
    );
  };

  const renderStep1 = () => (
    <View className="px-6 space-y-4">
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <View className="items-center mb-6">
          <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="person" size={32} color="#7c3aed" />
          </View>
          <Text className="text-xl font-semibold text-gray-900">Welcome!</Text>
          <Text className="text-gray-600 text-center mt-1">Let's get to know you better</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 font-medium mb-2">First Name *</Text>
            <TextInput
              value={formData.firstName}
              onChangeText={(value) => updateFormData('firstName', value)}
              placeholder="Enter your first name"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Last Name *</Text>
            <TextInput
              value={formData.lastName}
              onChangeText={(value) => updateFormData('lastName', value)}
              placeholder="Enter your last name"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Email Address *</Text>
            <TextInput
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Phone Number *</Text>
            <TextInput
              value={formData.phone}
              onChangeText={(value) => updateFormData('phone', value)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View className="px-6 space-y-4">
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <View className="items-center mb-6">
          <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="business" size={32} color="#7c3aed" />
          </View>
          <Text className="text-xl font-semibold text-gray-900">Organization Details</Text>
          <Text className="text-gray-600 text-center mt-1">Tell us about your business</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 font-medium mb-2">Company Name *</Text>
            <TextInput
              value={formData.companyName}
              onChangeText={(value) => updateFormData('companyName', value)}
              placeholder="Enter company name"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Upload Logo</Text>
            <Pressable 
              onPress={handleLogoUpload}
              className="bg-gray-50 rounded-xl px-4 py-6 border-2 border-dashed border-gray-300 items-center"
            >
              {formData.logo ? (
                <View className="items-center">
                  <Image 
                    source={{ uri: formData.logo }} 
                    className="w-16 h-16 rounded-lg mb-2"
                    resizeMode="cover"
                  />
                  <Text className="text-green-600 font-medium">Logo uploaded!</Text>
                  <Text className="text-gray-400 text-sm">Tap to change</Text>
                </View>
              ) : (
                <View className="items-center">
                  <Ionicons name="cloud-upload" size={32} color="#9ca3af" />
                  <Text className="text-gray-600 mt-2">Tap to upload company logo</Text>
                  <Text className="text-gray-400 text-sm">PNG, JPG up to 5MB</Text>
                </View>
              )}
            </Pressable>
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">GST Number</Text>
            <TextInput
              value={formData.gstNumber}
              onChangeText={(value) => updateFormData('gstNumber', value)}
              placeholder="Enter GST number"
              autoCapitalize="characters"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Invoice Number Format</Text>
            <TextInput
              value={formData.invoiceNumber}
              onChangeText={(value) => updateFormData('invoiceNumber', value)}
              placeholder="e.g., INV-2024-001"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="px-6 space-y-4">
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <View className="items-center mb-6">
          <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="card" size={32} color="#7c3aed" />
          </View>
          <Text className="text-xl font-semibold text-gray-900">Payment Setup</Text>
          <Text className="text-gray-600 text-center mt-1">Configure your payment methods</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 font-medium mb-2">Bank Name *</Text>
            <TextInput
              value={formData.bankName}
              onChangeText={(value) => updateFormData('bankName', value)}
              placeholder="Enter bank name"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Branch Name *</Text>
            <TextInput
              value={formData.branchName}
              onChangeText={(value) => updateFormData('branchName', value)}
              placeholder="Enter branch name"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Account Number *</Text>
            <TextInput
              value={formData.accountNumber}
              onChangeText={(value) => updateFormData('accountNumber', value)}
              placeholder="Enter account number"
              keyboardType="numeric"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">IFSC Code *</Text>
            <TextInput
              value={formData.ifscCode}
              onChangeText={(value) => updateFormData('ifscCode', value)}
              placeholder="Enter IFSC code"
              autoCapitalize="characters"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">UPI ID</Text>
            <TextInput
              value={formData.upiId}
              onChangeText={(value) => updateFormData('upiId', value)}
              placeholder="yourname@paytm"
              autoCapitalize="none"
              className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">QR Code Scanner</Text>
            <Pressable 
              onPress={handleQRUpload}
              className="bg-gray-50 rounded-xl px-4 py-6 border-2 border-dashed border-gray-300 items-center"
            >
              {formData.qrCode ? (
                <View className="items-center">
                  <Image 
                    source={{ uri: formData.qrCode }} 
                    className="w-20 h-20 rounded-lg mb-2"
                    resizeMode="cover"
                  />
                  <Text className="text-green-600 font-medium">QR code uploaded!</Text>
                  <Text className="text-gray-400 text-sm">Tap to change</Text>
                </View>
              ) : (
                <View className="items-center">
                  <Ionicons name="qr-code" size={32} color="#9ca3af" />
                  <Text className="text-gray-600 mt-2">Upload QR code for payments</Text>
                  <Text className="text-gray-400 text-sm">PNG, JPG up to 2MB</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );

  const renderButtons = () => (
    <View className="px-6 py-4 flex-row gap-4">
      {currentStep > 1 && (
        <Pressable
          onPress={prevStep}
          className="flex-1 bg-gray-200 rounded-full py-4 items-center"
        >
          <Text className="text-gray-700 font-semibold">Previous</Text>
        </Pressable>
      )}
      
      <Pressable
        onPress={currentStep === 3 ? handleSubmit : nextStep}
        className="flex-1 overflow-hidden rounded-full"
      >
        <LinearGradient
          colors={['#7c3aed', '#5b21b6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingVertical: 16 }}
        >
          <Text className="text-center text-white font-semibold text-base">
            {currentStep === 3 ? 'Complete Setup' : 'Continue'}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );

  // Show loading state while data is being loaded
  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <View className="items-center">
          <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="hourglass" size={24} color="#7c3aed" />
          </View>
          <Text className="text-gray-600">Loading your progress...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 py-4" style={{ paddingTop: insets.top + 16 }}>
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)')}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </Pressable>
          <Text className="text-xl font-semibold text-gray-900">Create Account</Text>
          <View className="w-6" />
        </View>
      </View>

      {/* Progress Bar */}
      {renderProgressBar()}

      {/* Content with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {renderStepTitle()}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </ScrollView>

        {/* Navigation Buttons */}
        {renderButtons()}
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateAccountPage;