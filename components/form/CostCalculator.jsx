// components/form/CostCalculatorNew.tsx
import React, { useEffect, useRef, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

/** ---------- Small helpers ---------- */
const num = (v) => {
  const x = parseFloat(String(v ?? '').trim());
  return Number.isFinite(x) ? x : 0;
};

/** ---------- Memo building blocks ---------- */
const FormField = memo(function FormField({
  label,
  children,
  required = false,
  error,
}) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: '#374151', fontWeight: '600', marginBottom: 8 }}>
        {label} {required && <Text style={{ color: 'red' }}>*</Text>}
      </Text>
      {children}
      {!!error?.message && (
        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{error.message}</Text>
      )}
    </View>
  );
});

const CheckboxField = memo(function CheckboxField({
  label,
  value,
  onValueChange,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.checkboxContainer}
      onPress={() => onValueChange(!value)}
    >
      <View style={[styles.checkbox, value && styles.checkboxChecked]}>
        {value && <Ionicons name="checkmark" size={16} color="white" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
});

/** A memoized RHF numeric input to minimize re-mounts while typing */
const RHFNumberInput = memo(function RHFNumberInput({
  name,
  control,
  error,
  placeholder,
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, onBlur } }) => (
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          placeholder={placeholder}
          keyboardType={Platform.select({ ios: 'numbers-and-punctuation', android: 'numeric' })}
          value={value == null ? '' : String(value)}
          onChangeText={onChange}
          onBlur={onBlur}
          placeholderTextColor="#9ca3af"
          // keep focus stable on Android while typing/submitting
          blurOnSubmit={false}
          importantForAutofill="no"
          autoCorrect={false}
        />
      )}
    />
  );
});

/** ---------- Main component ---------- */
const CostCalculator = () => {
  const { control, setValue, getValues, formState: { errors } } = useFormContext();

  // Subscribe only to the fields we truly need for total calculation
  const [
    flightCost,
    visaCost,
    landPackageCost,
    totalTax,
    gst,
    tcs,
    gstWaivedOff,
    tcsWaivedOff,
    packageWithGST,
    packageWithTCS,
  ] = useWatch({
    control,
    name: [
      'FlightCost',
      'VisaCost',
      'LandPackageCost',
      'TotalTax',
      'GST',
      'TCS',
      'GstWaivedOffAmt',
      'TcsWaivedOffAmt',
      'PackageWithGST',
      'PackageWithTCS',
    ],
  });

  // Schedule setValue to next frame to avoid racing the typing render
  const rafId = useRef(null);

  useEffect(() => {
    const flight = num(flightCost);
    const visa = num(visaCost);
    const land = num(landPackageCost);
    const tax = num(totalTax);
    const gstAmt = num(gst);
    const tcsAmt = num(tcs);
    const gstW = num(gstWaivedOff);
    const tcsW = num(tcsWaivedOff);

    let total = flight + visa + land + tax;
    if (packageWithGST) total += (gstAmt - gstW);
    if (packageWithTCS) total += (tcsAmt - tcsW);

    const next = String(total);
    const current = String(getValues('TotalCost') ?? '');

    if (current !== next) {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        setValue('TotalCost', next, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
      });
    }

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [
    flightCost,
    visaCost,
    landPackageCost,
    totalTax,
    gst,
    tcs,
    gstWaivedOff,
    tcsWaivedOff,
    packageWithGST,
    packageWithTCS,
    getValues,
    setValue,
  ]);

  return (
    <View style={styles.card}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={[styles.iconWrapper, { backgroundColor: '#dbeafe' }]}>
          <Ionicons name="calculator" size={20} color="#3b82f6" />
        </View>
        <Text style={styles.sectionTitle}>Cost Calculator</Text>
      </View>

      {/* Basic Costs */}
      <Text style={styles.sectionSubtitle}>Package Costs</Text>

      {/* Avoid RN 'gap' to prevent layout thrash on some versions */}
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <FormField label="Flight Cost (₹)" error={errors?.FlightCost}>
            <RHFNumberInput
              name="FlightCost"
              control={control}
              error={errors?.FlightCost}
              placeholder="Enter flight cost"
            />
          </FormField>
        </View>

        <View style={{ flex: 1 }}>
          <FormField label="Visa Cost (₹)" error={errors?.VisaCost}>
            <RHFNumberInput
              name="VisaCost"
              control={control}
              error={errors?.VisaCost}
              placeholder="Enter visa cost"
            />
          </FormField>
        </View>
      </View>

      <FormField label="Land Package Cost (₹)" error={errors?.LandPackageCost}>
        <RHFNumberInput
          name="LandPackageCost"
          control={control}
          error={errors?.LandPackageCost}
          placeholder="Enter land package cost"
        />
      </FormField>

    

 

    
      {/* Total Cost Display */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Package Cost</Text>
        <Controller
          control={control}
          name="TotalCost"
          render={({ field: { value } }) => {
            const numVal = Number.parseFloat(String(value ?? '0'));
            const display = Number.isFinite(numVal) ? numVal.toLocaleString('en-IN') : '0';
            return <Text style={styles.totalAmount}>₹{display}</Text>;
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrapper: {
    backgroundColor: '#dbeafe',
    borderRadius: 50,
    padding: 8,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#1f2937',
  },
  errorInput: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  totalContainer: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7c3aed',
  },
});

export default CostCalculator;
