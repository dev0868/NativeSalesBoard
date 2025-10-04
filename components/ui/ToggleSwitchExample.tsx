import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import ToggleSwitch, { SimpleToggle, StatusToggle, SettingsToggle } from "./ToggleSwitch";

// Example of how to use the ToggleSwitch component in different scenarios
export default function ToggleSwitchExample() {
  const [basicToggle, setBasicToggle] = useState(false);
  const [multiDestination, setMultiDestination] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  const [locationAccess, setLocationAccess] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ToggleSwitch Component Examples</Text>

      {/* Basic Toggle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Basic Toggle</Text>
        <ToggleSwitch
          label="Enable Feature"
          value={basicToggle}
          onValueChange={setBasicToggle}
        />
      </View>

      {/* Multi-destination Toggle (like in your form) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Multi-destination Toggle</Text>
        <ToggleSwitch
          label="Multiple Destinations"
          value={multiDestination}
          onValueChange={setMultiDestination}
        />
      </View>

      {/* Different Sizes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Different Sizes</Text>
        <ToggleSwitch
          label="Small Toggle"
          value={basicToggle}
          onValueChange={setBasicToggle}
          size="small"
        />
        <ToggleSwitch
          label="Medium Toggle (Default)"
          value={basicToggle}
          onValueChange={setBasicToggle}
          size="medium"
        />
        <ToggleSwitch
          label="Large Toggle"
          value={basicToggle}
          onValueChange={setBasicToggle}
          size="large"
        />
      </View>

      {/* Custom Colors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Custom Colors</Text>
        <ToggleSwitch
          label="Green Toggle"
          value={basicToggle}
          onValueChange={setBasicToggle}
          activeColor="#10b981"
          inactiveColor="#f3f4f6"
        />
        <ToggleSwitch
          label="Blue Toggle"
          value={basicToggle}
          onValueChange={setBasicToggle}
          activeColor="#3b82f6"
          inactiveColor="#e5e7eb"
        />
        <ToggleSwitch
          label="Red Toggle"
          value={basicToggle}
          onValueChange={setBasicToggle}
          activeColor="#ef4444"
          inactiveColor="#f3f4f6"
        />
      </View>

      {/* Simple Toggle (No Label) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Simple Toggle (No Label)</Text>
        <View style={styles.row}>
          <Text style={styles.inlineLabel}>Quick Toggle:</Text>
          <SimpleToggle
            value={basicToggle}
            onValueChange={setBasicToggle}
          />
        </View>
      </View>

      {/* Status Toggle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Status Toggle (Green/Red)</Text>
        <StatusToggle
          label="Service Status"
          value={isActive}
          onValueChange={setIsActive}
        />
      </View>

      {/* Settings Toggles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. Settings Toggles</Text>
        <SettingsToggle
          label="Push Notifications"
          value={notifications}
          onValueChange={setNotifications}
        />
        <SettingsToggle
          label="Dark Mode"
          value={darkMode}
          onValueChange={setDarkMode}
        />
        <SettingsToggle
          label="Auto Save"
          value={autoSave}
          onValueChange={setAutoSave}
        />
        <SettingsToggle
          label="Location Access"
          value={locationAccess}
          onValueChange={setLocationAccess}
        />
      </View>

      {/* Disabled Toggle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>8. Disabled Toggle</Text>
        <ToggleSwitch
          label="Disabled Toggle"
          value={true}
          onValueChange={() => {}}
          disabled={true}
        />
      </View>

      {/* Form Integration Example */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>9. Form Integration</Text>
        <View style={styles.formExample}>
          <Text style={styles.formTitle}>Travel Preferences</Text>
          <ToggleSwitch
            label="Include Flights"
            value={basicToggle}
            onValueChange={setBasicToggle}
          />
          <ToggleSwitch
            label="Include Hotels"
            value={notifications}
            onValueChange={setNotifications}
          />
          <ToggleSwitch
            label="Include Activities"
            value={darkMode}
            onValueChange={setDarkMode}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1f2937",
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#374151",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inlineLabel: {
    fontSize: 16,
    color: "#374151",
  },
  formExample: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
});
