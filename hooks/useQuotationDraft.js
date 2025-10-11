// Debounced autosave hook (tailored for Quoation form)
import { useEffect, useMemo, useRef } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { loadQuotationDraft, saveQuotationDraft } from '@/storage/quotationDrafts';

export function useDebounced(fn, delay = 700) {
  const t = useRef(null);
  return (...args) => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => fn(...args), delay);
  };
}

export function useQuotationDraft(tripId, defaults) {
  // load saved draft (if any)
  const savedQuotes = useMemo(() => (tripId ? loadQuotationDraft(tripId) : null), [tripId]);

  // RHF with rehydrated default values (saved overrides api defaults)
  const methods = useForm({
    defaultValues: { ...(defaults), ...(savedQuotes ?? {}) },
    mode: 'onChange',
  });

  // autosave on any change (debounced)
  const debounced = useDebounced((values) => {
    if (tripId) saveQuotationDraft(tripId, values);
  }, 700);

  useEffect(() => {
    const sub = methods.watch((vals) => debounced(vals));
    return () => sub.unsubscribe();
  }, [methods.watch, debounced]);

  return methods;
}
