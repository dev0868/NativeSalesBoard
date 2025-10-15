import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import ActivitySelector from "@/components/ui/ActivitySelector";

const ItinerarySection = () => {
const [activity,setActivity]=useState([])
console.log(activity)

  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "Itinerary",
  });

  const days = watch("Days") || 1;
const destinations=watch("Destinations");
console.log(destinations)
  const addDay = () => {
    const nextDay = fields.length + 1;
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + (nextDay - 1));
    
    const formattedDate = futureDate.toISOString().split('T')[0];
    const dateKey = parseInt(formattedDate.replace(/-/g, ''));
    
    append({
      day: nextDay,
      Date: formattedDate,
      DateKey: dateKey,
      Title: `Day ${nextDay} Itinerary`,
      Activities: "",
      ImageUrl: "",
      Description: "",
      ActivityId: ""
    });
  };

  const handleActivitySelect = (activity, index) => {
    const currentItinerary = [...fields];
    const updatedDay = {
      ...currentItinerary[index],
      Title: activity.Title,
      Description: activity.Description,
      ImageUrl: activity.ImageUrl,
      Activities: activity.Activities || "",
      ActivityId: activity.ActivityId || ""
    };
    
    // Update the form with the selected activity data
    const updatedItinerary = [...control._formValues.Itinearies];
    updatedItinerary[index] = updatedDay;
    control._formValues.Itinearies = updatedItinerary;
    control._formState.dirtyFields[`Itinearies.${index}`] = true;
    
    // Trigger re-render
    forceUpdate({});
  };

  const removeDay = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const FormField = ({
    label,
    children,
    required = false,
    error,
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
        const dayNumber = i + 1;
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        
        const formattedDate = futureDate.toISOString().split('T')[0];
        const dateKey = parseInt(formattedDate.replace(/-/g, ''));
        
        append({
          day: dayNumber,
          Date: formattedDate,
          DateKey: dateKey,
          Title: `Day ${dayNumber} Itinerary`,
          Activities: "",
          ImageUrl: "",
          Description: "",
          ActivityId: ""
        });
      }
    } else if (targetDays < currentDays) {
      // Remove extra days
      for (let i = currentDays - 1; i >= targetDays; i--) {
        remove(i);
      }
    }
  }, [days]);

  // Force update hook
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  // Initialize with one day if empty
  React.useEffect(() => {
    if (fields.length === 0) {
      addDay();
    }
  }, []);

  useEffect(() => {
    const fetchActivities = async (destination) => {
      try {
        const response = await fetch(
          `https://2rltmjilx9.execute-api.ap-south-1.amazonaws.com/DataTransaction/activitysightseen?DestinationName=${destination}`,
        );
        const data = await response.json();
        return data?.Items || [];
      } catch (error) {
        console.error(`Error fetching activities for ${destination}:`, error);
        return [];
      }
    };

    const fetchAllActivities = async () => {
      let allActivities = [];

  

      if (destinations?.length) {
        const otherActivitiesPromises =
          destinations?.map(fetchActivities);
        const otherActivitiesArray = await Promise.all(otherActivitiesPromises);
        otherActivitiesArray.forEach((items) => {
          allActivities = [...allActivities, ...items];
        });
      }
      setActivity(allActivities);
    };

    fetchAllActivities();
  }, [
 destinations
  ]);

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

          {/* Activity Selector */}
          <FormField label="Select Activity">
            <View style={{ marginBottom: 15 }}>
              <Controller
                control={control}
                name={`Itinearies.${index}`}
                render={({ field: { value } }) => (
                  <ActivitySelector
                    onSelectActivity={(activity) => handleActivitySelect(activity, index)}
                    selectedActivity={{
                      Title: value?.Title || '',
                      Description: value?.Description || '',
                      ImageUrl: value?.ImageUrl || '',
                      ActivityId: value?.ActivityId || ''
                    }}
                    destination={destinations?.[0]} // Assuming first destination for activity search
                  />
                )}
              />
            </View>
          </FormField>

          {/* Title */}
          <FormField label="Title">
            <Controller
              control={control}
              name={`Itinearies.${index}.Title`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Enter day title (e.g., Halong Bay Cruise)"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>

          {/* Activities */}
          <FormField label="Activities">
            <Controller
              control={control}
              name={`Itinearies.${index}.Activities`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="List activities (e.g., Cruise, cave visit, kayak)"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={2}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>

          {/* Description */}
          <FormField label="Description">
            <Controller
              control={control}
              name={`Itinearies.${index}.Description`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter detailed description of the day's activities"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>

          {/* Image URL */}
          <FormField label="Image URL">
            <Controller
              control={control}
              name={`Itinearies.${index}.ImageUrl`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="https://example.com/image.jpg"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                  keyboardType="url"
                />
              )}
            />
          </FormField>
        </View>
      ))}

      {/* Add Day Button */}
      <TouchableOpacity onPress={addDay} style={styles.addButton}>
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#3b82f6",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dayBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dayNumber: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fef2f2",
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
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
    textAlignVertical: "top",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#10b981",
    borderStyle: "dashed",
    backgroundColor: "#f0fdf4",
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#10b981",
  },
});

export default ItinerarySection;
