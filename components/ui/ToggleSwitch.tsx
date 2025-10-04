import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

interface ToggleSwitchProps {
  label?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  labelStyle?: any;
  containerStyle?: any;
  switchStyle?: any;
  size?: 'small' | 'medium' | 'large';
}

export default function ToggleSwitch({
  label,
  value,
  onValueChange,
  disabled = false,
  activeColor = "#7c3aed",
  inactiveColor = "#e5e7eb",
  thumbColor = "white",
  labelStyle,
  containerStyle,
  switchStyle,
  size = 'medium',
}: ToggleSwitchProps) {
  
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 40,
          height: 22,
          borderRadius: 11,
          thumbSize: 18,
          thumbRadius: 9,
          translateX: 18,
          padding: 2,
        };
      case 'large':
        return {
          width: 60,
          height: 32,
          borderRadius: 16,
          thumbSize: 28,
          thumbRadius: 14,
          translateX: 28,
          padding: 2,
        };
      default: // medium
        return {
          width: 50,
          height: 28,
          borderRadius: 14,
          thumbSize: 24,
          thumbRadius: 12,
          translateX: 22,
          padding: 2,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const toggleStyles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingVertical: 8,
      opacity: disabled ? 0.5 : 1,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: "#374151",
      flex: 1,
      marginRight: 12,
    },
    switch: {
      width: sizeStyles.width,
      height: sizeStyles.height,
      borderRadius: sizeStyles.borderRadius,
      backgroundColor: value ? activeColor : inactiveColor,
      padding: sizeStyles.padding,
      justifyContent: "center",
    },
    thumb: {
      width: sizeStyles.thumbSize,
      height: sizeStyles.thumbSize,
      borderRadius: sizeStyles.thumbRadius,
      backgroundColor: thumbColor,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
      transform: [{ translateX: value ? sizeStyles.translateX : 0 }],
    },
  });

  return (
    <View style={[toggleStyles.container, containerStyle]}>
      {label && (
        <Text style={[toggleStyles.label, labelStyle]}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        style={[toggleStyles.switch, switchStyle]}
        onPress={() => {
          if (!disabled) {
            onValueChange(!value);
          }
        }}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Animated.View style={toggleStyles.thumb} />
      </TouchableOpacity>
    </View>
  );
}

// Export additional utility components for different use cases

// Simple toggle without label
export function SimpleToggle({
  value,
  onValueChange,
  disabled = false,
  activeColor = "#7c3aed",
  inactiveColor = "#e5e7eb",
  size = 'medium',
}: Omit<ToggleSwitchProps, 'label'>) {
  return (
    <ToggleSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      activeColor={activeColor}
      inactiveColor={inactiveColor}
      size={size}
      containerStyle={{ marginBottom: 0, paddingVertical: 0 }}
    />
  );
}

// Toggle with custom colors for different states
export function StatusToggle({
  label,
  value,
  onValueChange,
  disabled = false,
  size = 'medium',
}: {
  label?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}) {
  return (
    <ToggleSwitch
      label={label}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      activeColor="#10b981" // Green for active/enabled
      inactiveColor="#ef4444" // Red for inactive/disabled
      size={size}
    />
  );
}

// Toggle for settings/preferences
export function SettingsToggle({
  label,
  value,
  onValueChange,
  disabled = false,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <ToggleSwitch
      label={label}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      activeColor="#3b82f6" // Blue for settings
      inactiveColor="#d1d5db"
      size="medium"
      containerStyle={{
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    />
  );
}
