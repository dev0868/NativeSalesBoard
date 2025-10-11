
import React from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import IntegratedQuotationForm from '@/components/form/IntegratedQuotationForm';

const QuotationScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const leadData = params.leadData ? JSON.parse(params.leadData) : null;

  const handleFormSubmit = (data) => {
    console.log('Quotation Form Submitted:', data);
  
    
    Alert.alert(
      'Success',
      'Quotation created successfully!',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  return (
    <IntegratedQuotationForm
      onSubmit={handleFormSubmit}
      lead={leadData}
    />
  );
};

export default QuotationScreen;
