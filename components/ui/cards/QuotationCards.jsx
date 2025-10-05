import { Ionicons } from '@expo/vector-icons'
import React, { useState, useRef } from 'react'
import { Text, TouchableOpacity, Animated, PanResponder, Alert } from 'react-native'
import { View, ScrollView, Dimensions } from 'react-native'
import QuotationModal from '../QuotationModal'
import LastQuotesModal from '../LastQuotesModal'

const QuotationCards = ({ leadData }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLastQuotesModalVisible, setIsLastQuotesModalVisible] = useState(false);
    const scrollViewRef = useRef(null);
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = screenWidth - 32; // Account for margins

    const scrollToPage = (pageIndex) => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                x: pageIndex * cardWidth,
                animated: true,
            });
            setCurrentPage(pageIndex);
        }
    };

    const handleScrollEnd = (event) => {
        const contentOffset = event.nativeEvent.contentOffset;
        const pageIndex = Math.round(contentOffset.x / cardWidth);
        setCurrentPage(pageIndex);
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        },
        onPanResponderRelease: (evt, gestureState) => {
            const { dx } = gestureState;
            if (dx > 50 && currentPage > 0) {
                // Swipe right - go to previous page
                scrollToPage(currentPage - 1);
            } else if (dx < -50 && currentPage < 1) {
                // Swipe left - go to next page
                scrollToPage(currentPage + 1);
            }
        },
    });

    const handleQuotationSubmit = (quotationData) => {
        console.log('Quotation submitted:', quotationData);
        Alert.alert(
            'Success',
            'Quotation created successfully!',
            [{ text: 'OK' }]
        );
    };

    const handleCreateQuotation = () => {
        // Pre-fill form with customer data from the lead
        const initialData = {
            customerName: leadData?.['Client-Name'] || 'Unknown',
            contactNumber: leadData?.['Client-Contact'] || '',
            destination: leadData?.['Client-Destination'] || '',
            departure: leadData?.['Client-DepartureCity'] || '',
            adults: leadData?.['Client-Pax']?.toString() || '0',
            children: leadData?.['Client-Child']?.toString() || '0',
            budget: '0', // You might want to add budget field to your lead data
        };
        setIsModalVisible(true);
    };

    const handleLastQuotesClick = () => {
        setIsLastQuotesModalVisible(true);
    };

    const handleUseQuote = (quote) => {
        console.log('Using quote:', quote);
        Alert.alert(
            'Quote Selected',
            `You have selected the quote for ${quote.destination} (${quote.tripId}) with total amount ₹${quote.total.toLocaleString()}`,
            [{ text: 'OK' }]
        );
        // Here you could navigate to edit the quote or create a new quotation based on this quote
    };

    const QuotaionButton = () => {
        return (
            <View className="flex-row justify-between">
                <TouchableOpacity 
                    className="bg-purple-100 rounded-lg px-4 py-2 flex-1 mr-2"
                    onPress={handleLastQuotesClick}
                >
                    <Text className="text-purple-600 font-medium text-center">Last 10 Quotes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="bg-green-500 rounded-lg px-4 py-2 flex-1 ml-2"
                    onPress={handleCreateQuotation}
                >
                    <Text className="text-white font-medium text-center">Create Quote</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <>
        <View className="bg-white rounded-2xl mb-4 shadow-sm overflow-hidden h-auto">
            <View {...panResponder.panHandlers}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScrollEnd}
                    scrollEventThrottle={16}
                >
                    {/* Main Card Content */}
                    <View style={{ width: cardWidth }} className="p-4">
                        <View className="flex-row items-center justify-between mb-3">
                            <View className='flex gap-[1rem] flex-row items-center'>
                                <View className="bg-purple-100 rounded-full p-2">
                                    <Ionicons name="airplane" size={20} color="#7c3aed" />
                                </View>
                                <View className='flex flex-col'>
                                    <Text className="text-gray-500 text-sm">
                                        {leadData?.CompanyId || 'Lead'} - {leadData?.SalesStatus || 'New'}
                                    </Text>
                                    <Text className="text-gray-500 text-sm">
                                        {leadData?.['Client-Name'] || 'Unknown Client'}
                                    </Text>
                                </View>
                            </View>

                            {/* Right Arrow Button */}
                            <TouchableOpacity
                                onPress={() => scrollToPage(1)}
                                className="bg-gray-100 rounded-full p-2"
                            >
                                <Ionicons name="chevron-forward" size={16} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-gray-600 text-sm mb-1">Contact</Text>
                        <Text className="text-gray-900 font-semibold mb-3">
                            {leadData?.['Client-Contact'] || 'No contact'}
                        </Text>

                        <View className="flex-row justify-between mb-3">
                            <View>
                                <Text className="text-gray-500 text-xs">Destination</Text>
                                <Text className="text-gray-900 font-medium">
                                    {leadData?.['Client-Destination'] || 'Not specified'}
                                </Text>
                            </View>
                            <View>
                                <Text className="text-gray-500 text-xs">Departure</Text>
                                <Text className="text-gray-900 font-medium">
                                    {leadData?.['Client-DepartureCity'] || 'Not specified'}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between mb-4">
                            <View>
                                <Text className="text-gray-500 text-xs">Adults</Text>
                                <Text className="text-gray-900 font-medium">
                                    {leadData?.['Client-Pax'] || 0}
                                </Text>
                            </View>
                            <View>
                                <Text className="text-gray-500 text-xs">Children</Text>
                                <Text className="text-gray-900 font-medium">
                                    {leadData?.['Client-Child'] || 0}
                                </Text>
                            </View>
                            <View>
                                <Text className="text-gray-500 text-xs">Days</Text>
                                <Text className="text-gray-900 font-medium">
                                    {leadData?.['Client-Days'] || 0}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between mb-4">
                            <View>
                                <Text className="text-gray-500 text-xs">Travel Date</Text>
                                <Text className="text-gray-900 font-medium">
                                    {leadData?.['Client-TravelDate'] ? 
                                        new Date(leadData['Client-TravelDate']).toLocaleDateString() : 
                                        'Not set'
                                    }
                                </Text>
                            </View>
                            <View>
                                <Text className="text-gray-500 text-xs">Lead Source</Text>
                                <Text className="text-gray-900 font-medium">
                                    {leadData?.LeadSource || 'Unknown'}
                                </Text>
                            </View>
                        </View>

                        <Text className="text-gray-600 text-sm mb-1">Budget</Text>
                        <Text className="text-purple-600 text-2xl font-bold mb-4">
                            {leadData?.['Client-Budget'] && leadData['Client-Budget'] > 0 
                                ? `₹${leadData['Client-Budget'].toLocaleString()}` 
                                : 'Budget not specified'
                            }
                        </Text>

                        <QuotaionButton />
                    </View>

                    {/* Additional Details Card */}
                    <View style={{ width: cardWidth }} className="p-4">
                        <View className="flex-row items-center justify-between mb-3">
                            <TouchableOpacity
                                onPress={() => scrollToPage(0)}
                                className="bg-gray-100 rounded-full p-2"
                            >
                                <Ionicons name="chevron-back" size={16} color="#6b7280" />
                            </TouchableOpacity>
                            <View className='flex gap-[1rem] flex-row-reverse items-center'>
                                <View className='flex flex-col'>
                                    <Text className="text-gray-500 text-sm">
                                        {leadData?.CompanyId || 'Lead'} - {leadData?.SalesStatus || 'New'}
                                    </Text>
                                    <Text className="text-gray-500 text-sm">
                                        {leadData?.['Client-Name'] || 'Unknown Client'}
                                    </Text>
                                </View>
                                <View className="bg-purple-100 rounded-full p-2">
                                    <Ionicons name="airplane" size={20} color="#7c3aed" />
                                </View>
                            </View>              <View className="w-8" />
                        </View>

                        <View className="space-y-4">
                            <View className="bg-gray-50 rounded-lg p-3 mb-4">
                                <Text className="text-gray-600 text-sm mb-2">Email</Text>
                                <Text className="text-gray-900 font-medium">
                                    {leadData?.['Client-Email'] || 'No email provided'}
                                </Text>
                            </View>

                    

                            <View className="bg-gray-50 rounded-lg p-3">
                                <Text className="text-gray-600 text-sm mb-2">Comments</Text>
                                <Text className="text-gray-900 font-medium min-h-[6rem]">
                                    {leadData?.Comments && leadData.Comments.length > 0 
                                        ? leadData.Comments[leadData.Comments.length - 1].Message 
                                        : 'No comments available'
                                    }
                                </Text>
                            </View>
                        </View>
                 

                        <QuotaionButton />

                    </View>
                </ScrollView>
            </View>

            {/* Page Indicator */}
            <View className="flex-row justify-center pb-3">
                <View className={`w-2 h-2 rounded-full mx-1 ${currentPage === 0 ? 'bg-purple-600' : 'bg-gray-300'}`} />
                <View className={`w-2 h-2 rounded-full mx-1 ${currentPage === 1 ? 'bg-purple-600' : 'bg-gray-300'}`} />
            </View>
        </View>
        
        <QuotationModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onSubmit={handleQuotationSubmit}
            initialData={{
                customerName: leadData?.['Client-Name'] || '',
                contactNumber: leadData?.['Client-Contact'] || '',
                destination: leadData?.['Client-Destination'] || '',
                departure: leadData?.['Client-DepartureCity'] || '',
                adults: leadData?.['Client-Pax']?.toString() || '0',
                children: leadData?.['Client-Child']?.toString() || '0',
                budget: '0',
            }}
        />
        
        <LastQuotesModal
            visible={isLastQuotesModalVisible}
            onClose={() => setIsLastQuotesModalVisible(false)}
            onUseQuote={handleUseQuote}
        />
        </>
    );
}

export default QuotationCards