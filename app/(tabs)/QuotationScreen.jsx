// // // app/QuotationScreen.tsx
// // import React, { useState } from 'react';
// // import { Alert, View } from 'react-native';
// // import { useRouter, useLocalSearchParams } from 'expo-router';
// // import IntegratedQuotationForm from '@/components/form/IntegratedQuotationForm';
// // import { clearQuotationDraft } from '@/storage/quotationDrafts';

// // const QuotationScreen = () => {
// //   const router = useRouter();
// //   const params = useLocalSearchParams();
// //   const leadData = params.leadData ? JSON.parse(params.leadData) : null;
// //   const [showPdfPreview, setShowPdfPreview] = useState(false);
// //   const [quotationData, setQuotationData] = useState(null);

// //   const handleFormSubmit = async (data) => {
// //     console.log('Quotation Form Submitted:', data);
// //     setQuotationData(data);
// //     setShowPdfPreview(true);
    
// //     try {
// //       // Uncomment when API is ready
// //       // await api.createQuotation(data.TripId, data);
// //       await clearQuotationDraft(data.TripId);
// //     } catch (error) {
// //       console.error('Error saving quotation:', error);
// //       Alert.alert('Error', 'Failed to save quotation. Please try again.');
// //     }
// //   };

// //   const handlePdfClose = () => {
// //     setShowPdfPreview(false);
// //     // Optionally navigate back or show success message
// //     // router.back();
// //     // Alert.alert('Success', 'Quotation created successfully!');
// //   };

// //   return (
// //     <View style={{ flex: 1 }}>
// //       <IntegratedQuotationForm
// //         onSubmit={handleFormSubmit}
// //         lead={leadData}
// //       />
      

// //     </View>
// //   );
// // };



// // export default QuotationScreen;


// import React, { useState } from "react";
// import { Alert, View, Button } from "react-native";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import IntegratedQuotationForm from "@/components/form/IntegratedQuotationForm";
// import { clearQuotationDraft } from "@/storage/quotationDrafts";
// import { previewPdf } from "../../utils/pdfUtils";

// const QuotationScreen = () => {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const leadData = params.leadData ? JSON.parse(params.leadData) : null;

//   const handleFormSubmit = async (data) => {
//     console.log("Quotation Form Submitted:", data);
//     try {
//       await clearQuotationDraft(data.TripId);
//       await previewPdf(data); // 👈 opens preview
//     } catch (error) {
//       console.error("Error generating quotation PDF:", error);
//       Alert.alert("Error", "Failed to generate quotation. Please try again.");
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <IntegratedQuotationForm onSubmit={handleFormSubmit} lead={leadData} />
//     </View>
//   );
// };

// export default QuotationScreen;


import React, { useState } from "react";
import { Alert, View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import IntegratedQuotationForm from "@/components/form/IntegratedQuotationForm";
import { clearQuotationDraft } from "@/storage/quotationDrafts";
import { previewPdf } from "../../utils/pdfUtils";
import PdfPreviewModal from "@/components/pdf/PdfPreviewModal";

const QuotationScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const leadData = params.leadData ? JSON.parse(params.leadData) : null;
  const [isPrinting, setIsPrinting] = useState(false); // 🔐 lock
  const [pdfUri, setPdfUri] = useState(null);
  const [pdfHtml, setPdfHtml] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const handleFormSubmit = async (data) => {
    if (isPrinting) return; // 🚫 prevent double print
    setIsPrinting(true);

    try {
      console.log("📝 Quotation Form Submitted");
      console.log("🗑️ Clearing draft...");
      await clearQuotationDraft(data.TripId);
      
      console.log("📄 Generating PDF...");
      const result = await previewPdf(data);
      console.log("✅ PDF generated at:", result.uri);
      
      if (result.uri && result.html) {
        setPdfUri(result.uri);
        setPdfHtml(result.html);
        setShowPdfModal(true);
        console.log("✅ Modal opened");
      } else {
        throw new Error("PDF generation failed");
      }
    } catch (error) {
      console.error("❌ Error generating quotation PDF:", error);
      Alert.alert("Error", "Failed to generate PDF: " + (error?.message || error));
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <IntegratedQuotationForm onSubmit={handleFormSubmit} lead={leadData} />
      
      {/* Loading Overlay */}
      {isPrinting && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#7c3aed" />
            <Text style={styles.loadingText}>Generating PDF...</Text>
          </View>
        </View>
      )}
      
      <PdfPreviewModal
        visible={showPdfModal}
        pdfUri={pdfUri}
        pdfHtml={pdfHtml}
        onClose={() => setShowPdfModal(false)}
        clientName={leadData?.ClientLeadDetails?.FullName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingBox: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
});

export default QuotationScreen;
