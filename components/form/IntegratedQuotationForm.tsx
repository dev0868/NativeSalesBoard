import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import SimpleQuotationWrapper from './SimpleQuotationWrapper';
import BasicDetails from './BasicDetailsNew';
import CostCalculator from './CostCalculatorNew';
import HotelsSection from './HotelsSectionNew';
import InclusionsExclusions from './InclusionsExclusionsNew';
import FlightSection from './FlightSectionNew';
import ItinerarySection from './ItinerarySectionNew';

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

interface IntegratedQuotationFormProps {
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

const IntegratedQuotationForm: React.FC<IntegratedQuotationFormProps> = ({
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

  const { handleSubmit, watch } = methods;

  // Create section components that work with the wrapper
  const BasicDetailsSection = ({ value, onChange }: { value: any; onChange: any }) => <BasicDetails />;
  const CostCalculatorSection = ({ value, onChange }: { value: any; onChange: any }) => <CostCalculator />;
  const HotelsSectionWrapper = ({ value, onChange }: { value: any; onChange: any }) => <HotelsSection />;
  const InclusionsExclusionsSection = ({ value, onChange }: { value: any; onChange: any }) => <InclusionsExclusions />;
  const FlightSectionWrapper = ({ value, onChange }: { value: any; onChange: any }) => <FlightSection />;
  const ItinerarySectionWrapper = ({ value, onChange }: { value: any; onChange: any }) => <ItinerarySection />;

  // Define sections for the wrapper
  const sections = [
    BasicDetailsSection,
    CostCalculatorSection,
    HotelsSectionWrapper,
    InclusionsExclusionsSection,
    FlightSectionWrapper,
    ItinerarySectionWrapper,
  ];

  const onFormSubmit = (data: QuotationFormData) => {
    onSubmit(data);
  };

  // Watch all form values to pass to wrapper
  const formValues = watch();

  const handleFormChange = (field: string, value: any) => {
    methods.setValue(field as keyof QuotationFormData, value);
  };

  return (
    <FormProvider {...methods}>
      <SimpleQuotationWrapper
        sections={sections}
        value={formValues}
        onChange={handleFormChange}
        header={null}
        footer={null}
      />
    </FormProvider>
  );
};

export default IntegratedQuotationForm;
