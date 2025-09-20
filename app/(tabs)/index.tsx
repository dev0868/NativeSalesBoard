import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "@/components/Navbar";

export default function HomeScreen() {
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
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        {/* Trip Card 1 */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <View className="bg-purple-100 rounded-full p-2">
              <Ionicons name="airplane" size={20} color="#7c3aed" />
            </View>
            <Text className="text-gray-500 text-sm">Trip #24273087</Text>
          </View>
          
          <Text className="text-gray-600 text-sm mb-1">Contact</Text>
          <Text className="text-gray-900 font-semibold mb-3">9876543210</Text>
          
          <View className="flex-row justify-between mb-3">
            <View>
              <Text className="text-gray-500 text-xs">Destination</Text>
              <Text className="text-gray-900 font-medium">Thailand</Text>
            </View>
            <View>
              <Text className="text-gray-500 text-xs">Departure</Text>
              <Text className="text-gray-900 font-medium">Mumbai</Text>
            </View>
          </View>
          
          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-gray-500 text-xs">Pax</Text>
              <Text className="text-gray-900 font-medium">2</Text>
            </View>
            <View>
              <Text className="text-gray-500 text-xs">Child</Text>
              <Text className="text-gray-900 font-medium">1</Text>
            </View>
          </View>
          
          <Text className="text-gray-600 text-sm mb-1">Budget</Text>
          <Text className="text-purple-600 text-2xl font-bold mb-4">₹85,000</Text>
          
          <View className="flex-row justify-between">
            <TouchableOpacity className="bg-purple-100 rounded-lg px-4 py-2 flex-1 mr-2">
              <Text className="text-purple-600 font-medium text-center">Last 10 Quotes</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-green-500 rounded-lg px-4 py-2 flex-1 ml-2">
              <Text className="text-white font-medium text-center">Follow Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trip Card 2 */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <View className="bg-purple-100 rounded-full p-2">
              <Ionicons name="airplane" size={20} color="#7c3aed" />
            </View>
            <Text className="text-gray-500 text-sm">Trip #24273098</Text>
          </View>
          
          <Text className="text-gray-600 text-sm mb-1">Contact</Text>
          <Text className="text-gray-900 font-semibold mb-3">9123456789</Text>
          
          <View className="flex-row justify-between mb-3">
            <View>
              <Text className="text-gray-500 text-xs">Destination</Text>
              <Text className="text-gray-900 font-medium">Dubai</Text>
            </View>
            <View>
              <Text className="text-gray-500 text-xs">Departure</Text>
              <Text className="text-gray-900 font-medium">Delhi</Text>
            </View>
          </View>
          
          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-gray-500 text-xs">Pax</Text>
              <Text className="text-gray-900 font-medium">4</Text>
            </View>
            <View>
              <Text className="text-gray-500 text-xs">Child</Text>
              <Text className="text-gray-900 font-medium">0</Text>
            </View>
          </View>
          
          <View className="flex-row justify-between">
            <TouchableOpacity className="bg-purple-100 rounded-lg px-4 py-2 flex-1 mr-2">
              <Text className="text-purple-600 font-medium text-center">Last 10 Quotes</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-green-500 rounded-lg px-4 py-2 flex-1 ml-2">
              <Text className="text-white font-medium text-center">Follow Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
