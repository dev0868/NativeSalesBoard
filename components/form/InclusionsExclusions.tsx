import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

const InclusionsExclusions: React.FC = () => {
  const { control } = useFormContext();
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');

  const { 
    fields: inclusionFields, 
    append: appendInclusion, 
    remove: removeInclusion 
  } = useFieldArray({
    control,
    name: 'Inclusions',
  });

  const { 
    fields: exclusionFields, 
    append: appendExclusion, 
    remove: removeExclusion 
  } = useFieldArray({
    control,
    name: 'Exclusions',
  });

  const addInclusion = () => {
    if (newInclusion.trim()) {
      appendInclusion(newInclusion.trim());
      setNewInclusion('');
    }
  };

  const addExclusion = () => {
    if (newExclusion.trim()) {
      appendExclusion(newExclusion.trim());
      setNewExclusion('');
    }
  };

  const predefinedInclusions = [
    'Accommodation as per itinerary',
    'Daily breakfast',
    'Airport transfers',
    'Sightseeing as per itinerary',
    'Professional tour guide',
    'All entrance fees',
    'Transportation in AC vehicle',
    'Travel insurance',
    'All taxes and service charges',
    'Welcome drink on arrival',
  ];

  const predefinedExclusions = [
    'International/Domestic airfare',
    'Visa fees',
    'Personal expenses',
    'Meals not mentioned in itinerary',
    'Optional activities',
    'Tips and gratuities',
    'Travel insurance (if not included)',
    'Any increase in fuel surcharge',
    'Camera fees at monuments',
    'Medical expenses',
  ];

  const addPredefinedItem = (item: string, type: 'inclusion' | 'exclusion') => {
    if (type === 'inclusion') {
      appendInclusion(item);
    } else {
      appendExclusion(item);
    }
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

  return (
    <View className="bg-white p-4 m-4 rounded-lg shadow-sm border border-gray-200">
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Inclusions & Exclusions
      </Text>

      {/* Inclusions Section */}
      <View className="mb-6">
        <Text className="text-md font-medium text-gray-800 mb-3">
          Package Inclusions
        </Text>

        {/* Add New Inclusion */}
        <View className="flex-row mb-3">
          <TextInput
            value={newInclusion}
            onChangeText={setNewInclusion}
            placeholder="Add new inclusion"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2"
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity
            onPress={addInclusion}
            className="bg-green-600 rounded-lg px-4 py-2"
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Predefined Inclusions */}
        <Text className="text-sm text-gray-600 mb-2">Quick Add:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
          <View className="flex-row">
            {predefinedInclusions.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => addPredefinedItem(item, 'inclusion')}
                className="bg-green-100 border border-green-300 rounded-full px-3 py-1 mr-2"
              >
                <Text className="text-green-700 text-sm">{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Current Inclusions */}
        <View className="bg-green-50 p-3 rounded-lg border border-green-200">
          {inclusionFields.length === 0 ? (
            <Text className="text-gray-500 text-center py-4">
              No inclusions added yet
            </Text>
          ) : (
            inclusionFields.map((field, index) => (
              <View key={field.id} className="flex-row items-center justify-between mb-2">
                <Text className="flex-1 text-gray-700">• {field.value || field}</Text>
                <TouchableOpacity
                  onPress={() => removeInclusion(index)}
                  className="bg-red-500 rounded-full p-1 ml-2"
                >
                  <Ionicons name="close" size={12} color="white" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Other Inclusions Text Field */}
        <FormField
          name="OtherInclusions"
          label="Additional Inclusions (Free Text)"
          placeholder="Enter any additional inclusions"
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Exclusions Section */}
      <View className="mb-4">
        <Text className="text-md font-medium text-gray-800 mb-3">
          Package Exclusions
        </Text>

        {/* Add New Exclusion */}
        <View className="flex-row mb-3">
          <TextInput
            value={newExclusion}
            onChangeText={setNewExclusion}
            placeholder="Add new exclusion"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2"
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity
            onPress={addExclusion}
            className="bg-red-600 rounded-lg px-4 py-2"
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Predefined Exclusions */}
        <Text className="text-sm text-gray-600 mb-2">Quick Add:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
          <View className="flex-row">
            {predefinedExclusions.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => addPredefinedItem(item, 'exclusion')}
                className="bg-red-100 border border-red-300 rounded-full px-3 py-1 mr-2"
              >
                <Text className="text-red-700 text-sm">{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Current Exclusions */}
        <View className="bg-red-50 p-3 rounded-lg border border-red-200">
          {exclusionFields.length === 0 ? (
            <Text className="text-gray-500 text-center py-4">
              No exclusions added yet
            </Text>
          ) : (
            exclusionFields.map((field, index) => (
              <View key={field.id} className="flex-row items-center justify-between mb-2">
                <Text className="flex-1 text-gray-700">• {field.value || field}</Text>
                <TouchableOpacity
                  onPress={() => removeExclusion(index)}
                  className="bg-red-500 rounded-full p-1 ml-2"
                >
                  <Ionicons name="close" size={12} color="white" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Other Exclusions Text Field */}
        <FormField
          name="OtherExclusions"
          label="Additional Exclusions (Free Text)"
          placeholder="Enter any additional exclusions"
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );
};

export default InclusionsExclusions;
