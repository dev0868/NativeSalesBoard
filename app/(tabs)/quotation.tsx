import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from '@expo/vector-icons';
import Navbar from "@/components/Navbar";

const DestinationList = [
  "Europe", "Georgia", "Kerala", "Maldives", "Srilanka", "Mauritius", 
  "Dubai", "Andaman", "Thailand", "Japan", "Rajasthan", "Northeast", 
  "Kashmir", "Himachal", "Ladakh", "Bali", "Turkey", "Malaysia", 
  "Vietnam", "Singapore", "Goa"
];

const CurrencyList = ["USD", "INR", "EUR", "GBP"];

const AlternativeContactsList = [
  "WhatsApp", "Email", "Phone", "Instagram", "Facebook", "Telegram"
];

interface QuotationFormData {
  TripId: string;
  Name: string;
  ContactNo: string;
  Email: string;
  Destination: string;
  TravelDate: string;
  DepartureCity: string;
  AssignDate: string;
  Pax: string;
  Child: string;
  Budget: string;
  Infants: string;
  Days: string;
  Nights: string;
  Currency: string;
  PerPerson: string;
  PerCouple: string;
  Total: string;
  FlightCost: string;
  VisaCost: string;
  LandPackageCost: string;
  TotalCost: string;
}

export default function QuotationScreen() {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuotationFormData>({
    defaultValues: {
      TripId: "254826160",
      AssignDate: "2025-09-30",
      Currency: "USD",
      Days: "",
      Nights: "",
      Name: "",
      ContactNo: "",
      Email: "",
      Destination: "",
      TravelDate: "",
      DepartureCity: "",
      Pax: "",
      Child: "",
      Budget: "",
      Infants: "",
      PerPerson: "",
      PerCouple: "",
      Total: "",
      FlightCost: "",
      VisaCost: "",
      LandPackageCost: "",
      TotalCost: "",
    }
  });

  const [selectedOtherDestinations, setSelectedOtherDestinations] = useState<string[]>([]);
  const [selectedAlternativeContacts, setSelectedAlternativeContacts] = useState<string[]>([]);
  
  const watchedDays = watch("Days");
  const watchedNights = watch("Nights");
  const watchedFlightCost = watch("FlightCost");
  const watchedVisaCost = watch("VisaCost");
  const watchedLandPackageCost = watch("LandPackageCost");

  // Auto-calculate nights when days change
  useEffect(() => {
    if (watchedDays && !isNaN(Number(watchedDays))) {
      const nights = Math.max(0, Number(watchedDays) - 1);
      setValue("Nights", nights.toString());
    }
  }, [watchedDays, setValue]);

  // Auto-calculate days when nights change
  useEffect(() => {
    if (watchedNights && !isNaN(Number(watchedNights))) {
      const days = Number(watchedNights) + 1;
      setValue("Days", days.toString());
    }
  }, [watchedNights, setValue]);

  // Auto-calculate total cost
  useEffect(() => {
    const flight = Number(watchedFlightCost) || 0;
    const visa = Number(watchedVisaCost) || 0;
    const landPackage = Number(watchedLandPackageCost) || 0;
    const total = flight + visa + landPackage;
    setValue("TotalCost", total.toString());
  }, [watchedFlightCost, watchedVisaCost, watchedLandPackageCost, setValue]);

  const onSubmit = (data: any) => {
    const formData = {
      ...data,
      OtherDestinations: selectedOtherDestinations,
      AlternativeContacts: selectedAlternativeContacts,
    };
    console.log("Quotation Form Submitted:", formData);
    Alert.alert(
      'Success',
      'Quotation created successfully!',
      [{ text: 'OK' }]
    );
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
    <View className="mb-6">
      <Text className="text-gray-700 font-semibold mb-2 text-base">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
      {children}
      {error && <Text className="text-red-500 text-sm mt-1">{error.message}</Text>}
    </View>
  );

  const MultiSelectField = ({ 
    label, 
    options, 
    selectedValues, 
    onSelectionChange,
    allowCustom = false,
    placeholder = "Select options"
  }: {
    label: string;
    options: string[];
    selectedValues: string[];
    onSelectionChange: (values: string[]) => void;
    allowCustom?: boolean;
    placeholder?: string;
  }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [customInput, setCustomInput] = useState("");
    const [allOptions, setAllOptions] = useState(options);

    const addCustomOption = () => {
      if (customInput.trim() && !allOptions.includes(customInput.trim())) {
        const newOptions = [...allOptions, customInput.trim()];
        setAllOptions(newOptions);
        onSelectionChange([...selectedValues, customInput.trim()]);
        setCustomInput("");
      }
    };

    const removeSelectedItem = (item: string) => {
      onSelectionChange(selectedValues.filter(v => v !== item));
    };

    return (
      <View className="mb-6">
        <Text className="text-gray-700 font-semibold mb-2 text-base">{label}</Text>
        
        {/* Selected Items Display */}
        <View className="flex-row flex-wrap mb-2">
          {selectedValues.map((item) => (
            <View key={item} className="bg-purple-100 border border-purple-300 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center">
              <Text className="text-purple-700 text-sm mr-1">{item}</Text>
              <TouchableOpacity onPress={() => removeSelectedItem(item)}>
                <Ionicons name="close-circle" size={16} color="#7c3aed" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Select Button */}
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={styles.multiSelectButton}
        >
          <Text className="text-gray-600 flex-1">
            {selectedValues.length > 0 
              ? `${selectedValues.length} selected` 
              : placeholder
            }
          </Text>
          <Ionicons name="chevron-down" size={20} color="#6b7280" />
        </TouchableOpacity>

        {/* Modal for Selection */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View className="flex-1 bg-white">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text className="text-purple-600 font-semibold text-lg">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-lg font-bold">{label}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text className="text-purple-600 font-semibold text-lg">Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
              {/* Custom Input Section */}
              {allowCustom && (
                <View className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <Text className="text-gray-700 font-semibold mb-2">Add Custom Option</Text>
                  <View className="flex-row">
                    <TextInput
                      style={[styles.input, { flex: 1, marginRight: 10 }]}
                      placeholder="Enter custom option"
                      value={customInput}
                      onChangeText={setCustomInput}
                      placeholderTextColor="#9ca3af"
                    />
                    <TouchableOpacity
                      onPress={addCustomOption}
                      className="bg-purple-600 rounded-lg px-4 py-3 justify-center"
                    >
                      <Text className="text-white font-semibold">Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Options List */}
              {allOptions.map((option) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      if (isSelected) {
                        onSelectionChange(selectedValues.filter(v => v !== option));
                      } else {
                        onSelectionChange([...selectedValues, option]);
                      }
                    }}
                    className={`flex-row items-center justify-between p-4 mb-2 rounded-lg border ${
                      isSelected 
                        ? 'bg-purple-50 border-purple-300' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text className={`text-base ${
                      isSelected ? 'text-purple-700 font-semibold' : 'text-gray-700'
                    }`}>
                      {option}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color="#7c3aed" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Navbar 
        title="Create Quotation"
        subtitle="Generate travel quotation"
        showSearch={false}
        showNotifications={false}
      />
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Details Section */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 rounded-full p-2 mr-3">
              <Ionicons name="document-text" size={20} color="#3b82f6" />
            </View>
            <Text className="text-xl font-bold text-gray-900">Basic Details</Text>
          </View>
          
          <FormField label="Trip ID" error={errors.TripId}>
            <Controller
              control={control}
              name="TripId"
              render={({ field: { value } }) => (
                <TextInput
                  style={[styles.input, styles.readOnlyInput]}
                  value={value}
                  editable={false}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>

          <FormField label="Name" required error={errors.Name}>
            <Controller
              control={control}
              name="Name"
              rules={{ required: "Name is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.Name && styles.errorInput]}
                  placeholder="Enter customer name"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>

          <FormField label="Contact No" required error={errors.ContactNo}>
            <Controller
              control={control}
              name="ContactNo"
              rules={{
                required: "Contact number is required",
                minLength: { value: 10, message: "Enter 10 digits" },
              }}
              render={({ field: { onChange, value } }) => (
                <View className="flex-row items-center">
                  <View className="bg-gray-100 rounded-l-lg px-3 py-4 border-r border-gray-200">
                    <Text className="text-gray-600 font-medium">+91</Text>
                  </View>
                  <TextInput
                    style={[styles.inputWithPrefix, errors.ContactNo && styles.errorInput]}
                    placeholder="Enter 10-digit number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              )}
            />
          </FormField>

          <FormField label="Email" required error={errors.Email}>
            <Controller
              control={control}
              name="Email"
              rules={{ 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Enter a valid email address"
                }
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.Email && styles.errorInput]}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>

          <FormField label="Destination" required error={errors.Destination}>
            <Controller
              control={control}
              name="Destination"
              rules={{ required: "Destination is required" }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={value}
                    style={styles.picker}
                    onValueChange={onChange}
                  >
                    <Picker.Item label="Select destination" value="" />
                    {DestinationList.map((destination, idx) => (
                      <Picker.Item
                        label={destination}
                        value={destination}
                        key={idx}
                      />
                    ))}
                  </Picker>
                </View>
              )}
            />
          </FormField>

          <FormField label="Travel Dates" required error={errors.TravelDate}>
            <Controller
              control={control}
              name="TravelDate"
              rules={{ required: "Travel date is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.TravelDate && styles.errorInput]}
                  placeholder="DD/MM/YYYY"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>

          <FormField label="Departure City" error={errors.DepartureCity}>
            <Controller
              control={control}
              name="DepartureCity"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Enter departure city"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>

          <FormField label="Assign Date" error={errors.AssignDate}>
            <Controller
              control={control}
              name="AssignDate"
              render={({ field: { value } }) => (
                <TextInput
                  style={[styles.input, styles.readOnlyInput]}
                  value={value}
                  editable={false}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>

          <View className="flex-row space-x-3">
            <View className="flex-1">
              <FormField label="Pax" error={errors.Pax}>
                <Controller
                  control={control}
                  name="Pax"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Number of adults"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>
            
            <View className="flex-1">
              <FormField label="Child" error={errors.Child}>
                <Controller
                  control={control}
                  name="Child"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Number of children"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>
          </View>

          <View className="flex-row space-x-3">
            <View className="flex-1">
              <FormField label="Budget" error={errors.Budget}>
                <Controller
                  control={control}
                  name="Budget"
                  render={({ field: { onChange, value } }) => (
                    <View className="flex-row items-center">
                      <View className="bg-gray-100 rounded-l-lg px-3 py-4 border-r border-gray-200">
                        <Text className="text-gray-600 font-medium">₹</Text>
                      </View>
                      <TextInput
                        style={[styles.inputWithPrefix, errors.Budget && styles.errorInput]}
                        placeholder="Enter budget"
                        keyboardType="numeric"
                        value={value}
                        onChangeText={onChange}
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                  )}
                />
              </FormField>
            </View>
            
            <View className="flex-1">
              <FormField label="Infants" error={errors.Infants}>
                <Controller
                  control={control}
                  name="Infants"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Number of infants"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>
          </View>

          <MultiSelectField
            label="Other Destinations"
            options={DestinationList}
            selectedValues={selectedOtherDestinations}
            onSelectionChange={setSelectedOtherDestinations}
            placeholder="Select additional destinations"
          />

          <MultiSelectField
            label="Alternative Contacts"
            options={AlternativeContactsList}
            selectedValues={selectedAlternativeContacts}
            onSelectionChange={setSelectedAlternativeContacts}
            allowCustom={true}
            placeholder="Select or add contact methods"
          />
        </View>

        {/* Pricing Section */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="bg-green-100 rounded-full p-2 mr-3">
              <Ionicons name="calculator" size={20} color="#10b981" />
            </View>
            <Text className="text-xl font-bold text-gray-900">Pricing</Text>
          </View>

          <View className="flex-row space-x-3">
            <View className="flex-1">
              <FormField label="Days" error={errors.Days}>
                <Controller
                  control={control}
                  name="Days"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Enter days"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>
            
            <View className="flex-1">
              <FormField label="Nights" error={errors.Nights}>
                <Controller
                  control={control}
                  name="Nights"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Enter nights"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>
          </View>

          <FormField label="Currency" error={errors.Currency}>
            <Controller
              control={control}
              name="Currency"
              render={({ field: { onChange, value } }) => (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={value}
                    style={styles.picker}
                    onValueChange={onChange}
                  >
                    {CurrencyList.map((currency, idx) => (
                      <Picker.Item
                        label={currency}
                        value={currency}
                        key={idx}
                      />
                    ))}
                  </Picker>
                </View>
              )}
            />
          </FormField>

          <View className="flex-row space-x-3">
            <View className="flex-1">
              <FormField label="Per Person" error={errors.PerPerson}>
                <Controller
                  control={control}
                  name="PerPerson"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Cost per person"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>
            
            <View className="flex-1">
              <FormField label="Per Couple" error={errors.PerCouple}>
                <Controller
                  control={control}
                  name="PerCouple"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Cost per couple"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </FormField>
            </View>
          </View>

          <FormField label="Total" error={errors.Total}>
            <Controller
              control={control}
              name="Total"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Total amount"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>

          {/* Cost Breakdown */}
          <View className="bg-gray-50 rounded-lg p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Cost Breakdown</Text>
            
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-700 font-medium flex-1">Flight Cost:</Text>
              <Controller
                control={control}
                name="FlightCost"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, { flex: 2, marginLeft: 10 }]}
                    placeholder="0"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#9ca3af"
                  />
                )}
              />
            </View>

            <View className="flex-row items-center justify-center mb-2">
              <Text className="text-2xl font-bold text-green-600">+</Text>
            </View>

            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-700 font-medium flex-1">Visa Cost:</Text>
              <Controller
                control={control}
                name="VisaCost"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, { flex: 2, marginLeft: 10 }]}
                    placeholder="0"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#9ca3af"
                  />
                )}
              />
            </View>

            <View className="flex-row items-center justify-center mb-2">
              <Text className="text-2xl font-bold text-green-600">+</Text>
            </View>

            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-700 font-medium flex-1">Land Package Cost:</Text>
              <Controller
                control={control}
                name="LandPackageCost"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, { flex: 2, marginLeft: 10 }]}
                    placeholder="0"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#9ca3af"
                  />
                )}
              />
            </View>

            <View className="border-t border-gray-300 pt-3 mt-3">
              <View className="flex-row items-center justify-center mb-2">
                <Text className="text-2xl font-bold text-blue-600">=</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-gray-800">Total Cost:</Text>
                <Controller
                  control={control}
                  name="TotalCost"
                  render={({ field: { value } }) => (
                    <View className="bg-blue-100 rounded-lg px-4 py-2">
                      <Text className="text-lg font-bold text-blue-800">
                        {watch("Currency")} {value || "0"}
                      </Text>
                    </View>
                  )}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-purple-600 rounded-2xl py-4 px-6 shadow-lg"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="document-text" size={24} color="white" />
            <Text className="text-white font-bold text-lg ml-2">Create Quotation</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#1f2937',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputWithPrefix: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  readOnlyInput: {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
  },
  errorInput: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  picker: {
    height: 56,
    color: '#1f2937',
  },
  multiSelectButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
