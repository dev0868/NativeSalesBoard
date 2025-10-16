import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView, Text, Platform } from 'react-native';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { MaterialIcons } from '@expo/vector-icons';
import WebView from 'react-native-webview';

const QuotationPdfViewer = ({ visible, onClose, quotationData }) => {
  const [loading, setLoading] = useState(false);

  const generateHTML = () => {
    const { 
      "Client-Name": clientName,
      "Client-Contact": clientContact,
      "Client-Email": clientEmail,
      "TravelDate": travelDate,
      "TravelEndDate": travelEndDate,
      "NoOfPax": adults,
      "Child": children,
      "Infant": infants,
      "Budget": budget,
      "DestinationName": destination,
      "Days": days,
      "Nights": nights,
      "Currency": currency = 'INR',
      "Costs": costs = {},
      "Inclusions": inclusions = [],
      "Exclusions": exclusions = [],
      "Itinearies": itineraries = [],
      "Hotels": hotels = []
    } = quotationData || {};

    // Add page break styles
    const pageBreak = '<div style="page-break-before: always;"></div>';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Travel Quotation</title>
        <style>
          @page {
            size: A4;
            margin: 1cm;
          }
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 210mm;
            margin: 0 auto; 
            padding: 20px;
            -webkit-print-color-adjust: exact;
          }
          .page {
            page-break-after: always;
            position: relative;
            min-height: 290mm;
            padding-bottom: 50px;
          }
          .page:last-child {
            page-break-after: avoid;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #4a148c; 
            padding-bottom: 10px; 
          }
          .header h1 { 
            color: #4a148c; 
            margin: 0 0 10px 0;
          }
          .section { 
            margin-bottom: 25px; 
            page-break-inside: avoid;
          }
          .section-title { 
            color: #4a148c; 
            border-bottom: 1px solid #eee; 
            padding-bottom: 5px; 
            margin-bottom: 10px; 
            font-size: 18px;
          }
          .row { 
            display: flex; 
            margin-bottom: 10px; 
            flex-wrap: wrap;
          }
          .col { 
            flex: 1; 
            min-width: 200px;
            margin-bottom: 10px;
          }
          .text-right { text-align: right; }
          .text-bold { font-weight: bold; }
          .itinerary-day { 
            margin-bottom: 15px; 
            background: #f9f9f9; 
            padding: 15px; 
            border-radius: 5px; 
            border-left: 4px solid #4a148c;
          }
          .footer { 
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center; 
            font-size: 0.8em; 
            color: #666;
            padding: 10px 0;
            border-top: 1px solid #eee;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 15px 0; 
            page-break-inside: avoid;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 10px; 
            text-align: left; 
          }
          th { 
            background-color: #f2f2f2; 
            font-weight: 600;
          }
          .page-number:after {
            content: counter(page);
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <h1>TRAVEL QUOTATION</h1>
            <p>Quotation #${quotationData?.TripId || 'N/A'}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>

        <div class="section">
          <h3 class="section-title">Client Details</h3>
          <div class="row">
            <div class="col">
              <p><strong>Name:</strong> ${clientName || 'N/A'}</p>
              <p><strong>Contact:</strong> ${clientContact || 'N/A'}</p>
              <p><strong>Email:</strong> ${clientEmail || 'N/A'}</p>
            </div>
            <div class="col">
              <p><strong>Travel Dates:</strong> ${travelDate} to ${travelEndDate || travelDate}</p>
              <p><strong>Duration:</strong> ${days} Days / ${nights} Nights</p>
              <p><strong>Destination:</strong> ${destination || 'N/A'}</p>
            </div>
          </div>
        </div>

        ${hotels.length > 0 ? `
        <div class="section">
          <h3 class="section-title">Accommodation</h3>
          <table>
            <thead>
              <tr>
                <th>Hotel</th>
                <th>City</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Room Type</th>
              </tr>
            </thead>
            <tbody>
              ${hotels.map(hotel => `
                <tr>
                  <td>${hotel.Name || 'N/A'}</td>
                  <td>${hotel.City || 'N/A'}</td>
                  <td>${hotel.CheckInDate || 'N/A'}</td>
                  <td>${hotel.CheckOutDate || 'N/A'}</td>
                  <td>${hotel.RoomType || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        ${itineraries.length > 0 ? `
        <div class="section">
          <h3 class="section-title">Itinerary</h3>
          ${itineraries.filter(i => i.day).map(day => `
            <div class="itinerary-day">
              <h4>Day ${day.day}: ${day.Title || ''}</h4>
              <p>${day.Description ? day.Description.replace(/<[^>]*>?/gm, '') : 'No description available'}</p>
            </div>
          `).join('')}
        ` : ''}

        <div class="section">
          <h3 class="section-title">Cost Summary</h3>
          <table>
            <tr>
              <td>Land Package Cost:</td>
              <td class="text-right">${currency} ${costs?.LandPackageCost?.toLocaleString() || '0'}</td>
            </tr>
            <tr>
              <td>Flight Cost:</td>
              <td class="text-right">${currency} ${costs?.FlightCost?.toLocaleString() || '0'}</td>
            </tr>
            <tr>
              <td>Visa Cost:</td>
              <td class="text-right">${currency} ${costs?.VisaCost?.toLocaleString() || '0'}</td>
            </tr>
            ${costs?.GSTAmount ? `
            <tr>
              <td>GST (${quotationData?.GST?.WaivedOffAmount ? 'Waived' : 'Included'}):</td>
              <td class="text-right">${currency} ${costs.GSTAmount.toLocaleString()}</td>
            </tr>` : ''}
            ${costs?.TCSAmount ? `
            <tr>
              <td>TCS (${quotationData?.TCS?.WaivedOffAmount ? 'Waived' : 'Included'}):</td>
              <td class="text-right">${currency} ${costs.TCSAmount.toLocaleString()}</td>
            </tr>` : ''}
            <tr class="text-bold">
              <td>Total Cost:</td>
              <td class="text-right">${currency} ${costs?.TotalCost?.toLocaleString() || '0'}</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <div class="row">
            <div class="col">
              <h3 class="section-title">Inclusions</h3>
              <ul>
                ${inclusions?.map(item => `<li>${item.item}</li>`).join('') || '<li>No inclusions specified</li>'}
              </ul>
            </div>
            <div class="col">
              <h3 class="section-title">Exclusions</h3>
              <ul>
                ${exclusions?.map(item => `<li>${item.item}</li>`).join('') || '<li>No exclusions specified</li>'}
              </ul>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for choosing our services. We look forward to serving you!</p>
          <p>For any queries, please contact us at support@example.com</p>
        </div>
          <div class="footer">
            <p>Page <span class="page-number"></span></p>
            <p>For any queries, please contact us at support@example.com</p>
          </div>
        </div>
      </body>
      </html>
      <script>
        // Add page numbers
        document.addEventListener('DOMContentLoaded', function() {
          const pages = document.querySelectorAll('.page');
          pages.forEach((page, index) => {
            const pageNum = page.querySelector('.page-number');
            if (pageNum) {
              pageNum.textContent = (index + 1) + ' of ' + pages.length;
            }
          });
        });
      </script>
    `;
  };

  const generatePdf = async () => {
    try {
      setLoading(true);
      const html = generateHTML();
      
      const { uri } = await printToFileAsync({
        html,
        base64: false,
      });
      
      await shareAsync(uri, {
        UTI: 'com.adobe.pdf',
        mimeType: 'application/pdf',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Quotation Preview</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.previewContainer}>
          <WebView
            originWhitelist={['*']}
            source={{ html: generateHTML() }}
            style={styles.webview}
            scalesPageToFit={true}
            bounces={false}
            scrollEnabled={true}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.button, styles.closeButton]}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.downloadButton]}
            onPress={generatePdf}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Generating...' : 'Download PDF'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  previewContainer: {
    flex: 1,
    padding: 10,
  },
  webview: {
    flex: 1,
    width: '100%',
    minHeight: 500,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
  },
  downloadButton: {
    backgroundColor: '#4a148c',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default QuotationPdfViewer;
