import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';

const CostCalculator: React.FC = () => {
  const { control, watch, setValue, formState: { errors } } = useFormContext();

  // Watch cost fields for auto-calculation
  const flightCost = watch('FlightCost') || '0';
  const visaCost = watch('VisaCost') || '0';
  const landPackageCost = watch('LandPackageCost') || '0';
  const totalTax = watch('TotalTax') || '0';
  const gst = watch('GST') || '0';
  const tcs = watch('TCS') || '0';
  const gstWaivedOff = watch('GstWaivedOffAmt') || '0';
  const tcsWaivedOff = watch('TcsWaivedOffAmt') || '0';
  const packageWithGST = watch('PackageWithGST');
  const packageWithTCS = watch('PackageWithTCS');

  // Auto-calculate total cost
  useEffect(() => {
    const flight = parseFloat(flightCost) || 0;
    const visa = parseFloat(visaCost) || 0;
    const landPackage = parseFloat(landPackageCost) || 0;
    const tax = parseFloat(totalTax) || 0;
    const gstAmount = parseFloat(gst) || 0;
    const tcsAmount = parseFloat(tcs) || 0;
    const gstWaived = parseFloat(gstWaivedOff) || 0;
    const tcsWaived = parseFloat(tcsWaivedOff) || 0;

    let total = flight + visa + landPackage + tax;
    
    if (packageWithGST) {
      total += gstAmount - gstWaived;
    }
    
    if (packageWithTCS) {
      total += tcsAmount - tcsWaived;
    }

    setValue('TotalCost', total.toString());
  }, [flightCost, visaCost, landPackageCost, totalTax, gst, tcs, gstWaivedOff, tcsWaivedOff, packageWithGST, packageWithTCS, setValue]);

  const FormField = ({
    name,
    label,
    placeholder,
    keyboardType = 'numeric',
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
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            keyboardType={keyboardType}
            className={`border rounded-lg px-3 py-3 text-gray-900 h-12 ${
              errors[name] ? 'border-red-500' : 'border-gray-300'
            }`}
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

  const CheckboxField = ({
    name,
    label,
  }: {
    name: string;
    label: string;
  }) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <TouchableOpacity
          onPress={() => onChange(!value)}
          className="flex-row items-center mb-3"
        >
          <View className={`w-5 h-5 border-2 rounded mr-3 ${
            value ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
          }`}>
            {value && (
              <Text className="text-white text-xs text-center">✓</Text>
            )}
          </View>
          <Text className="text-gray-700 font-medium">{label}</Text>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <View className="bg-white p-4 m-4 rounded-lg shadow-sm border border-gray-200">
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Cost Calculator
      </Text>

      {/* Basic Costs */}
      <View className="mb-6">
        <Text className="text-md font-medium text-gray-800 mb-3">
          Package Components
        </Text>

        <FormField
          name="FlightCost"
          label="Flight Cost"
          placeholder="Enter flight cost"
        />

        <FormField
          name="VisaCost"
          label="Visa Cost"
          placeholder="Enter visa cost"
        />

        <FormField
          name="LandPackageCost"
          label="Land Package Cost"
          placeholder="Enter land package cost"
        />

        <FormField
          name="TotalTax"
          label="Total Tax"
          placeholder="Enter total tax amount"
        />
      </View>

      {/* Tax Configuration */}
      <View className="mb-6">
        <Text className="text-md font-medium text-gray-800 mb-3">
          Tax Configuration
        </Text>

        <CheckboxField
          name="PackageWithGST"
          label="Package includes GST"
        />

        <CheckboxField
          name="PackageWithTCS"
          label="Package includes TCS"
        />

        <View className="flex-row space-x-2">
          <View className="flex-1 mr-2">
            <FormField
              name="GST"
              label="GST Amount"
              placeholder="GST amount"
            />
          </View>
          <View className="flex-1 ml-2">
            <FormField
              name="TCS"
              label="TCS Amount"
              placeholder="TCS amount"
            />
          </View>
        </View>

        <View className="flex-row space-x-2">
          <View className="flex-1 mr-2">
            <FormField
              name="GstWaivedOffAmt"
              label="GST Waived Off"
              placeholder="GST waived amount"
            />
          </View>
          <View className="flex-1 ml-2">
            <FormField
              name="TcsWaivedOffAmt"
              label="TCS Waived Off"
              placeholder="TCS waived amount"
            />
          </View>
        </View>
      </View>

      {/* Price Configuration */}
      <View className="mb-6">
        <Text className="text-md font-medium text-gray-800 mb-3">
          Price Configuration
        </Text>

        <View className="flex-row space-x-2">
          <View className="flex-1 mr-2">
            <FormField
              name="PriceType"
              label="Price Type"
              placeholder="Total/Per Person"
              keyboardType="default"
            />
          </View>
          <View className="flex-1 ml-2">
            <FormField
              name="CurrencyType"
              label="Currency"
              placeholder="Currency type"
              keyboardType="default"
            />
          </View>
        </View>
      </View>

      {/* Total Cost Display */}
      <View className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <Text className="text-md font-medium text-gray-800 mb-2">
          Total Package Cost
        </Text>
        <Controller
          control={control}
          name="TotalCost"
          render={({ field: { value } }) => (
            <Text className="text-2xl font-bold text-purple-600">
              ₹ {value || '0'}
            </Text>
          )}
        />
      </View>
    </View>
  );
};

export default CostCalculator;
