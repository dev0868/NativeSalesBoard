import { MMKV } from 'react-native-mmkv';

const store = new MMKV({ id: 'jr-quotation-drafts' });
const key = (tripId) => `quotationDraft:${tripId}`;

export function saveQuotationDraft(tripId, data) {
  store.set(key(tripId), JSON.stringify({ v: 1, updatedAt: Date.now(), data }));
}

export function loadQuotationDraft(tripId){
  const raw = store.getString(key(tripId));
  if (!raw) return null;
  try { return JSON.parse(raw).data } catch { return null; }
}

export function clearQuotationDraft(tripId) {
  store.delete(key(tripId));
}
