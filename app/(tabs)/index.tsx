import { View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import Navbar from "@/components/Navbar";
import QuotationCards from "@/components/ui/cards/QuotationCards";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState, useEffect } from "react";
import { Animated } from "react-native";
import { getSalesPersonInfo } from "@/utils/userProfile";

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // State management
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch leads from API
  const fetchLeads = async () => {
    try {
      setError(null);
      
      // Get sales person info from AsyncStorage
      const salesPersonInfo = await getSalesPersonInfo();
      const salesPersonUid = encodeURIComponent(salesPersonInfo.FullName || "Devesh bisht");
      
      console.log("Fetching leads for:", salesPersonUid);
      
      // Make API call
      const response = await fetch(
        `https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote?SalesPersonUid=${salesPersonUid}`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);
        
        // Handle different response formats
        if (Array.isArray(data)) {
          setLeads(data);
        } else if (data.leads && Array.isArray(data.leads)) {
          setLeads(data.leads);
        } else if (data.data && Array.isArray(data.data)) {
          setLeads(data.data);
        } else {
          setLeads([]);
        }
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Error fetching leads:", error);
      setError(error.message || "Failed to fetch leads");
      setLeads([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchLeads();
  };

  // Load data on component mount
  useEffect(() => {
    fetchLeads();
  }, []);

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

      {/* Content */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text style={{ marginTop: 16, fontSize: 16, color: '#6b7280' }}>
            Loading leads...
          </Text>
        </View>
      ) : error ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          <Text style={{ marginTop: 16, fontSize: 18, fontWeight: '600', color: '#1f2937', textAlign: 'center' }}>
            Error Loading Leads
          </Text>
          <Text style={{ marginTop: 8, fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={fetchLeads}
            style={{
              marginTop: 24,
              backgroundColor: '#7c3aed',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : leads.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
          <Ionicons name="document-outline" size={64} color="#9ca3af" />
          <Text style={{ marginTop: 16, fontSize: 18, fontWeight: '600', color: '#1f2937', textAlign: 'center' }}>
            No Leads Found
          </Text>
          <Text style={{ marginTop: 8, fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
            You haven't created any leads yet. Create your first lead to get started.
          </Text>
          <TouchableOpacity
            onPress={onRefresh}
            style={{
              marginTop: 24,
              backgroundColor: '#7c3aed',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={leads}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item }) => <QuotationCards leadData={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        />
      )}
        
    </View>
  );
}
