// app/QuotationScreen.tsx
import React from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import IntegratedQuotationForm from '@/components/form/IntegratedQuotationForm';
import { clearQuotationDraft } from '@/storage/quotationDrafts';

const QuotationScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const leadData = params.leadData ? JSON.parse(params.leadData) : null;

  const handleFormSubmit = async (data) => {
    console.log('Quotation Form Submitted:', data);

    // TODO: call your create-quotation API here
    // await api.createQuotation(data.TripId, data);

    // ✅ clear local draft after successful creation
    clearQuotationDraft(data.TripId);

    Alert.alert('Success', 'Quotation created successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <IntegratedQuotationForm
      onSubmit={handleFormSubmit}
      lead={leadData}
    />
  );
};

export default QuotationScreen;
