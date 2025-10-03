import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const userProfile = await AsyncStorage.getItem("userProfile");
        // If userProfile exists (not null/undefined), navigate to home
        if (userProfile !== null && userProfile !== undefined) {
          router.replace("/(tabs)");
        } else {
          // No userProfile found, go to auth (create account)
          router.replace("/(auth)");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        router.replace("/(auth)");
      }
    };

    checkAuthAndRedirect();
  }, []);

  return null; // This component just handles redirection
}
