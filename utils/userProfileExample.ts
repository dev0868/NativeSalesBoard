import { 
  saveUserProfile, 
  getUserProfile,
  getSalesPersonInfo,
  UserProfile 
} from './userProfile';

// Example: How to save your complete user profile data
export const saveCompleteUserProfile = async (userData: UserProfile) => {
  try {
    // Save user profile
    const success = await saveUserProfile(userData);
    
    if (success) {
      console.log('User profile saved successfully');
      return true;
    } else {
      console.error('Failed to save user profile');
      return false;
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};

// Example: How to test with your actual data structure
export const testWithYourData = async () => {
  try {
    // Your actual data structure
    const yourUserData: UserProfile = {
      Preferences: {
        Language: "en",
        Notifications: {
          SMS: false,
          InApp: true,
          Email: true,
          WebPush: true
        },
        Theme: "light"
      },
      BankName: "adsa",
      Features_WebNotifications: false,
      BranchName: "adsasd", 
      Features_MaxQuotesPerMonth: 0,
      qrCode: null,
      IfscCode: "dadas",
      UpiId: "d",
      SubscriptionStart: "",
      Features_PaymentProofUpload: false,
      SubscriptionPlanId: "",
      Currency: "INR",
      CompanyGSTNumber: "sdasd",
      Features_AnalyticsDashboard: false,
      CompanyLogoUrl: null,
      InvoiceNumber: "asda",
      invoiceNumber: "34232",
      CreatedAt: "2025-10-03T11:16:10.023158",
      Features_QuoteCharge: 0,
      AccountNumber: "3232",
      Role: "Salesperson",
      SubscriptionType: "",
      FullName: "Devesh bisht",
      SubscriptionEnd: "",
      CompanyName: "journey ",
      Email: "Deveshbisht36@gmail.com",
      LoginDevices: {
        Web: {
          LoggedIn: false,
          DeviceInfo: null,
          LastLogin: null
        },
        Mobile: {
          LoggedIn: true,
          DeviceInfo: {
            version: "0.0.0",
            platform: "web"
          },
          LastLogin: "2025-10-03T11:16:08.953Z"
        }
      },
      CompanyId: "JOURNEDEVE6466",
      SubscriptionStatus: "InActive",
      Balance: 0,
      CompanyAddress: "dsadsa",
      Features_InAppNotifications: false,
      CompanyWebsite: "asdada",
      Phone: "05646446466"
    };

    // Save the profile
    const success = await saveCompleteUserProfile(yourUserData);
    
    if (success) {
      // Verify the setup
      const profile = await getUserProfile();
      const salesInfo = await getSalesPersonInfo();
      
      console.log('User Profile:', profile);
      console.log('Sales Person Info:', salesInfo);
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error testing with your data:', error);
    return false;
  }
};

// Call this function to test with your data structure
// testWithYourData();
