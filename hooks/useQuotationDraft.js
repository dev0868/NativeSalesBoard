// hooks/useQuotationDraft.ts
import { useEffect, useRef, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { saveQuotationDraft, loadQuotationDraft } from '@/storage/quotationDrafts';

function useDebounced(fn, delay = 700) {
  const t = useRef(null);
  return (...args) => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Handles RHF initialization + async draft load + debounced autosave
 */
export function useQuotationDraft(
  tripId,
  defaults,
) {
  const [loading, setLoading] = useState(true);
  const methods = useForm({ defaultValues: defaults, mode: 'onChange' });

  useEffect(() => {
    (async () => {
      const saved = tripId ? await loadQuotationDraft(tripId) : null;
      if (saved) methods.reset({ ...(defaults), ...(saved) });
      setLoading(false);
    })();
  }, [tripId]);

  const debounced = useDebounced((values) => {
    if (tripId) saveQuotationDraft(tripId, values);
  }, 700);

  useEffect(() => {
    const sub = methods.watch((vals) => debounced(vals));
    return () => sub.unsubscribe();
  }, [methods.watch, debounced]);

  return { methods, loading };
}
