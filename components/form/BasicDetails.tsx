import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from '@/components/ui/DatePicker';

interface BasicDetailsProps {
  // Add any specific props if needed
}

const BasicDetails: React.FC<BasicDetailsProps> = () => {
  const { control, formState: { errors } } = useFormContext();

  const FormField = ({ 
    label, 
    children, 
    required = false, 
    error 
  }: { 
    label: string; 
    children: React.ReactNode; 
    required?: boolean; 
    error?: any; 
  }) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: "#374151", fontWeight: "600", marginBottom: 8 }}>
        {label} {required && <Text style={{ color: "red" }}>*</Text>}
      </Text>
      {children}
      {error && (
        <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
          {error.message}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.card}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
            <FormField
              name="Infant"
              label="Infants"
              placeholder="Number of infants"
              keyboardType="numeric"
            />
          </View>
        </View>

        <FormField
          name="Budget"
          label="Budget"
          placeholder="Enter budget amount"
          keyboardType="numeric"
        />
      </View>
    </View>
  );
};

export default BasicDetails;
