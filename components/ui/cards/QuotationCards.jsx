import { Ionicons } from '@expo/vector-icons'
import React, { useState, useRef } from 'react'
import { Text, TouchableOpacity, Animated, PanResponder, Alert } from 'react-native'
import { View, ScrollView, Dimensions } from 'react-native'
import QuotationModal from '../QuotationModal'
import LastQuotesModal from '../LastQuotesModal'

const QuotationCards = () => {
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
        // Pre-fill form with customer data from the card
        const initialData = {
            customerName: 'Rajesh Kumar',
            contactNumber: '9876543210',
            destination: 'Thailand',
            departure: 'Mumbai',
            adults: '2',
            children: '1',
            budget: '85000',
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
                                    <Text className="text-gray-500 text-sm">Trip #24273087</Text>
                                    <Text className="text-gray-500 text-sm">Rajesh Kumar</Text>
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
                        <Text className="text-gray-900 font-semibold mb-3">9876543210</Text>

                        <View className="flex-row justify-between mb-3">
                            <View>
                                <Text className="text-gray-500 text-xs">Destination</Text>
                                <Text className="text-gray-900 font-medium">Thailand</Text>
                            </View>
                            <View>
                                <Text className="text-gray-500 text-xs">Departure</Text>
                                <Text className="text-gray-900 font-medium">Mumbai</Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between mb-4">
                            <View>
                                <Text className="text-gray-500 text-xs">Pax</Text>
                                <Text className="text-gray-900 font-medium">2</Text>
                            </View>
                            <View>
                                <Text className="text-gray-500 text-xs">Child</Text>
                                <Text className="text-gray-900 font-medium">1</Text>
                            </View>
                        </View>

                        <Text className="text-gray-600 text-sm mb-1">Budget</Text>
                        <Text className="text-purple-600 text-2xl font-bold mb-4">₹85,000</Text>

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
                                    <Text className="text-gray-500 text-sm">Trip #24273087</Text>
                                    <Text className="text-gray-500 text-sm">Rajesh Kumar</Text>
                                </View>
                                <View className="bg-purple-100 rounded-full p-2">
                                    <Ionicons name="airplane" size={20} color="#7c3aed" />
                                </View>
                            </View>              <View className="w-8" />
                        </View>

                        <View className="space-y-4">
                          

                            <View className="bg-gray-50 rounded-lg p-3">
                                <Text className="text-gray-600 text-sm mb-1">Notes</Text>
                                <Text className="text-gray-900 font-medium min-h-[9rem]">Vegetarian meals, Airport transfers Airport transfersAirport transfersAirport transfersAirport transfersAirport transfersAirport transfers</Text>
                            </View>
                        </View>
                        <br />

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
                customerName: 'Rajesh Kumar',
                contactNumber: '9876543210',
                destination: 'Thailand',
                departure: 'Mumbai',
                adults: '2',
                children: '1',
                budget: '85000',
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