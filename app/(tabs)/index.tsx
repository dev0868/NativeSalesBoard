import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import Navbar from "@/components/Navbar";
import QuotationCards from "@/components/ui/cards/QuotationCards";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated } from "react-native";

export default function HomeScreen() {
  const data = Array.from({ length: 10 }, (_, i) => ({ id: i.toString() }));
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Navbar */}
      <Navbar 
        title="Journey Readdy"
        subtitle="Explore beautiful destinations"
        showSearch={true}
        showNotifications={true}
        onNotificationPress={() => console.log('Notifications pressed')}
      />

      {/* Trip Cards */}
      <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={() => <QuotationCards />}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24 }}
      showsVerticalScrollIndicator={false}
      
    />
        
    </View>
  );
}
