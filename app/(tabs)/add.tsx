import React from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from '@expo/vector-icons';
import Navbar from "@/components/Navbar";

const DestinationList = [
  { DestinationName: "Bali" },
  { DestinationName: "Maldives" },
  { DestinationName: "Dubai" },
  { DestinationName: "Thailand" },
  { DestinationName: "Singapore" },
  { DestinationName: "Japan" },
  { DestinationName: "Europe" },
  { DestinationName: "Switzerland" },
  { DestinationName: "Paris" },
  { DestinationName: "London" },
];

export default function AddScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Form Submitted:", data);
    Alert.alert(
      'Success',
      'Lead created successfully!',
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

  return (
    <View style={styles.mainContainer}>
      <Navbar 
        title="Add New Lead"
        subtitle="Create a new customer lead"
        showSearch={false}
        showNotifications={false}
      />
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Personal Information Section */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="bg-purple-100 rounded-full p-2 mr-3">
              <Ionicons name="person" size={20} color="#7c3aed" />
            </View>
            <Text className="text-xl font-bold text-gray-900">Personal Information</Text>
          </View>
          
          <FormField label="Full Name" required error={errors.FullName}>
            <Controller
              control={control}
              name="FullName"
              rules={{ required: "Name is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.FullName && styles.errorInput]}
                  placeholder="Enter full name"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>

          <FormField label="Contact Number" required error={errors.Contact}>
            <Controller
              control={control}
              name="Contact"
              rules={{
                required: "Contact is required",
                minLength: { value: 10, message: "Enter 10 digits" },
              }}
              render={({ field: { onChange, value } }) => (
                <View className="flex-row items-center">
                  <View className="bg-gray-100 rounded-l-lg px-3 py-4 border-r border-gray-200">
                    <Text className="text-gray-600 font-medium">+91</Text>
                  </View>
                  <TextInput
                    style={[styles.inputWithPrefix, errors.Contact && styles.errorInput]}
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

          <FormField label="Email Address" required error={errors.Email}>
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
        </View>

        {/* Travel Information Section */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 rounded-full p-2 mr-3">
              <Ionicons name="airplane" size={20} color="#3b82f6" />
            </View>
            <Text className="text-xl font-bold text-gray-900">Travel Information</Text>
          </View>
          
          <FormField label="Destination" required error={errors.DestinationName}>
            <Controller
              control={control}
              name="DestinationName"
              rules={{ required: "Destination is required" }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={value}
                    style={styles.picker}
                    onValueChange={onChange}
                  >
                    <Picker.Item label="Select destination" value="" />
                    {DestinationList.map((ele, idx) => (
                      <Picker.Item
                        label={ele.DestinationName}
                        value={ele.DestinationName}
                        key={idx}
                      />
                    ))}
                  </Picker>
                </View>
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
          
          <View className="flex-row space-x-3">
            <View className="flex-1">
              <FormField label="Duration (Days)" error={errors.Days}>
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
              <FormField label="Travel Date" error={errors.TravelDate}>
                <Controller
                  control={control}
                  name="TravelDate"
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
        </View>

        {/* Additional Details Section */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="bg-green-100 rounded-full p-2 mr-3">
              <Ionicons name="information-circle" size={20} color="#10b981" />
            </View>
            <Text className="text-xl font-bold text-gray-900">Additional Details</Text>
          </View>
          
          <FormField label="Lead Source" required error={errors.LeadSource}>
            <Controller
              control={control}
              name="LeadSource"
              rules={{ required: "Lead Source is required" }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={value}
                    style={styles.picker}
                    onValueChange={onChange}
                  >
                    <Picker.Item label="Select lead source" value="" />
                    <Picker.Item label="Direct" value="Direct" />
                    <Picker.Item label="Agency" value="Agency" />
                    <Picker.Item label="Instagram" value="Instagram" />
                    <Picker.Item label="WhatsApp" value="WhatsApp" />
                    <Picker.Item label="Facebook" value="Facebook" />
                    <Picker.Item label="Referral" value="Referral" />
                  </Picker>
                </View>
              )}
            />
          </FormField>
          
          <View className="flex-row space-x-3">
            <View className="flex-1">
              <FormField label="Adults" error={errors.NoOfPax}>
                <Controller
                  control={control}
                  name="NoOfPax"
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
              <FormField label="Children" error={errors.Child}>
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
                    placeholder="Enter budget amount"
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

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-purple-600 rounded-2xl py-4 px-6 shadow-lg"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="add-circle" size={24} color="white" />
            <Text className="text-white font-bold text-lg ml-2">Create Lead</Text>
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
});
