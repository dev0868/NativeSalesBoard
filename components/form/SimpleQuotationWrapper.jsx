import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SectionDef = { key: string; Component: React.ComponentType<any> };

interface Props {
  sections: SectionDef[];            // ✅ stable array like [{ key:'basic', Component: BasicDetails }, ...]
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onSubmit?: () => void;             // ✅ call when last step pressed
}

const SimpleQuotationWrapper: React.FC<Props> = ({
  sections,
  header,
  footer,
  onSubmit,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentSection, setCurrentSection] = useState(0);

  const goToSection = useCallback(
    (sectionIndex: number) => {
      const clamped = Math.max(0, Math.min(sectionIndex, sections.length - 1));
      setCurrentSection(clamped);
    },
    [sections.length]
  );

  // Render only the current section, but keep identity via { key, Component }
  const { Component } = sections[currentSection];

  const handlePrimary = useCallback(() => {
    const isLast = currentSection === sections.length - 1;
    if (isLast) {
      onSubmit?.();                   // ✅ submit when on last
    } else {
      goToSection(currentSection + 1);
    }
  }, [currentSection, sections.length, goToSection, onSubmit]);

  return (
    <View style={{ flex: 1, backgroundColor: '#7c3aed' }}>
      {/* Header */}
      <LinearGradient
        colors={['#7c3aed', '#5b21b6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: insets.top + 2,
          paddingBottom: 2,
          paddingHorizontal: 16,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 20,
              padding: 8,
            }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            Create Quotation
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 0, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"   // ✅ keeps keyboard while tapping inside
          >
            {header}
            <View style={{ flex: 1 }}>
              {/* 🚫 no value / onChange props; sections read/write via RHF context */}
              <Component />
            </View>
          </ScrollView>

          {/* Bottom Navigation */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 16,
              backgroundColor: 'white',
              borderTopWidth: 1,
              borderTopColor: '#f3f4f6',
            }}
          >
            <TouchableOpacity
              onPress={() => goToSection(currentSection - 1)}
              disabled={currentSection === 0}
              style={{
                opacity: currentSection === 0 ? 0.5 : 1,
                backgroundColor: '#e5e7eb',
                paddingVertical: 14,
                paddingHorizontal: 24,
                borderRadius: 12,
                minWidth: 100,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#374151', fontWeight: '600', fontSize: 16 }}>
                Previous
              </Text>
            </TouchableOpacity>

              {/* Primary button now submits on last step */}
            <TouchableOpacity
              onPress={handlePrimary}
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
                elevation: 3,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
                {currentSection === sections.length - 1 ? 'Submit' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>

          {footer && <View style={{ padding: 16, paddingTop: 0 }}>{footer}</View>}
        </KeyboardAvoidingView>
      </View>

      {/* Right Sidebar Navigation */}
      <View
        style={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: [{ translateY: -((sections.length * 12 + 80) / 2) }],
          alignItems: 'center',
        }}
      >
        {/* Up */}
        <TouchableOpacity
          onPress={() => goToSection(currentSection - 1)}
          disabled={currentSection === 0}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: currentSection === 0 ? '#d1d5db' : '#7c3aed',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Ionicons
            name="chevron-up"
            size={20}
            color={currentSection === 0 ? '#9ca3af' : 'white'}
          />
        </TouchableOpacity>

        {/* Dots */}
        <View style={{ alignItems: 'center', marginVertical: 8 }}>
          {sections.map((s, i) => (
            <TouchableOpacity
              key={s.key}                 // ✅ stable key per section
              onPress={() => goToSection(i)}
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: i === currentSection ? '#7c3aed' : '#d1d5db',
                marginVertical: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 2,
              }}
            />
          ))}
        </View>

        {/* Down */}
        <TouchableOpacity
          onPress={() => goToSection(currentSection + 1)}
          disabled={currentSection === sections.length - 1}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor:
              currentSection === sections.length - 1 ? '#d1d5db' : '#7c3aed',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Ionicons
            name="chevron-down"
            size={20}
            color={currentSection === sections.length - 1 ? '#9ca3af' : 'white'}
          />
        </TouchableOpacity>

        {/* Counter */}
        <View
          style={{
            marginTop: 12,
            backgroundColor: 'rgba(124, 58, 237, 0.1)',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#7c3aed',
          }}
        >
          <Text style={{ fontSize: 10, color: '#7c3aed', fontWeight: '600' }}>
            {currentSection + 1}/{sections.length}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SimpleQuotationWrapper;
