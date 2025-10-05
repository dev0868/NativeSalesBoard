import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

const FlightSection: React.FC = () => {
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
        <View style={[styles.iconWrapper, { backgroundColor: "#dbeafe" }]}>
          <Ionicons name="airplane" size={20} color="#3b82f6" />
        </View>
        <Text style={styles.sectionTitle}>Flight Information</Text>
      </View>

      {/* Outbound Flight */}
      <Text style={styles.sectionSubtitle}>Outbound Flight</Text>
      
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <FormField label="From" required error={errors?.OutboundFlight?.from}>
            <Controller
              control={control}
              name="OutboundFlight.from"
              rules={{ required: "Departure city is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors?.OutboundFlight?.from && styles.errorInput]}
                  placeholder="Departure city"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
        <View style={{ flex: 1 }}>
          <FormField label="To" required error={errors?.OutboundFlight?.to}>
            <Controller
              control={control}
              name="OutboundFlight.to"
              rules={{ required: "Arrival city is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors?.OutboundFlight?.to && styles.errorInput]}
                  placeholder="Arrival city"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <FormField label="Departure Date" required error={errors?.OutboundFlight?.departureDate}>
            <Controller
              control={control}
              name="OutboundFlight.departureDate"
              rules={{ required: "Departure date is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors?.OutboundFlight?.departureDate && styles.errorInput]}
                  placeholder="DD/MM/YYYY"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
        <View style={{ flex: 1 }}>
          <FormField label="Departure Time" error={errors?.OutboundFlight?.departureTime}>
            <Controller
              control={control}
              name="OutboundFlight.departureTime"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors?.OutboundFlight?.departureTime && styles.errorInput]}
                  placeholder="HH:MM"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <FormField label="Airline" error={errors?.OutboundFlight?.airline}>
            <Controller
              control={control}
              name="OutboundFlight.airline"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Airline name"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
        <View style={{ flex: 1 }}>
          <FormField label="Flight Number" error={errors?.OutboundFlight?.flightNumber}>
            <Controller
              control={control}
              name="OutboundFlight.flightNumber"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Flight number"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
      </View>

      <FormField label="Document Link" error={errors?.OutboundFlight?.documentLink}>
        <Controller
          control={control}
          name="OutboundFlight.documentLink"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Flight document URL"
              value={value}
              onChangeText={onChange}
              placeholderTextColor="#9ca3af"
            />
          )}
        />
      </FormField>

      {/* Return Flight */}
      <Text style={styles.sectionSubtitle}>Return Flight</Text>
      
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <FormField label="From" error={errors?.ReturnFlight?.from}>
            <Controller
              control={control}
              name="ReturnFlight.from"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Departure city"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
        <View style={{ flex: 1 }}>
          <FormField label="To" error={errors?.ReturnFlight?.to}>
            <Controller
              control={control}
              name="ReturnFlight.to"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Arrival city"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <FormField label="Departure Date" error={errors?.ReturnFlight?.departureDate}>
            <Controller
              control={control}
              name="ReturnFlight.departureDate"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/YYYY"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
        <View style={{ flex: 1 }}>
          <FormField label="Departure Time" error={errors?.ReturnFlight?.departureTime}>
            <Controller
              control={control}
              name="ReturnFlight.departureTime"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <FormField label="Airline" error={errors?.ReturnFlight?.airline}>
            <Controller
              control={control}
              name="ReturnFlight.airline"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Airline name"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
        <View style={{ flex: 1 }}>
          <FormField label="Flight Number" error={errors?.ReturnFlight?.flightNumber}>
            <Controller
              control={control}
              name="ReturnFlight.flightNumber"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Flight number"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
      </View>

      <FormField label="Document Link" error={errors?.ReturnFlight?.documentLink}>
        <Controller
          control={control}
          name="ReturnFlight.documentLink"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Flight document URL"
              value={value}
              onChangeText={onChange}
              placeholderTextColor="#9ca3af"
            />
          )}
        />
      </FormField>

      {/* Additional Notes */}
      <FormField label="Flight Notes" error={errors?.FlightNotes}>
        <Controller
          control={control}
          name="FlightNotes"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional flight information or special requirements"
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={3}
              placeholderTextColor="#9ca3af"
            />
          )}
        />
      </FormField>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconWrapper: {
    backgroundColor: "#dbeafe",
    borderRadius: 50,
    padding: 8,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
    fontSize: 16,
    color: "#1f2937",
  },
  errorInput: {
    borderColor: "#ef4444",
    borderWidth: 2,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
});

export default FlightSection;
