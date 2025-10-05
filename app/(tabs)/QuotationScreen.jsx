
import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import IntegratedQuotationForm from '@/components/form/IntegratedQuotationForm';

const QuotationScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // You can pass lead data through navigation params if needed
  const leadData = params.leadData ? JSON.parse(params.leadData) : null;

  const handleFormSubmit = (data) => {
    console.log('Quotation Form Submitted:', data);
    
    // Here you would typically:
    // 1. Validate the data
    // 2. Send to your API
    // 3. Handle success/error responses
    
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
