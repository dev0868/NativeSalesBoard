import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "@/components/Navbar";

export default function BookingsScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Navbar */}
      <Navbar 
        title="My Bookings"
        subtitle="Track your travel bookings"
        showSearch={false}
        showNotifications={true}
        onNotificationPress={() => console.log('Notifications pressed')}
      />

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Booking Card */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <View className="bg-green-100 rounded-full p-2">
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            </View>
            <Text className="text-green-600 text-sm font-medium">Confirmed</Text>
          </View>
          
          <Text className="text-gray-900 font-bold text-lg mb-2">Mumbai → Dubai</Text>
          <Text className="text-gray-600 text-sm mb-3">Flight • AI 131</Text>
          
          <View className="flex-row justify-between mb-3">
            <View>
              <Text className="text-gray-500 text-xs">Departure</Text>
              <Text className="text-gray-900 font-medium">Dec 25, 2024</Text>
              <Text className="text-gray-600 text-sm">10:30 AM</Text>
            </View>
            <View>
              <Text className="text-gray-500 text-xs">Return</Text>
              <Text className="text-gray-900 font-medium">Jan 2, 2025</Text>
              <Text className="text-gray-600 text-sm">8:45 PM</Text>
            </View>
          </View>
          
          <View className="border-t border-gray-200 pt-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Passengers: 2 Adults</Text>
              <Text className="text-purple-600 font-bold">₹45,000</Text>
            </View>
          </View>
        </View>

        {/* Another Booking Card */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <View className="bg-orange-100 rounded-full p-2">
              <Ionicons name="time" size={20} color="#f59e0b" />
            </View>
            <Text className="text-orange-600 text-sm font-medium">Pending</Text>
          </View>
          
          <Text className="text-gray-900 font-bold text-lg mb-2">Delhi → Thailand</Text>
          <Text className="text-gray-600 text-sm mb-3">Package Tour</Text>
          
          <View className="flex-row justify-between mb-3">
            <View>
              <Text className="text-gray-500 text-xs">Duration</Text>
              <Text className="text-gray-900 font-medium">7 Days, 6 Nights</Text>
            </View>
            <View>
              <Text className="text-gray-500 text-xs">Travel Date</Text>
              <Text className="text-gray-900 font-medium">Jan 15, 2025</Text>
            </View>
          </View>
          
          <View className="border-t border-gray-200 pt-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Passengers: 4 Adults</Text>
              <Text className="text-purple-600 font-bold">₹1,20,000</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Plus Button */}
      <TouchableOpacity className="absolute bottom-20 right-4 bg-purple-600 rounded-full p-4 shadow-lg">
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
