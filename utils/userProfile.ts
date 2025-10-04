import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  FullName: string;
  Email: string;
  Phone: string;
  Role: string;
  CompanyId: string;
  CompanyName: string;
  CompanyAddress: string;
  CompanyWebsite: string;
  CompanyGSTNumber: string;
  CompanyLogoUrl: string | null;
  Currency: string;
  Balance: number;
  BankName: string;
  AccountNumber: string;
  IfscCode: string;
  BranchName: string;
  UpiId: string;
  SubscriptionStatus: string;
  SubscriptionType: string;
  SubscriptionPlanId: string;
  SubscriptionStart: string;
  SubscriptionEnd: string;
  CreatedAt: string;
  LoginDevices: {
    Web: {
      LoggedIn: boolean;
      DeviceInfo: any;
      LastLogin: string | null;
    };
    Mobile: {
      LoggedIn: boolean;
      DeviceInfo: any;
      LastLogin: string;
    };
  };
  Preferences: {
    Language: string;
    Theme: string;
    Notifications: {
      SMS: boolean;
      InApp: boolean;
      Email: boolean;
      WebPush: boolean;
    };
  };
  Features_WebNotifications: boolean;
  Features_MaxQuotesPerMonth: number;
  Features_PaymentProofUpload: boolean;
  Features_AnalyticsDashboard: boolean;
  Features_QuoteCharge: number;
  Features_InAppNotifications: boolean;
  qrCode: string | null;
  invoiceNumber: string;
  InvoiceNumber: string;
}


export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const profileData = await AsyncStorage.getItem("userProfile");
    if (profileData) {
      const parsedData = JSON.parse(profileData);
      // Handle array structure - take the first item if it's an array
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        return parsedData[0];
      }
      // Handle direct object structure
      return parsedData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Save user profile to AsyncStorage
export const saveUserProfile = async (profile: UserProfile): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};

// Get sales person info for lead creation
export const getSalesPersonInfo = async () => {
  const profile = await getUserProfile();
  console.log(profile)
  return {
    salesPersonUid: profile?.Email || "user@journeyrouters.com",
    salesPersonName: profile?.FullName || "Sales Person",
    salesPersonEmail: profile?.Email || "user@journeyrouters.com",
    companyId: profile?.CompanyId || "JR1",
    companyName: profile?.CompanyName || "Journey Routers Pvt Ltd",
    // Additional fields from your data structure
    FullName: profile?.FullName || "Sales Person",
    Email: profile?.Email || "user@journeyrouters.com",
    Phone: profile?.Phone || "",
    Role: profile?.Role || "Sales",
    CompanyAddress: profile?.CompanyAddress || "",
    CompanyWebsite: profile?.CompanyWebsite || "",
    Currency: profile?.Currency || "INR"
  };
};

// Clear user profile (for logout)
export const clearUserProfile = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing user profile:', error);
    return false;
  }
};

// Update specific profile fields
export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
  try {
    const currentProfile = await getUserProfile();
    if (currentProfile) {
      const updatedProfile = { ...currentProfile, ...updates };
      return await saveUserProfile(updatedProfile);
    }
    return false;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

// Check if user is logged in
export const isUserLoggedIn = async (): Promise<boolean> => {
  const profile = await getUserProfile();
  return profile !== null && profile.Email !== undefined;
};

// Get user's storage key (you might need to update this to match your actual key)
export const getUserStorageKey = (): string => {
  return USER_PROFILE_KEY;
};
