// components/form/IntegratedQuotationForm.jsx
import React, { useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { FormProvider } from 'react-hook-form';
import SimpleQuotationWrapper from './SimpleQuotationWrapper';
import BasicDetails from './BasicDetailsNew';
import CostCalculator from './CostCalculator';
import HotelsSection from './HotelsSectionNew';
import InclusionsExclusions from './InclusionsExclusionsNew';
import FlightSection from './FlightSectionNew';
import ItinerarySection from './ItinerarySectionNew';

import { useQuotationDraft } from '@/hooks/useQuotationDraft';
import { clearQuotationDraft } from '@/storage/quotationDrafts';

const calculateTravelEndDate = (startDate, days) => {
  if (!startDate || !days) return '';
  const start = new Date(startDate);
  const end = new Date(start.getTime() + (days - 1) * 24 * 60 * 60 * 1000);
  return end.toISOString().split('T')[0];
};

const IntegratedQuotationForm = ({ onSubmit, initialData = {}, lead }) => {
  const tripId = lead?.TripId || '';

  // Build defaults once (from lead + initialData)
  const defaults = useMemo(() => ({
    TripId: tripId,
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
  }), [tripId, lead, initialData]);

  // RHF with async rehydrate + autosave
  const { methods, loading } = useQuotationDraft(tripId, defaults);

  const formValues = methods.watch();
  const handleFormChange = (field, value) => {
    methods.setValue(field, value, { shouldDirty: true, shouldTouch: true });
  };

  const sections = [
    () => <BasicDetails />,
    () => <CostCalculator />,
    () => <HotelsSection />,
    () => <InclusionsExclusions />,
    () => <FlightSection />,
    () => <ItinerarySection />,
  ];

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
