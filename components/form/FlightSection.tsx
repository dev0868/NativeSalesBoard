import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

interface FlightData {
  flightNumber: string;
  airline: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  class: string;
  price: string;
  type: 'Onward' | 'Return' | 'Connecting';
}

const FlightSection: React.FC = () => {
  const { control } = useFormContext();
  const [newImageLink, setNewImageLink] = useState('');

  const { 
    fields: flightImageFields, 
    append: appendFlightImage, 
    remove: removeFlightImage 
  } = useFieldArray({
    control,
    name: 'flightsImagesLinks',
  });

  const addFlightImage = () => {
    if (newImageLink.trim()) {
      appendFlightImage(newImageLink.trim());
      setNewImageLink('');
    }
  };

  const FormField = ({
    name,
    label,
    placeholder,
    keyboardType = 'default',
    required = false,
  }: {
    name: string;
    label: string;
    placeholder: string;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    required?: boolean;
  }) => (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
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
            className="border rounded-lg px-3 py-3 text-gray-900 h-12 border-gray-300"
            placeholderTextColor="#9ca3af"
          />
        )}
      />
    </View>
  );

  const SelectField = ({
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
        render={({ field: { onChange, value } }) => (
          <View className="border border-gray-300 rounded-lg">
            <TouchableOpacity
              className="p-3 flex-row items-center justify-between"
              onPress={() => {
                // This would typically open a picker/modal
                Alert.alert(
                  label,
                  'Select an option',
                  options.map(option => ({
                    text: option,
                    onPress: () => onChange(option)
                  }))
                );
              }}
            >
              <Text className={value ? 'text-gray-900' : 'text-gray-500'}>
                {value || placeholder}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );

  const flightClasses = ['Economy', 'Premium Economy', 'Business', 'First Class'];
  const flightTypes = ['Onward', 'Return', 'Connecting'];
  const airlines = [
    'Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'GoAir', 'AirAsia India',
    'Emirates', 'Qatar Airways', 'Singapore Airlines', 'Thai Airways',
    'Lufthansa', 'British Airways', 'Other'
  ];

  return (
    <View className="bg-white p-4 m-4 rounded-lg shadow-sm border border-gray-200">
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Flight Information
      </Text>

      {/* Flight Cost (already in CostCalculator, but can be referenced here) */}
      <View className="mb-6">
        <Text className="text-md font-medium text-gray-800 mb-3">
          Flight Cost Summary
        </Text>
        <Controller
          control={control}
          name="FlightCost"
          render={({ field: { value } }) => (
            <View className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <Text className="text-blue-800 font-medium">
                Total Flight Cost: ₹ {value || '0'}
              </Text>
            </View>
          )}
        />
      </View>

      {/* Flight Details Form */}
      <View className="mb-6">
        <Text className="text-md font-medium text-gray-800 mb-3">
          Flight Details
        </Text>

        <View className="p-4 border border-gray-200 rounded-lg mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-3">Outbound Flight</Text>
          
          <View className="flex-row space-x-2">
            <View className="flex-1 mr-2">
              <FormField
                name="outboundFlightNumber"
                label="Flight Number"
                placeholder="e.g., AI 101"
              />
            </View>
            <View className="flex-1 ml-2">
              <SelectField
                name="outboundAirline"
                label="Airline"
                options={airlines}
                placeholder="Select airline"
              />
            </View>
          </View>

          <View className="flex-row space-x-2">
            <View className="flex-1 mr-2">
              <FormField
                name="outboundDeparture"
                label="Departure City"
                placeholder="e.g., Delhi (DEL)"
              />
            </View>
            <View className="flex-1 ml-2">
              <FormField
                name="outboundArrival"
                label="Arrival City"
                placeholder="e.g., Mumbai (BOM)"
              />
            </View>
          </View>

          <View className="flex-row space-x-2">
            <View className="flex-1 mr-2">
              <FormField
                name="outboundDepartureTime"
                label="Departure Time"
                placeholder="HH:MM"
              />
            </View>
            <View className="flex-1 ml-2">
              <FormField
                name="outboundArrivalTime"
                label="Arrival Time"
                placeholder="HH:MM"
              />
            </View>
          </View>

          <View className="flex-row space-x-2">
            <View className="flex-1 mr-2">
              <FormField
                name="outboundDate"
                label="Flight Date"
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View className="flex-1 ml-2">
              <SelectField
                name="outboundClass"
                label="Class"
                options={flightClasses}
                placeholder="Select class"
              />
            </View>
          </View>
        </View>

        <View className="p-4 border border-gray-200 rounded-lg">
          <Text className="text-sm font-medium text-gray-700 mb-3">Return Flight</Text>
          
          <View className="flex-row space-x-2">
            <View className="flex-1 mr-2">
              <FormField
                name="returnFlightNumber"
                label="Flight Number"
                placeholder="e.g., AI 102"
              />
            </View>
            <View className="flex-1 ml-2">
              <SelectField
                name="returnAirline"
                label="Airline"
                options={airlines}
                placeholder="Select airline"
              />
            </View>
          </View>

          <View className="flex-row space-x-2">
            <View className="flex-1 mr-2">
              <FormField
                name="returnDeparture"
                label="Departure City"
                placeholder="e.g., Mumbai (BOM)"
              />
            </View>
            <View className="flex-1 ml-2">
              <FormField
                name="returnArrival"
                label="Arrival City"
                placeholder="e.g., Delhi (DEL)"
              />
            </View>
          </View>

          <View className="flex-row space-x-2">
            <View className="flex-1 mr-2">
              <FormField
                name="returnDepartureTime"
                label="Departure Time"
                placeholder="HH:MM"
              />
            </View>
            <View className="flex-1 ml-2">
              <FormField
                name="returnArrivalTime"
                label="Arrival Time"
                placeholder="HH:MM"
              />
            </View>
          </View>

          <View className="flex-row space-x-2">
            <View className="flex-1 mr-2">
              <FormField
                name="returnDate"
                label="Flight Date"
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View className="flex-1 ml-2">
              <SelectField
                name="returnClass"
                label="Class"
                options={flightClasses}
                placeholder="Select class"
              />
            </View>
          </View>
        </View>
      </View>

      {/* Flight Images/Documents */}
      <View className="mb-4">
        <Text className="text-md font-medium text-gray-800 mb-3">
          Flight Images & Documents
        </Text>

        {/* Add New Image Link */}
        <View className="flex-row mb-3">
          <TextInput
            value={newImageLink}
            onChangeText={setNewImageLink}
            placeholder="Add flight image/document link"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2"
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity
            onPress={addFlightImage}
            className="bg-blue-600 rounded-lg px-4 py-2"
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Current Flight Images */}
        <View className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          {flightImageFields.length === 0 ? (
            <Text className="text-gray-500 text-center py-4">
              No flight images/documents added yet
            </Text>
          ) : (
            flightImageFields.map((field, index) => (
              <View key={field.id} className="flex-row items-center justify-between mb-2">
                <Text className="flex-1 text-blue-700 text-sm" numberOfLines={1}>
                  {field.value || field}
                </Text>
                <TouchableOpacity
                  onPress={() => removeFlightImage(index)}
                  className="bg-red-500 rounded-full p-1 ml-2"
                >
                  <Ionicons name="close" size={12} color="white" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  );
};

export default FlightSection;
