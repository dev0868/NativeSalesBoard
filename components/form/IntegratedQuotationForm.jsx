import React, { useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { FormProvider } from 'react-hook-form';
import SimpleQuotationWrapper from './SimpleQuotationWrapper';
import BasicDetails from './BasicDetails';
import CostCalculator from './CostCalculator';
import HotelsSection from './HotelsSectionNew';
import InclusionsExclusions from './InclusionsExclusionsNew';
import FlightSection from './FlightSectionNew';
import ItinerarySection from './ItinerarySectionNew';

import { useQuotationDraft } from '@/hooks/useQuotationDraft'; // your AsyncStorage autosave hook
import { clearQuotationDraft } from '@/storage/quotationDrafts';

const calculateTravelEndDate = (startDate: string, days: number) => {
  if (!startDate || !days) return '';
  const start = new Date(startDate);
  const end = new Date(start.getTime() + (days - 1) * 24 * 60 * 60 * 1000);
  return end.toISOString().split('T')[0];
};

const IntegratedQuotationForm = ({ onSubmit, initialData = {}, lead }) => {
  const tripId = lead?.TripId || '';

  // Build defaults ONCE; changing this object each render causes RHF to rethink everything.
  const defaults = useMemo(
    () => ({
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
      Hotels: [
        {
          nights: [],
          name: '',
          city: '',
          roomType: '',
          category: '',
          meals: [],
          checkInDate: '',
          checkOutDate: '',
          comments: '',
        },
      ],
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
        lead?.ClientLeadDetails?.Days
      ),
      ...initialData,
    }),
    // only recompute when these identity-level inputs change
    [tripId, lead, initialData]
  );

  // RHF + AsyncStorage (rehydrate + autosave)
  const { methods, loading } = useQuotationDraft(tripId, defaults);

  // ✅ Make sections stable (no new identities per keystroke)
  const sections = useMemo(
    () => [
      { key: 'basic', Component: BasicDetails },
      { key: 'cost', Component: CostCalculator },
      { key: 'hotels', Component: HotelsSection },
      { key: 'incl-excl', Component: InclusionsExclusions },
      { key: 'flights', Component: FlightSection },
      { key: 'itinerary', Component: ItinerarySection },
    ],
    []
  );

  const handleSubmit = methods.handleSubmit(async (data) => {
    await onSubmit(data);
    await clearQuotationDraft(tripId); // clear draft only on success
  });

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FormProvider {...methods}>
      {/* IMPORTANT: remove value={formValues} and onChange={...}
         Sections will read/write through RHF context themselves */}
      <SimpleQuotationWrapper
        sections={sections}
        onSubmit={handleSubmit}
        header={null}
        footer={null}
      />
    </FormProvider>
  );
};

export default IntegratedQuotationForm;
