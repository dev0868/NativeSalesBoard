// components/form/CostCalculatorNew.tsx
import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

const CostCalculator = () => {
  const { control, setValue, getValues, formState: { errors } } = useFormContext();

  // Subscribe once to ALL fields needed for the calculation
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

  // Safe number coercion
  const num = (v) => {
    const x = parseFloat(String(v ?? '').trim());
    return Number.isFinite(x) ? x : 0;
  };

  // Compute total and set only if changed (prevents update-depth loop)
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
      setValue('TotalCost', next, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
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

  const FormField = ({
    label,
    children,
    required = false,
    error,
  }
 ) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: '#374151', fontWeight: '600', marginBottom: 8 }}>
        {label} {required && <Text style={{ color: 'red' }}>*</Text>}
      </Text>
      {children}
      {error && (
        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
          {error.message}
        </Text>
      )}
    </View>
  );

  const CheckboxField = ({
    label,
    value,
    onValueChange,
  }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={() => onValueChange(!value)}>
      <View style={[styles.checkbox, value && styles.checkboxChecked]}>
        {value && <Ionicons name="checkmark" size={16} color="white" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

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

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <FormField label="Flight Cost (₹)" error={errors.FlightCost}>
            <Controller
              control={control}
              name="FlightCost"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={[styles.input, errors.FlightCost && styles.errorInput]}
                  placeholder="Enter flight cost"
                  keyboardType="numeric"
                  value={value == null ? '' : String(value)}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
        <View style={{ flex: 1 }}>
          <FormField label="Visa Cost (₹)" error={errors.VisaCost}>
            <Controller
              control={control}
              name="VisaCost"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={[styles.input, errors.VisaCost && styles.errorInput]}
                  placeholder="Enter visa cost"
                  keyboardType="numeric"
                  value={value == null ? '' : String(value)}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
          </FormField>
        </View>
      </View>

      <FormField label="Land Package Cost (₹)" error={errors.LandPackageCost}>
        <Controller
          control={control}
          name="LandPackageCost"
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              style={[styles.input, errors.LandPackageCost && styles.errorInput]}
              placeholder="Enter land package cost"
              keyboardType="numeric"
              value={value == null ? '' : String(value)}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholderTextColor="#9ca3af"
            />
          )}
        />
      </FormField>

      <FormField label="Total Tax (₹)" error={errors.TotalTax}>
        <Controller
          control={control}
          name="TotalTax"
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              style={[styles.input, errors.TotalTax && styles.errorInput]}
              placeholder="Enter total tax"
              keyboardType="numeric"
              value={value == null ? '' : String(value)}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholderTextColor="#9ca3af"
            />
          )}
        />
      </FormField>

      {/* GST & TCS */}
      <Text style={styles.sectionSubtitle}>GST & TCS</Text>

      <Controller
        control={control}
        name="PackageWithGST"
        render={({ field: { onChange, value } }) => (
          <CheckboxField label="Package includes GST" value={!!value} onValueChange={onChange} />
        )}
      />

      {packageWithGST ? (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormField label="GST Amount (₹)" error={errors.GST}>
              <Controller
                control={control}
                name="GST"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={[styles.input, errors.GST && styles.errorInput]}
                    placeholder="Enter GST amount"
                    keyboardType="numeric"
                    value={value == null ? '' : String(value)}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholderTextColor="#9ca3af"
                  />
                )}
              />
            </FormField>
          </View>
          <View style={{ flex: 1 }}>
            <FormField label="GST Waived Off (₹)" error={errors.GstWaivedOffAmt}>
              <Controller
                control={control}
                name="GstWaivedOffAmt"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={[styles.input, errors.GstWaivedOffAmt && styles.errorInput]}
                    placeholder="Waived amount"
                    keyboardType="numeric"
                    value={value == null ? '' : String(value)}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholderTextColor="#9ca3af"
                  />
                )}
              />
            </FormField>
          </View>
        </View>
      ) : null}

      <Controller
        control={control}
        name="PackageWithTCS"
        render={({ field: { onChange, value } }) => (
          <CheckboxField label="Package includes TCS" value={!!value} onValueChange={onChange} />
        )}
      />

      {packageWithTCS ? (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormField label="TCS Amount (₹)" error={errors.TCS}>
              <Controller
                control={control}
                name="TCS"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={[styles.input, errors.TCS && styles.errorInput]}
                    placeholder="Enter TCS amount"
                    keyboardType="numeric"
                    value={value == null ? '' : String(value)}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholderTextColor="#9ca3af"
                  />
                )}
              />
            </FormField>
          </View>
          <View style={{ flex: 1 }}>
            <FormField label="TCS Waived Off (₹)" error={errors.TcsWaivedOffAmt}>
              <Controller
                control={control}
                name="TcsWaivedOffAmt"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={[styles.input, errors.TcsWaivedOffAmt && styles.errorInput]}
                    placeholder="Waived amount"
                    keyboardType="numeric"
                    value={value == null ? '' : String(value)}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholderTextColor="#9ca3af"
                  />
                )}
              />
            </FormField>
          </View>
        </View>
      ) : null}

      {/* Total Cost Display */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Package Cost</Text>
        <Controller
          control={control}
          name="TotalCost"
          render={({ field: { value } }) => {
            const numVal = Number.parseFloat(String(value ?? '0'));
            const display = Number.isFinite(numVal)
              ? numVal.toLocaleString('en-IN')
              : '0';
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
