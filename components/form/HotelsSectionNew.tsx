import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

const HotelsSection: React.FC = () => {
  const { control, formState: { errors } } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'Hotels',
  });

  const addHotel = () => {
    append({
      nights: [],
      name: '',
      city: '',
      roomType: '',
      category: '',
      meals: [],
      checkInDate: '',
      checkOutDate: '',
      comments: '',
    });
  };

  const removeHotel = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

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

  // Initialize with one hotel if empty
  React.useEffect(() => {
    if (fields.length === 0) {
      addHotel();
    }
  }, []);

  return (
    <View style={styles.card}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={[styles.iconWrapper, { backgroundColor: "#fef3c7" }]}>
          <Ionicons name="bed" size={20} color="#f59e0b" />
        </View>
        <Text style={styles.sectionTitle}>Hotels & Accommodation</Text>
      </View>

      {fields.map((field, index) => (
        <View key={field.id} style={styles.hotelCard}>
          {/* Hotel Header */}
          <View style={styles.hotelHeader}>
            <Text style={styles.hotelTitle}>Hotel {index + 1}</Text>
            {fields.length > 1 && (
              <TouchableOpacity
                onPress={() => removeHotel(index)}
                style={styles.removeButton}
              >
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>

          {/* Hotel Details */}
          <FormField label="Hotel Name" required>
            <Controller
              control={control}
              name={`Hotels.${index}.name`}
              rules={{ required: "Hotel name is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors?.Hotels?.[index]?.name && styles.errorInput]}
                  placeholder="Enter hotel name"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <FormField label="City" required>
                <Controller
                  control={control}
                  name={`Hotels.${index}.city`}
                  rules={{ required: "City is required" }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors?.Hotels?.[index]?.city && styles.errorInput]}
                      placeholder="Enter city"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>
            <View style={{ flex: 1 }}>
              <FormField label="Room Type">
                <Controller
                  control={control}
                  name={`Hotels.${index}.roomType`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Deluxe, Suite"
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
              <FormField label="Category">
                <Controller
                  control={control}
                  name={`Hotels.${index}.category`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 3 Star, 4 Star"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>
            <View style={{ flex: 1 }}>
              <FormField label="Meals">
                <Controller
                  control={control}
                  name={`Hotels.${index}.meals`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Breakfast, All Meals"
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
              <FormField label="Check-in Date">
                <Controller
                  control={control}
                  name={`Hotels.${index}.checkInDate`}
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
              <FormField label="Check-out Date">
                <Controller
                  control={control}
                  name={`Hotels.${index}.checkOutDate`}
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
          </View>

          <FormField label="Comments">
            <Controller
              control={control}
              name={`Hotels.${index}.comments`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Additional comments or requirements"
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
      ))}

      {/* Add Hotel Button */}
      <TouchableOpacity
        onPress={addHotel}
        style={styles.addButton}
      >
        <Ionicons name="add-circle" size={24} color="#7c3aed" />
        <Text style={styles.addButtonText}>Add Another Hotel</Text>
      </TouchableOpacity>
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
    backgroundColor: "#fef3c7",
    borderRadius: 50,
    padding: 8,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  hotelCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  hotelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7c3aed',
    borderStyle: 'dashed',
    backgroundColor: '#faf5ff',
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#7c3aed',
  },
});

export default HotelsSection;
