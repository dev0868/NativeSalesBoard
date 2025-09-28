import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const authStatus = await AsyncStorage.getItem("createAccount");
        if (authStatus === "true") {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        router.replace("/(auth)");
      }
    };

    checkAuthAndRedirect();
  }, []);

  return null; // This component just handles redirection
}
