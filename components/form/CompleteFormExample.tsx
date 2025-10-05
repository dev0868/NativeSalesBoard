import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import IntegratedQuotationForm from './IntegratedQuotationForm';
import { QuotationFormData } from './index';

// Complete example showing how to use the integrated quotation form
const CompleteFormExample: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  // Example lead data structure
  const exampleLead = {
    TripId: 'TRP001',
    ClientLeadDetails: {
      FullName: 'John Doe',
      Contact: '+91 9876543210',
      Email: 'john.doe@example.com',
      TravelDate: '2024-12-15',
      Pax: '2',
      Child: '1',
      Infant: '0',
      Budget: '150000',
      DepartureCity: 'Delhi',
      DestinationName: 'Goa',
      Days: 5,
    },
    AssignDate: '2024-10-05',
  };

  const handleFormSubmit = (data: QuotationFormData) => {
    console.log('Quotation Form Data:', JSON.stringify(data, null, 2));
    
    // Here you would typically:
    // 1. Validate the data
    // 2. Send to your API
    // 3. Handle success/error responses
    
    Alert.alert(
      'Success',
      'Quotation created successfully!',
      [
        {
          text: 'OK',
          onPress: () => setShowForm(false)
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-100 justify-center items-center p-4">
      <View className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Quotation System
        </Text>
        
        <Text className="text-gray-600 mb-6 text-center">
          Create comprehensive travel quotations with multiple sections
        </Text>
        
        <TouchableOpacity
          onPress={() => setShowForm(true)}
          className="bg-purple-600 px-6 py-4 rounded-lg mb-4"
        >
          <Text className="text-white font-medium text-lg text-center">
            Create New Quotation
          </Text>
        </TouchableOpacity>

        <View className="bg-gray-50 p-4 rounded-lg">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Form Features:
          </Text>
          <Text className="text-xs text-gray-600 mb-1">• Basic customer & trip details</Text>
          <Text className="text-xs text-gray-600 mb-1">• Cost calculator with auto-totals</Text>
          <Text className="text-xs text-gray-600 mb-1">• Hotels with add/delete functionality</Text>
          <Text className="text-xs text-gray-600 mb-1">• Inclusions & exclusions management</Text>
          <Text className="text-xs text-gray-600 mb-1">• Flight information</Text>
          <Text className="text-xs text-gray-600">• Day-wise itinerary builder</Text>
        </View>
      </View>

      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <IntegratedQuotationForm
          onSubmit={handleFormSubmit}
          lead={exampleLead}
        />
      </Modal>
    </View>
  );
};

export default CompleteFormExample;
