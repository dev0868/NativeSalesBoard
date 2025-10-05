import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
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
    name,
    label,
    placeholder,
    keyboardType = 'default',
    multiline = false,
    numberOfLines = 1,
  }: {
    name: string;
    label: string;
    placeholder: string;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
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
            keyboardType={keyboardType}
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

  const mealOptions = ['Breakfast', 'Lunch', 'Dinner', 'All Meals', 'No Meals'];
  const roomCategories = ['Standard', 'Deluxe', 'Premium', 'Suite', 'Villa'];
  const roomTypes = ['Single', 'Double', 'Twin', 'Triple', 'Family Room'];

  return (
    <View className="bg-white p-4 m-4 rounded-lg shadow-sm border border-gray-200">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-gray-900">
          Hotels & Accommodation
        </Text>
        <TouchableOpacity
          onPress={addHotel}
          className="bg-purple-600 rounded-full p-2"
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {fields.map((field, index) => (
          <View key={field.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-md font-medium text-gray-800">
                Hotel {index + 1}
              </Text>
              {fields.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeHotel(index)}
                  className="bg-red-500 rounded-full p-1"
                >
                  <Ionicons name="trash" size={16} color="white" />
                </TouchableOpacity>
              )}
            </View>

            <FormField
              name={`Hotels.${index}.name`}
              label="Hotel Name"
              placeholder="Enter hotel name"
            />

            <FormField
              name={`Hotels.${index}.city`}
              label="City"
              placeholder="Enter city"
            />

            <View className="flex-row space-x-2">
              <View className="flex-1 mr-2">
                <Text className="text-gray-700 font-medium mb-2">Room Type</Text>
                <Controller
                  control={control}
                  name={`Hotels.${index}.roomType`}
                  render={({ field: { onChange, value } }) => (
                    <View className="border border-gray-300 rounded-lg">
                      {roomTypes.map((type) => (
                        <TouchableOpacity
                          key={type}
                          onPress={() => onChange(type)}
                          className={`p-3 border-b border-gray-200 ${
                            value === type ? 'bg-purple-50' : 'bg-white'
                          }`}
                        >
                          <Text className={`${
                            value === type ? 'text-purple-600 font-medium' : 'text-gray-700'
                          }`}>
                            {type}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                />
              </View>

              <View className="flex-1 ml-2">
                <Text className="text-gray-700 font-medium mb-2">Category</Text>
                <Controller
                  control={control}
                  name={`Hotels.${index}.category`}
                  render={({ field: { onChange, value } }) => (
                    <View className="border border-gray-300 rounded-lg">
                      {roomCategories.map((category) => (
                        <TouchableOpacity
                          key={category}
                          onPress={() => onChange(category)}
                          className={`p-3 border-b border-gray-200 ${
                            value === category ? 'bg-purple-50' : 'bg-white'
                          }`}
                        >
                          <Text className={`${
                            value === category ? 'text-purple-600 font-medium' : 'text-gray-700'
                          }`}>
                            {category}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                />
              </View>
            </View>

            <MultiSelectField
              name={`Hotels.${index}.meals`}
              label="Meals Included"
              options={mealOptions}
              placeholder="Select meals included"
            />

            <View className="flex-row space-x-2">
              <View className="flex-1 mr-2">
                <FormField
                  name={`Hotels.${index}.checkInDate`}
                  label="Check-in Date"
                  placeholder="YYYY-MM-DD"
                />
              </View>
              <View className="flex-1 ml-2">
                <FormField
                  name={`Hotels.${index}.checkOutDate`}
                  label="Check-out Date"
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>

            <FormField
              name={`Hotels.${index}.comments`}
              label="Comments"
              placeholder="Any special requirements or notes"
              multiline
              numberOfLines={3}
            />
          </View>
        ))}
      </ScrollView>

      {fields.length === 0 && (
        <View className="py-8 items-center">
          <Text className="text-gray-500 mb-4">No hotels added yet</Text>
          <TouchableOpacity
            onPress={addHotel}
            className="bg-purple-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-medium">Add First Hotel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HotelsSection;
