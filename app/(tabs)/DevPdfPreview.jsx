import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import RealtimePdfPreview from '@/components/pdf/RealtimePdfPreview';

// 🛠️ DEVELOPMENT SCREEN FOR PDF PREVIEW
// Use this screen to test winterFellPdf changes in real-time
const DevPdfPreview = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛠️ PDF Development Preview</Text>
        <Text style={styles.headerSubtitle}>
          Make changes to winterFellPdf.js and see them instantly here
        </Text>
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            💡 With React Native hot reload: Edit winterFellPdf.js → Save → Changes appear instantly!
          </Text>
        </View>
      </View>
      <RealtimePdfPreview />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
    opacity: 0.9,
    marginBottom: 8,
  },
  instructions: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 8,
  },
  instructionText: {
    fontSize: 12,
    color: '#e0e7ff',
    fontWeight: '500',
  },
});

export default DevPdfPreview;
