// Export all form components
export { default as EnhancedQuotationForm } from './EnhancedQuotationForm';
export { default as IntegratedQuotationForm } from './IntegratedQuotationForm';
export { default as BasicDetails } from './BasicDetails';
export { default as CostCalculator } from './CostCalculator';
export { default as HotelsSection } from './HotelsSection';
export { default as InclusionsExclusions } from './InclusionsExclusions';
export { default as FlightSection } from './FlightSection';
export { default as ItinerarySection } from './ItinerarySection';
export { default as QuotationFormExample } from './QuotationFormExample';
export { default as QuoatationFormWrapper } from './QuotationForm/QuoatationFormWrapper';

// Export types
export interface QuotationFormData {
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

export interface HotelData {
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

export interface ItineraryData {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation: string;
}
