import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

const ItinerarySection: React.FC = () => {
  const { control, watch, formState: { errors } } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'Itinerary',
  });

  const days = watch('Days') || 1;

  const addDay = () => {
    append({
      day: fields.length + 1,
      date: '',
      activities: [],
      meals: {
        breakfast: '',
        lunch: '',
        dinner: '',
      },
      accommodation: '',
      notes: '',
    });
  };

  const removeDay = (index: number) => {
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

  // Auto-generate days based on trip duration
  React.useEffect(() => {
    const currentDays = fields.length;
    const targetDays = parseInt(days) || 1;
    
    if (targetDays > currentDays) {
      // Add missing days
      for (let i = currentDays; i < targetDays; i++) {
        append({
          day: i + 1,
          date: '',
          activities: [],
          meals: {
            breakfast: '',
            lunch: '',
            dinner: '',
          },
          accommodation: '',
          notes: '',
        });
      }
    } else if (targetDays < currentDays) {
      // Remove extra days
      for (let i = currentDays - 1; i >= targetDays; i--) {
        remove(i);
      }
    }
  }, [days]);

  // Initialize with one day if empty
  React.useEffect(() => {
    if (fields.length === 0) {
      addDay();
    }
  }, []);

  return (
    <View style={styles.card}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={[styles.iconWrapper, { backgroundColor: "#ecfdf5" }]}>
          <Ionicons name="calendar" size={20} color="#10b981" />
        </View>
        <Text style={styles.sectionTitle}>Day-wise Itinerary</Text>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color="#3b82f6" />
        <Text style={styles.infoText}>
          Itinerary will auto-generate based on trip duration ({days} days)
        </Text>
      </View>

      {fields.map((field, index) => (
        <View key={field.id} style={styles.dayCard}>
          {/* Day Header */}
          <View style={styles.dayHeader}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayNumber}>Day {index + 1}</Text>
            </View>
            {fields.length > 1 && (
              <TouchableOpacity
                onPress={() => removeDay(index)}
                style={styles.removeButton}
              >
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>

          {/* Date */}
          <FormField label="Date">
            <Controller
              control={control}
              name={`Itinearies.${index}.Date`}
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

          {/* Activities */}
          <FormField label="Activities & Sightseeing">
            <Controller
              control={control}
              name={`Itinearies.${index}.Activities`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="List the activities, sightseeing spots, and experiences for this day"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>

          {/* Meals */}
          <Text style={styles.subsectionTitle}>Meals</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <FormField label="Breakfast">
                <Controller
                  control={control}
                  name={`Itinearies.${index}.meals.breakfast`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Hotel/Restaurant"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>
            <View style={{ flex: 1 }}>
              <FormField label="Lunch">
                <Controller
                  control={control}
                  name={`Itinearies.${index}.meals.lunch`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Hotel/Restaurant"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>
            <View style={{ flex: 1 }}>
              <FormField label="Dinner">
                <Controller
                  control={control}
                  name={`Itinearies.${index}.meals.dinner`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Hotel/Restaurant"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>
          </View>

          {/* Accommodation */}
          <FormField label="Accommodation">
            <Controller
              control={control}
              name={`Itinearies.${index}.accommodation`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Hotel name and location"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>

          {/* Notes */}
          <FormField label="Additional Notes">
            <Controller
              control={control}
              name={`Itinearies.${index}.Description`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Any special notes, timings, or instructions for this day"
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

      {/* Add Day Button */}
      <TouchableOpacity
        onPress={addDay}
        style={styles.addButton}
      >
        <Ionicons name="add-circle" size={24} color="#10b981" />
        <Text style={styles.addButtonText}>Add Another Day</Text>
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
    backgroundColor: "#ecfdf5",
    borderRadius: 50,
    padding: 8,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#3b82f6',
    flex: 1,
  },
  dayCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dayNumber: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 8,
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
    height: 100,
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
    borderColor: '#10b981',
    borderStyle: 'dashed',
    backgroundColor: '#f0fdf4',
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
});

export default ItinerarySection;
