import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

interface ItineraryData {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation: string;
}

const ItinerarySection: React.FC = () => {
  const { control, watch } = useFormContext();
  const [newActivity, setNewActivity] = useState<{ [key: number]: string }>({});

  const { 
    fields: itineraryFields, 
    append: appendItinerary, 
    remove: removeItinerary,
    update: updateItinerary
  } = useFieldArray({
    control,
    name: 'Itinearies',
  });

  const days = watch('Days') || 2;

  const addItineraryDay = () => {
    const newDay = itineraryFields.length + 1;
    appendItinerary({
      day: newDay,
      title: `Day ${newDay}`,
      description: '',
      activities: [],
      meals: [],
      accommodation: '',
    });
  };

  const removeItineraryDay = (index: number) => {
    if (itineraryFields.length > 1) {
      removeItinerary(index);
      // Reorder remaining days
      itineraryFields.forEach((field, idx) => {
        if (idx > index) {
          updateItinerary(idx - 1, {
            ...field,
            day: idx,
            title: field.title.includes('Day') ? `Day ${idx}` : field.title
          });
        }
      });
    }
  };

  const addActivity = (dayIndex: number) => {
    const activity = newActivity[dayIndex];
    if (activity && activity.trim()) {
      const currentItinerary = itineraryFields[dayIndex];
      const updatedActivities = [...(currentItinerary.activities || []), activity.trim()];
      updateItinerary(dayIndex, {
        ...currentItinerary,
        activities: updatedActivities
      });
      setNewActivity(prev => ({ ...prev, [dayIndex]: '' }));
    }
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const currentItinerary = itineraryFields[dayIndex];
    const updatedActivities = currentItinerary.activities.filter((_, idx) => idx !== activityIndex);
    updateItinerary(dayIndex, {
      ...currentItinerary,
      activities: updatedActivities
    });
  };

  const FormField = ({
    name,
    label,
    placeholder,
    multiline = false,
    numberOfLines = 1,
  }: {
    name: string;
    label: string;
    placeholder: string;
    multiline?: boolean;
    numberOfLines?: number;
  }) => (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            multiline={multiline}
            numberOfLines={numberOfLines}
            className={`border rounded-lg px-3 py-3 text-gray-900 ${
              multiline ? 'h-20' : 'h-12'
            } border-gray-300`}
            placeholderTextColor="#9ca3af"
          />
        )}
      />
    </View>
  );

  const MultiSelectField = ({
    name,
    label,
    options,
    placeholder,
  }: {
    name: string;
    label: string;
    options: string[];
    placeholder: string;
  }) => (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value = [] } }) => (
          <View className="border border-gray-300 rounded-lg p-3">
            <Text className="text-gray-500 mb-2">{placeholder}</Text>
            <View className="flex-row flex-wrap">
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    const newValue = value.includes(option)
                      ? value.filter((item: string) => item !== option)
                      : [...value, option];
                    onChange(newValue);
                  }}
                  className={`mr-2 mb-2 px-3 py-1 rounded-full border ${
                    value.includes(option)
                      ? 'bg-purple-600 border-purple-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <Text className={`text-sm ${
                    value.includes(option) ? 'text-white' : 'text-gray-700'
                  }`}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );

  const mealOptions = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  // Auto-generate itinerary days based on trip duration
  React.useEffect(() => {
    const currentDays = itineraryFields.length;
    const requiredDays = parseInt(days.toString()) || 2;
    
    if (requiredDays > currentDays) {
      // Add missing days
      for (let i = currentDays; i < requiredDays; i++) {
        appendItinerary({
          day: i + 1,
          title: `Day ${i + 1}`,
          description: '',
          activities: [],
          meals: [],
          accommodation: '',
        });
      }
    } else if (requiredDays < currentDays) {
      // Remove extra days
      for (let i = currentDays - 1; i >= requiredDays; i--) {
        removeItinerary(i);
      }
    }
  }, [days]);

  return (
    <View className="bg-white p-4 m-4 rounded-lg shadow-sm border border-gray-200">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-gray-900">
          Itinerary ({days} Days)
        </Text>
        <TouchableOpacity
          onPress={addItineraryDay}
          className="bg-purple-600 rounded-full p-2"
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {itineraryFields.length === 0 ? (
          <View className="py-8 items-center">
            <Text className="text-gray-500 mb-4">No itinerary days added yet</Text>
            <TouchableOpacity
              onPress={addItineraryDay}
              className="bg-purple-600 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-medium">Add First Day</Text>
            </TouchableOpacity>
          </View>
        ) : (
          itineraryFields.map((field, index) => (
            <View key={field.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-medium text-purple-600">
                  Day {index + 1}
                </Text>
                {itineraryFields.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeItineraryDay(index)}
                    className="bg-red-500 rounded-full p-1"
                  >
                    <Ionicons name="trash" size={16} color="white" />
                  </TouchableOpacity>
                )}
              </View>

              <FormField
                name={`Itinearies.${index}.title`}
                label="Day Title"
                placeholder="e.g., Arrival in Delhi"
              />

              <FormField
                name={`Itinearies.${index}.description`}
                label="Description"
                placeholder="Describe the day's overview"
                multiline
                numberOfLines={3}
              />

              {/* Activities Section */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Activities</Text>
                
                {/* Add New Activity */}
                <View className="flex-row mb-3">
                  <TextInput
                    value={newActivity[index] || ''}
                    onChangeText={(text) => setNewActivity(prev => ({ ...prev, [index]: text }))}
                    placeholder="Add activity"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2"
                    placeholderTextColor="#9ca3af"
                  />
                  <TouchableOpacity
                    onPress={() => addActivity(index)}
                    className="bg-green-600 rounded-lg px-4 py-2"
                  >
                    <Ionicons name="add" size={20} color="white" />
                  </TouchableOpacity>
                </View>

                {/* Current Activities */}
                <View className="bg-green-50 p-3 rounded-lg border border-green-200">
                  {(!field.activities || field.activities.length === 0) ? (
                    <Text className="text-gray-500 text-center py-2">
                      No activities added yet
                    </Text>
                  ) : (
                    field.activities.map((activity, activityIndex) => (
                      <View key={activityIndex} className="flex-row items-center justify-between mb-2">
                        <Text className="flex-1 text-gray-700">• {activity}</Text>
                        <TouchableOpacity
                          onPress={() => removeActivity(index, activityIndex)}
                          className="bg-red-500 rounded-full p-1 ml-2"
                        >
                          <Ionicons name="close" size={12} color="white" />
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>
              </View>

              <MultiSelectField
                name={`Itinearies.${index}.meals`}
                label="Meals Included"
                options={mealOptions}
                placeholder="Select meals for this day"
              />

              <FormField
                name={`Itinearies.${index}.accommodation`}
                label="Accommodation"
                placeholder="Hotel/accommodation for the night"
              />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default ItinerarySection;
