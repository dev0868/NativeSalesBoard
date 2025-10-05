import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import BasicDetails from './BasicDetails';
import CostCalculator from './CostCalculator';
import HotelsSection from './HotelsSection';
import InclusionsExclusions from './InclusionsExclusions';
import FlightSection from './FlightSection';
import ItinerarySection from './ItinerarySection';

interface QuotationFormData {
  TripId: string;
  FullName: string;
  Contact: string;
  Email: string;
  TravelDate: string;
  AssignDate: string;
  NoOfPax: string;
  Child: string;
  Infant: string;
  Budget: string;
  Departure: string;
  DestinationName: string;
  Days: number;
  Nights: number;
  PriceType: string;
  CurrencyType: string;
  FlightCost: string;
  VisaCost: string;
  LandPackageCost: string;
  TotalTax: string;
  TotalCost: string;
  GST: string;
  TCS: string;
  GstWaivedOffAmt: string;
  TcsWaivedOffAmt: string;
  GstamountWaivedoffOtp: string;
  PackageWithGST: boolean;
  PackageWithTCS: boolean;
  TcsamountWaivedoffOtp: string;
  TcsFlag: boolean;
  GstFlag: boolean;
  Hotels: HotelData[];
  Inclusions: string[];
  OtherInclusions: string;
  Exclusions: string[];
  OtherExclusions: string;
  Itinearies: ItineraryData[];
  flightsImagesLinks: string[];
  InclusionsImagesLinks: string[];
  travel_data: any;
  TravelEndDate: string;
}

interface HotelData {
  nights: string[];
  name: string;
  city: string;
  roomType: string;
  category: string;
  meals: string[];
  checkInDate: string;
  checkOutDate: string;
  comments: string;
}

interface ItineraryData {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation: string;
}

interface EnhancedQuotationFormProps {
  onClose: () => void;
  onSubmit: (data: QuotationFormData) => void;
  initialData?: Partial<QuotationFormData>;
  lead?: any;
}

const calculateTravelEndDate = (startDate: string, days: number): string => {
  if (!startDate || !days) return '';
  const start = new Date(startDate);
  const end = new Date(start.getTime() + (days - 1) * 24 * 60 * 60 * 1000);
  return end.toISOString().split('T')[0];
};

const EnhancedQuotationForm: React.FC<EnhancedQuotationFormProps> = ({
  onClose,
  onSubmit,
  initialData = {},
  lead
}) => {
  const methods = useForm<QuotationFormData>({
    defaultValues: {
      TripId: lead?.TripId || '',
      FullName: lead?.ClientLeadDetails?.FullName || '',
      Contact: lead?.ClientLeadDetails?.Contact || '',
      Email: lead?.ClientLeadDetails?.Email || '',
      TravelDate: lead?.ClientLeadDetails?.TravelDate || '',
      AssignDate: lead?.AssignDate || '',
      NoOfPax: lead?.ClientLeadDetails?.Pax || '',
      Child: lead?.ClientLeadDetails?.Child || '',
      Infant: lead?.ClientLeadDetails?.Infant || '0',
      Budget: lead?.ClientLeadDetails?.Budget || '',
      Departure: lead?.ClientLeadDetails?.DepartureCity || '',
      DestinationName: lead?.ClientLeadDetails?.DestinationName || '',
      Days: lead?.ClientLeadDetails?.Days === '' ? 2 : lead?.ClientLeadDetails?.Days,
      Nights: lead?.ClientLeadDetails?.Days === '' ? 1 : lead?.ClientLeadDetails?.Days - 1,
      PriceType: 'Total',
      CurrencyType: 'Ruppee',
      FlightCost: '',
      VisaCost: '',
      LandPackageCost: '',
      TotalTax: '',
      TotalCost: '',
      GST: '',
      TCS: '',
      GstWaivedOffAmt: '',
      TcsWaivedOffAmt: '',
      GstamountWaivedoffOtp: '',
      PackageWithGST: false,
      PackageWithTCS: false,
      TcsamountWaivedoffOtp: '',
      TcsFlag: true,
      GstFlag: true,
      Hotels: [{
        nights: [],
        name: '',
        city: '',
        roomType: '',
        category: '',
        meals: [],
        checkInDate: '',
        checkOutDate: '',
        comments: '',
      }],
      Inclusions: [],
      OtherInclusions: '',
      Exclusions: [],
      OtherExclusions: '',
      Itinearies: [],
      flightsImagesLinks: [],
      InclusionsImagesLinks: [],
      travel_data: null,
      TravelEndDate: calculateTravelEndDate(
        lead?.ClientLeadDetails?.TravelDate,
        lead?.ClientLeadDetails?.Days,
      ),
      ...initialData,
    },
  });

  const { handleSubmit } = methods;

  const onFormSubmit = (data: QuotationFormData) => {
    onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
          <Text className="text-xl font-bold text-gray-900">Create Quotation</Text>
          <TouchableOpacity
            onPress={onClose}
            className="bg-gray-100 rounded-full p-2"
          >
            <Ionicons name="close" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Form Content */}
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Basic Details Section */}
          <BasicDetails />

          {/* Cost Calculator Section */}
          <CostCalculator />

          {/* Hotels Section */}
          <HotelsSection />

          {/* Inclusions & Exclusions Section */}
          <InclusionsExclusions />

          {/* Flight Section */}
          <FlightSection />

          {/* Itinerary Section */}
          <ItinerarySection />
        </ScrollView>

        {/* Footer Buttons */}
        <View className="p-4 border-t border-gray-200 bg-white">
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-gray-100 rounded-lg py-3 mr-2"
            >
              <Text className="text-gray-700 font-medium text-center">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleSubmit(onFormSubmit)}
              className="flex-1 bg-purple-600 rounded-lg py-3 ml-2"
            >
              <Text className="text-white font-medium text-center">
                Create Quotation
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </FormProvider>
  );
};

export default EnhancedQuotationForm;
