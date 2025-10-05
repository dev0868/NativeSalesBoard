// QuotationFormPager.tsx
import React, { useMemo, useRef, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';

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
  const scrollViewRef = useRef<ScrollView>(null);
  const screenH = Dimensions.get('window').height;
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

  const SectionWrapper: React.FC<{ index: number; children: React.ReactNode }> = ({ index, children }) => (
    <View style={{ height: screenH, backgroundColor: 'white', padding: 16 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {header}
          
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>
              Section {index + 1} of {sections.length}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            {children}
          </View>

          <View style={{ height: 20 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 20 }}>
            <TouchableOpacity
              onPress={() => scrollToSection(index - 1)}
              disabled={index === 0}
              style={{
                opacity: index === 0 ? 0.5 : 1,
                backgroundColor: '#e5e7eb',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: '#374151', fontWeight: '600' }}>Previous</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => scrollToSection(index + 1)}
              disabled={index === sections.length - 1}
              style={{
                opacity: index === sections.length - 1 ? 0.5 : 1,
                backgroundColor: '#7c3aed',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>
                {index === sections.length - 1 ? 'Submit' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>

          {footer}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        bounces={false}
        decelerationRate="fast"
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

      {/* Section indicators */}
      <View style={{ 
        position: 'absolute', 
        right: 16, 
        top: 60,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 12,
        padding: 8
      }}>
        {sections.map((_, i) => (
          <TouchableOpacity
            key={`dot-${i}`}
            onPress={() => scrollToSection(i)}
            style={{
              width: 8, 
              height: 8, 
              borderRadius: 4, 
              marginVertical: 4,
              backgroundColor: currentSection === i ? '#7c3aed' : '#d1d5db',
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default QuotationFormPager;
