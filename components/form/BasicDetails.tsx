import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';

const BasicDetails: React.FC = () => {
  const { control, formState: { errors } } = useFormContext();

  const FormField = ({
    name,
    label,
    placeholder,
    keyboardType = 'default',
    required = false,
    multiline = false,
    numberOfLines = 1,
  }: {
    name: string;
    label: string;
    placeholder: string;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    required?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
  }) => (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
      <Controller
        control={control}
        name={name}
        rules={{ required: required ? `${label} is required` : false }}
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
              errors[name] ? 'border-red-500' : 'border-gray-300'
            } ${multiline ? 'h-20' : 'h-12'}`}
            placeholderTextColor="#9ca3af"
          />
        )}
      />
      {errors[name] && (
        <Text className="text-red-500 text-sm mt-1">
          {errors[name]?.message as string}
        </Text>
      )}
    </View>
  );

  return (
    <View className="bg-white p-4 m-4 rounded-lg shadow-sm border border-gray-200">
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Basic Details
      </Text>

      {/* Customer Information */}
      <View className="mb-6">
        <Text className="text-md font-medium text-gray-800 mb-3">
          Customer Information
        </Text>
        
        <FormField
          name="FullName"
          label="Full Name"
          placeholder="Enter customer full name"
          required
        />

        <FormField
          name="Contact"
          label="Contact Number"
          placeholder="Enter contact number"
          keyboardType="phone-pad"
          required
        />

        <FormField
          name="Email"
          label="Email Address"
          placeholder="Enter email address"
          keyboardType="email-address"
        />
      </View>

      {/* Trip Information */}
      <View className="mb-6">
        <Text className="text-md font-medium text-gray-800 mb-3">
          Trip Information
        </Text>

        <FormField
          name="DestinationName"
          label="Destination"
          placeholder="Enter destination"
          required
        />

        <FormField
          name="Departure"
          label="Departure City"
          placeholder="Enter departure city"
        />

        <FormField
          name="TravelDate"
          label="Travel Date"
          placeholder="YYYY-MM-DD"
        />

        <View className="flex-row space-x-2">
          <View className="flex-1 mr-2">
            <FormField
              name="Days"
              label="Days"
              placeholder="Number of days"
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1 ml-2">
            <FormField
              name="Nights"
              label="Nights"
              placeholder="Number of nights"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Passenger Information */}
      <View className="mb-4">
        <Text className="text-md font-medium text-gray-800 mb-3">
          Passenger Information
        </Text>

        <View className="flex-row space-x-2">
          <View className="flex-1 mr-1">
            <FormField
              name="NoOfPax"
              label="Adults"
              placeholder="Number of adults"
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1 mx-1">
            <FormField
              name="Child"
              label="Children"
              placeholder="Number of children"
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1 ml-1">
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
