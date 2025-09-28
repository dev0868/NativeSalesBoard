import { View, Text, Pressable, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {  useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useRef } from "react";

const OnBoardingPage = () => {
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get('window');
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  
  // Carousel data
  const carouselImages = [
    { id: 1, title: "Welcome to Our Platform", bgColor: "#DCEAF7" },
    { id: 2, title: "Manage Your Sales", bgColor: "#E8F5E8" },
    { id: 3, title: "Track Your Progress", bgColor: "#FFF2E8" },
    { id: 4, title: "Connect with Clients", bgColor: "#F3E8FF" },
    { id: 5, title: "Grow Your Business", bgColor: "#FFE8F0" }
  ];

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

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
    <View className="flex-1 bg-gray-50">
      <LinearGradient
        colors={['#7c3aed', '#5b21b6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-b-3xl px-5 pb-6"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-semibold text-white">Journey Routers</Text>
          <Pressable onPress={()=>router.replace("/(auth)/createAccount")} className="px-4 py-2 rounded-full bg-white/20">
            <Text className="text-white font-medium">Create Account</Text>
          </Pressable>
        </View>
      </LinearGradient>

      {/* Full Height Carousel */}
      <View className="flex-1">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          className="flex-1"
        >
          {carouselImages.map((item, index) => (
            <View key={item.id} style={{ width }} className="flex-1 px-5 justify-center max-h-[44rem]">
              <Text className="text-3xl font-extrabold text-gray-900 mt-6 text-center">Get Started Today</Text>
              <Text className="text-gray-500 mt-2 text-center">Join thousands of users already using our platform</Text>

              {/* Hero Card */}
              <View className="mt-4 rounded-2xl bg-white p-5 shadow-sm border border-gray-100 flex-1 ">
                <View className="flex-1 rounded-xl items-center justify-center" style={{ backgroundColor: item.bgColor }}>
                  <View className="w-24 h-44 bg-white rounded-3xl items-center justify-center shadow" />
                </View>
                <Text className="mt-4 text-center text-gray-800 font-medium">{item.title}</Text>
              </View>

            </View>
          ))}
        </ScrollView>

        {/* Carousel Dots */}
        <View className="flex-row items-center justify-center gap-2 pb-4">
          {carouselImages.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full ${
                index === currentIndex ? 'w-8 bg-purple-500' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </View>

        {/* Fixed Get Started Button */}
        {/* <View className="px-5 pb-6">
          <Pressable onPress={handleGetStarted} className="overflow-hidden rounded-full">
            <LinearGradient colors={["#9b5cff", "#4f46e5"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingVertical: 16, borderRadius: 9999 }}>
              <Text className="text-center text-white font-semibold text-base">Get Started Now</Text>
            </LinearGradient>
          </Pressable>
        </View> */}
      </View>
    </View>
  );
};

export default OnBoardingPage;