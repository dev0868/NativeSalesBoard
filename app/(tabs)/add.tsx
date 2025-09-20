import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "@/components/Navbar";

export default function AddScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Navbar */}
      <Navbar 
        title="Add New Trip"
        subtitle="Create a new travel booking"
        showSearch={false}
        showNotifications={true}
        onNotificationPress={() => console.log('Notifications pressed')}
      />

      <ScrollView className="flex-1 px-4 pt-6">
        <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">Quick Actions</Text>
          
          <TouchableOpacity className="flex-row items-center bg-purple-50 rounded-xl p-4 mb-3">
            <View className="bg-purple-100 rounded-full p-3 mr-4">
              <Ionicons name="airplane" size={24} color="#7c3aed" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold">New Flight Booking</Text>
              <Text className="text-gray-500 text-sm">Book domestic or international flights</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center bg-blue-50 rounded-xl p-4 mb-3">
            <View className="bg-blue-100 rounded-full p-3 mr-4">
              <Ionicons name="bed" size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold">Hotel Reservation</Text>
              <Text className="text-gray-500 text-sm">Find and book accommodations</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center bg-green-50 rounded-xl p-4 mb-3">
            <View className="bg-green-100 rounded-full p-3 mr-4">
              <Ionicons name="car" size={24} color="#10b981" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold">Car Rental</Text>
              <Text className="text-gray-500 text-sm">Rent a car for your journey</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center bg-orange-50 rounded-xl p-4">
            <View className="bg-orange-100 rounded-full p-3 mr-4">
              <Ionicons name="map" size={24} color="#f59e0b" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold">Tour Package</Text>
              <Text className="text-gray-500 text-sm">Complete travel packages</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
