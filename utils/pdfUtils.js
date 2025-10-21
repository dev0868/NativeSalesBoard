import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { TemplateWinterfell } from "../components/pdf/winterFellPdf";

export async function generateWinterfellPdf(data) {
  const html = TemplateWinterfell(data);
  const { uri } = await Print.printToFileAsync({ html });
  return uri;
}

export async function previewPdf(data) {
  try {
    console.log("📄 Starting PDF generation...");
    console.log("📄 Generating HTML template...");
    const html = TemplateWinterfell(data);
    console.log("📄 HTML length:", html.length);
    
    console.log("📄 Converting HTML to PDF...");
    const { uri } = await Print.printToFileAsync({ html });
    console.log("📄 PDF created at:", uri);
    
    // Return both HTML and URI so we can preview HTML in WebView
    return { uri, html };
  } catch (error) {
    console.error("❌ PDF generation error:", error);
    console.error("❌ Error message:", error.message);
    throw error;
  }
}

export async function sharePdf(data) {
  const uri = await generateWinterfellPdf(data);
  await shareAsync(uri);
}
