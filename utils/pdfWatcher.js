// 🔥 PDF WATCHER UTILITY
// Simple cache busting for React Native

let refreshCounter = 0;

// Force refresh by incrementing counter
export const forceRefreshTemplate = () => {
  refreshCounter++;
  console.log('🔄 Template refresh forced, counter:', refreshCounter);
};

// Get template with simple cache busting
export const getTemplateWithCacheBust = () => {
  // Always import fresh - React Native will handle the module resolution
  console.log('🔄 Loading template, refresh counter:', refreshCounter);
  
  // Direct import - React Native Metro bundler handles hot reloading
  const { TemplateWinterfell } = require('../components/pdf/winterFellPdf');
  return TemplateWinterfell;
};

// Get current refresh counter
export const getRefreshCounter = () => refreshCounter;
