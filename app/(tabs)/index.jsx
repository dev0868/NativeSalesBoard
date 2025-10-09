import React, { useRef, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Animated } from "react-native";
import Navbar from "@/components/Navbar";
import QuotationCards from "@/components/ui/cards/QuotationCards";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

const AnimatedFlatList = Animated.FlatList;

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeads = useCallback(async (mode = "initial", signal) => {
    if (mode === "initial") setLoading(true);
    else setRefreshing(true);

    try {
      setError(null);

      const salesPersonUid = encodeURIComponent("Devesh bisht");
      const url = `https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote?SalesPersonUid=${salesPersonUid}`;

      const res = await axios.get(url, { timeout: 20000, signal });

      const raw = res?.data;
      const data = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.leads)
        ? raw.leads
        : Array.isArray(raw?.data)
        ? raw.data
        : [];

      setLeads(data ?? []);
    } catch (e) {
      if (axios.isCancel?.(e) || e?.name === "CanceledError" || e?.message === "canceled") {
        // request was canceled — ignore
      } else {
        console.error("Error fetching leads:", e);
        setError(e?.message || "Failed to fetch leads");
        setLeads([]);
      }
    } finally {
      if (mode === "initial") setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refetch every time the screen gains focus. Cancel on blur.
  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      fetchLeads("initial", controller.signal);
      return () => controller.abort();
    }, [fetchLeads])
  );

  const onRefresh = useCallback(() => fetchLeads("refresh"), [fetchLeads]);

  const onScroll = useRef(
    Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: true }
    )
  ).current;

  const renderItem = useCallback(({ item }) => {
    return <QuotationCards leadData={item} />;
  }, []);

  const keyExtractor = useCallback((item, index) => {
    return String(item?.id ?? item?._id ?? index);
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar
        title="Journey Readdy"
        subtitle="Explore beautiful destinations"
        showSearch
        showNotifications
        onNotificationPress={() => console.log("Notifications pressed")}
      />

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text style={{ marginTop: 16, fontSize: 16, color: "#6b7280" }}>Loading leads...</Text>
        </View>
      ) : error ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }}>
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          <Text style={{ marginTop: 16, fontSize: 18, fontWeight: "600", color: "#1f2937", textAlign: "center" }}>
            Error Loading Leads
          </Text>
          <Text style={{ marginTop: 8, fontSize: 14, color: "#6b7280", textAlign: "center" }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => fetchLeads("initial")}
            style={{ marginTop: 24, backgroundColor: "#7c3aed", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : leads.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }}>
          <Ionicons name="document-outline" size={64} color="#9ca3af" />
          <Text style={{ marginTop: 16, fontSize: 18, fontWeight: "600", color: "#1f2937", textAlign: "center" }}>
            No Leads Found
          </Text>
          <Text style={{ marginTop: 8, fontSize: 14, color: "#6b7280", textAlign: "center" }}>
            You haven't created any leads yet. Create your first lead to get started.
          </Text>
          <TouchableOpacity
            onPress={onRefresh}
            style={{ marginTop: 24, backgroundColor: "#7c3aed", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <AnimatedFlatList
          data={leads}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onScroll={onScroll}
          scrollEventThrottle={16}
          removeClippedSubviews
          initialNumToRender={10}
          windowSize={10}
        />
      )}
    </View>
  );
}
