
import React, { useState } from "react";
import { Alert, View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import IntegratedQuotationForm from "@/components/form/IntegratedQuotationForm";
import { clearQuotationDraft } from "@/storage/quotationDrafts";
import { getInstantHtmlPreview } from "../../utils/pdfUtils";
import PdfPreviewModal from "@/components/pdf/PdfPreviewModal";
import axios from "axios";
const QuotationScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const leadData = params.leadData ? JSON.parse(params.leadData) : null;
  const [isPrinting, setIsPrinting] = useState(false); // 🔐 lock
  const [pdfUri, setPdfUri] = useState(null);
  const [pdfHtml, setPdfHtml] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // const handleFormSubmit = async (data) => {

  //   console.log(data)
  //   await clearQuotationDraft(data.TripId);
  //   if (isPrinting) return; // 🚫 prevent double submit
  //   setIsPrinting(true);
  //   try {
  //     const res = await axios.post("https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/quotations", data);
  //     console.log(res?.data?.QuoteId, res?.data?.Sk, res?.data?.TripId);
  //     console.log("🗑️ Clearing draft...");
  //     await axios.put('https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote', {
  //       TripId: res?.data?.TripId,
  //       Quotations: [...data?.Quotations, res?.data?.QuoteId],
  //       SalesStatus: "Cold"
  //     })
  //     //  await clearQuotationDraft(data.TripId);

  //     console.log("⚡ Getting instant HTML preview...");
  //     //  const result = getInstantHtmlPreview(data); // 🚀 INSTANT - no PDF generation
  //     console.log("✅ HTML preview ready instantly");

  //     //  setRefreshKey(prev => prev + 1);

  //     //  if (result.html) {
  //     //    setPdfUri(null); // 🚫 No PDF URI yet - will generate lazily
  //     //    setPdfHtml(result.html);
  //     //    setShowPdfModal(true);
  //     //    console.log("✅ Modal opened with HTML preview");
  //     //  } else {
  //     //    throw new Error("HTML preview generation failed");
  //     //  }
  //   } catch (error) {
  //     console.error("❌ Error generating HTML preview:", error);
  //     Alert.alert("Error", "Failed to generate preview: " + (error?.message || error));
  //   } finally {
  //     setIsPrinting(false);
  //   }
  // };



  const handleFormSubmit = async (data) => {
  if (isPrinting) return; // Prevent double submit
  setIsPrinting(true);
  console.log(leadData)
  
  try {
    console.log("📝 Submitting quotation data...", data);
    
    // 1. First POST request to create quotation
    const res = await axios.post(
      "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/quotations", 
      data
    );
    
    console.log("✅ Quotation created:", {
  ...leadData
    });

    // 2. Prepare data for PUT request
    const updateData = {
      TripId: res?.data?.TripId,
      Quotations: Array.isArray(leadData.Quotations) 
        ? [...leadData.Quotations, res.data.QuoteId] 
        : [res.data.QuoteId],
      SalesStatus: "Cold",
      LeadId:leadData?.LeadId
    };

    console.log("🔄 Updating quote with:", updateData);
    
    // 3. Make PUT request to update quote
    const updateRes = await axios.put(
      'https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/create-quote',
      updateData
    );
    
    console.log("✅ Quote updated successfully:", updateRes.data);

    // 4. Clear draft after successful update
    await clearQuotationDraft(data.TripId);
    
    // 5. Show success message to user
    Alert.alert("Success", "Quotation created and updated successfully!");
            router.replace('/(tabs)');

  } catch (error) {
    console.error("❌ Error in handleFormSubmit:", {
      error: error.message,
      response: error.response?.data
    });
    
    Alert.alert(
      "Error", 
      error.response?.data?.message || "Failed to process quotation. Please try again."
    );
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
            <Text style={styles.loadingText}>Preparing Preview...</Text>
          </View>
        </View>
      )}

      <PdfPreviewModal
        key={refreshKey}
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
