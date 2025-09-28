import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateAccount = () => {
  const handleGetStarted = async () => {
    try {
      // Set createAccount to true in AsyncStorage
      await AsyncStorage.setItem("createAccount", "true");
      // Navigate to tabs
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error setting auth status:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-gray-900">logo</Text>
        <View className="px-4 py-2 rounded-full bg-purple-100">
          <Text className="text-purple-700 font-medium">Create Account</Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-5">
        <Text className="text-3xl font-extrabold text-gray-900 mt-2">Get Started Today</Text>
        <Text className="text-gray-500 mt-2">Join thousands of users already using our platform</Text>

        {/* Hero Card */}
        <View className="mt-6 rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <View className="h-48 rounded-xl items-center justify-center" style={{ backgroundColor: "#DCEAF7" }}>
            <View className="w-24 h-44 bg-white rounded-3xl items-center justify-center shadow" />
          </View>
          <Text className="mt-4 text-center text-gray-800 font-medium">Welcome to Our Platform</Text>
        </View>

        {/* Dots */}
        <View className="flex-row items-center justify-center gap-2 mt-6">
          <View className="w-8 h-2 rounded-full bg-purple-500" />
          <View className="w-2 h-2 rounded-full bg-gray-300" />
          <View className="w-2 h-2 rounded-full bg-gray-300" />
        </View>
      </View>

      {/* CTA Fixed Bottom */}
      <View className="px-5 pb-6">
        <Pressable onPress={handleGetStarted} className="overflow-hidden rounded-full">
          <LinearGradient colors={["#9b5cff", "#4f46e5"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingVertical: 16, borderRadius: 9999 }}>
            <Text className="text-center text-white font-semibold text-base">Get Started Now</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default CreateAccount;