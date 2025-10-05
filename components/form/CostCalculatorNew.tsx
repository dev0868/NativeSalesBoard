import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

const CostCalculator: React.FC = () => {
  const { control, watch, setValue, formState: { errors } } = useFormContext();

  // Watch cost fields for auto-calculation
  const flightCost = watch('FlightCost') || '0';
  const visaCost = watch('VisaCost') || '0';
  const landPackageCost = watch('LandPackageCost') || '0';
  const totalTax = watch('TotalTax') || '0';
  const gst = watch('GST') || '0';
  const tcs = watch('TCS') || '0';
  const gstWaivedOff = watch('GstWaivedOffAmt') || '0';
  const tcsWaivedOff = watch('TcsWaivedOffAmt') || '0';
  const packageWithGST = watch('PackageWithGST');
  const packageWithTCS = watch('PackageWithTCS');

  // Auto-calculate total cost
  useEffect(() => {
    const flight = parseFloat(flightCost) || 0;
    const visa = parseFloat(visaCost) || 0;
    const landPackage = parseFloat(landPackageCost) || 0;
    const tax = parseFloat(totalTax) || 0;
    const gstAmount = parseFloat(gst) || 0;
    const tcsAmount = parseFloat(tcs) || 0;
    const gstWaived = parseFloat(gstWaivedOff) || 0;
    const tcsWaived = parseFloat(tcsWaivedOff) || 0;

    let total = flight + visa + landPackage + tax;
    
    if (packageWithGST) {
      total += gstAmount - gstWaived;
    }
    
    if (packageWithTCS) {
      total += tcsAmount - tcsWaived;
    }

    setValue('TotalCost', total.toString());
  }, [flightCost, visaCost, landPackageCost, totalTax, gst, tcs, gstWaivedOff, tcsWaivedOff, packageWithGST, packageWithTCS, setValue]);

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
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: "#374151", fontWeight: "600", marginBottom: 8 }}>
        {label} {required && <Text style={{ color: "red" }}>*</Text>}
      </Text>
      {children}
      {error && (
        <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
          {error.message}
        </Text>
      )}
    </View>
  );

  const CheckboxField = ({ 
    label, 
    value, 
    onValueChange 
  }: { 
    label: string; 
    value: boolean; 
    onValueChange: (value: boolean) => void; 
  }) => (
    <TouchableOpacity 
      style={styles.checkboxContainer}
      onPress={() => onValueChange(!value)}
    >
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
        <View style={[styles.iconWrapper, { backgroundColor: "#dbeafe" }]}>
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
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.FlightCost && styles.errorInput]}
                  placeholder="Enter flight cost"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={onChange}
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
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.VisaCost && styles.errorInput]}
                  placeholder="Enter visa cost"
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

      <FormField label="Land Package Cost (₹)" error={errors.LandPackageCost}>
        <Controller
          control={control}
          name="LandPackageCost"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.LandPackageCost && styles.errorInput]}
              placeholder="Enter land package cost"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              placeholderTextColor="#9ca3af"
            />
          )}
        />
      </FormField>

      <FormField label="Total Tax (₹)" error={errors.TotalTax}>
        <Controller
          control={control}
          name="TotalTax"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.TotalTax && styles.errorInput]}
              placeholder="Enter total tax"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              placeholderTextColor="#9ca3af"
            />
          )}
        />
      </FormField>

      {/* GST Section */}
      <Text style={styles.sectionSubtitle}>GST & TCS</Text>
      
      <Controller
        control={control}
        name="PackageWithGST"
        render={({ field: { onChange, value } }) => (
          <CheckboxField
            label="Package includes GST"
            value={value}
            onValueChange={onChange}
          />
        )}
      />

      {packageWithGST && (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormField label="GST Amount (₹)" error={errors.GST}>
              <Controller
                control={control}
                name="GST"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.GST && styles.errorInput]}
                    placeholder="Enter GST amount"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
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
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.GstWaivedOffAmt && styles.errorInput]}
                    placeholder="Waived amount"
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
      )}

      <Controller
        control={control}
        name="PackageWithTCS"
        render={({ field: { onChange, value } }) => (
          <CheckboxField
            label="Package includes TCS"
            value={value}
            onValueChange={onChange}
          />
        )}
      />

      {packageWithTCS && (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormField label="TCS Amount (₹)" error={errors.TCS}>
              <Controller
                control={control}
                name="TCS"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.TCS && styles.errorInput]}
                    placeholder="Enter TCS amount"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
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
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.TcsWaivedOffAmt && styles.errorInput]}
                    placeholder="Waived amount"
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
      )}

      {/* Total Cost Display */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Package Cost</Text>
        <Controller
          control={control}
          name="TotalCost"
          render={({ field: { value } }) => (
            <Text style={styles.totalAmount}>
              ₹{parseFloat(value || '0').toLocaleString()}
            </Text>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconWrapper: {
    backgroundColor: "#dbeafe",
    borderRadius: 50,
    padding: 8,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
    fontSize: 16,
    color: "#1f2937",
  },
  errorInput: {
    borderColor: "#ef4444",
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
