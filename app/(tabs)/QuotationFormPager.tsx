// QuotationFormPager.tsx
import React, { useMemo, useRef, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Example: keep form state at the parent and pass setters to sections
type QuotationForm = {
  name: string;
  email: string;
  phone: string;
  destination: string;
  days: number;
  budget: string;
  notes: string;
};

type SectionProps = {
  value: QuotationForm;
  onChange: (patch: Partial<QuotationForm>) => void;
  goNext: () => void;
  goPrev: () => void;
};

type Props = {
  sections: Array<(props: SectionProps) => React.ReactElement>;
  value: QuotationForm;
  onChange: (patch: Partial<QuotationForm>) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

const QuotationFormPager: React.FC<Props> = ({ sections, value, onChange, header, footer }) => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const { height: windowHeight } = Dimensions.get('window');
  // Account for navbar (approximately 60px) and safe area
  const screenH = windowHeight - 120;
  const [currentSection, setCurrentSection] = useState(0);

  const scrollToSection = useCallback((sectionIndex: number) => {
    const clamped = Math.max(0, Math.min(sectionIndex, sections.length - 1));
    scrollViewRef.current?.scrollTo({
      y: clamped * screenH,
      animated: true,
    });
    setCurrentSection(clamped);
  }, [sections.length, screenH]);

  const handleScrollEnd = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const sectionIndex = Math.round(offsetY / screenH);
    setCurrentSection(sectionIndex);
  }, [screenH]);

  const NavBar = () => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
    }}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 8,
        }}
      >
        <Ionicons name="chevron-back" size={24} color="#374151" />
        <Text style={{ marginLeft: 4, fontSize: 16, color: '#374151' }}>Back</Text>
      </TouchableOpacity>
      
      <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937' }}>
        Create Quotation
      </Text>
      
      <View style={{ width: 60 }} />
    </View>
  );

  const SectionWrapper: React.FC<{ index: number; children: React.ReactNode }> = ({ index, children }) => (
    <View style={{ height: screenH, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Section Header */}
        <View style={{ 
          paddingHorizontal: 16, 
          paddingVertical: 12, 
          backgroundColor: '#f9fafb',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb'
        }}>
          <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
            Section {index + 1} of {sections.length}
          </Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, padding: 16 }}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {header}
          
          <View style={{ flex: 1 }}>
            {children}
          </View>
        </ScrollView>

        {/* Fixed Bottom Navigation */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          padding: 16,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6'
        }}>
          <TouchableOpacity
            onPress={() => scrollToSection(index - 1)}
            disabled={index === 0}
            style={{
              opacity: index === 0 ? 0.5 : 1,
              backgroundColor: '#e5e7eb',
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 12,
              minWidth: 100,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#374151', fontWeight: '600', fontSize: 16 }}>Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => scrollToSection(index + 1)}
            disabled={index === sections.length - 1}
            style={{
              backgroundColor: '#7c3aed',
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 12,
              minWidth: 100,
              alignItems: 'center',
              shadowColor: '#7c3aed',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
              {index === sections.length - 1 ? 'Submit' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>

        {footer && (
          <View style={{ padding: 16, paddingTop: 0 }}>
            {footer}
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <NavBar />
      
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        bounces={false}
        decelerationRate={0.65}
        snapToInterval={screenH}
        snapToAlignment="start"
        disableIntervalMomentum={false}
      >
        {sections.map((Section, i) => (
          <SectionWrapper key={`section-${i}`} index={i}>
            <Section
              value={value}
              onChange={onChange}
              goNext={() => scrollToSection(i + 1)}
              goPrev={() => scrollToSection(i - 1)}
            />
          </SectionWrapper>
        ))}
      </ScrollView>

      {/* Section Indicators */}
      <View style={{
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -((sections.length * 12) / 2) }],
        alignItems: 'center',
      }}>
        {sections.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => scrollToSection(i)}
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: i === currentSection ? '#7c3aed' : '#d1d5db',
              marginVertical: 4,
            }}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default QuotationFormPager;
