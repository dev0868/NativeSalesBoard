import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import SimpleQuotationWrapper from './SimpleQuotationWrapper';
import BasicDetails from './BasicDetailsNew';
import CostCalculator from './CostCalculatorNew';
import HotelsSection from './HotelsSectionNew';
import InclusionsExclusions from './InclusionsExclusionsNew';
import FlightSection from './FlightSectionNew';
import ItinerarySection from './ItinerarySectionNew';


const calculateTravelEndDate = (startDate, days) => {
  if (!startDate || !days) return '';
  const start = new Date(startDate);
  const end = new Date(start.getTime() + (days - 1) * 24 * 60 * 60 * 1000);
  return end.toISOString().split('T')[0];
};

const IntegratedQuotationForm = ({
  onSubmit,
  initialData = {},
  lead
}) => {
  const methods = useForm({
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
  const BasicDetailsSection = ({ value, onChange }) => <BasicDetails />;
  const CostCalculatorSection = ({ value, onChange }) => <CostCalculator />;
  const HotelsSectionWrapper = ({ value, onChange }) => <HotelsSection />;
  const InclusionsExclusionsSection = ({ value, onChange}) => <InclusionsExclusions />;
  const FlightSectionWrapper = ({ value, onChange }) => <FlightSection />;
  const ItinerarySectionWrapper = ({ value, onChange }) => <ItinerarySection />;

  // Define sections for the wrapper
  const sections = [
    BasicDetailsSection,
    CostCalculatorSection,
    HotelsSectionWrapper,
    InclusionsExclusionsSection,
    FlightSectionWrapper,
    ItinerarySectionWrapper,
  ];

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  // Watch all form values to pass to wrapper
  const formValues = watch();

  const handleFormChange = (field, value) => {
    methods.setValue(field , value);
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
