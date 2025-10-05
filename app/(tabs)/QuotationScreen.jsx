
import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { BasicDetails, TripDetails, Notes } from './ExampleSections';
import QuoatationFormWrapper from '@/components/form/quotationForm/QuoatationFormWrapper';
const QuotationScreen = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    destination: '', days: 0, budget: '', notes: '',
  });

  const onChange = useCallback((patch) => setForm((f) => ({ ...f, ...patch })), []);

  const sections = [
    (p) => <BasicDetails {...p} />,
    (p) => <TripDetails {...p} />,
    (p) => <Notes {...p} />,
  ];

  return (
    <QuoatationFormWrapper
      sections={sections}
      value={form}
      onChange={onChange}
      header={<Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Create Quotation</Text>}
      footer={
        <View style={{ marginTop: 16 }}>
          <Text style={{ color: '#6b7280', fontSize: 12 }}>
            Swipe up/down to change sections. Fields auto-save.
          </Text>
        </View>
      }
    />
  );
};

export default QuotationScreen;
