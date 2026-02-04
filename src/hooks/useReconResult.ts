import { ReconResult } from "@/components/reconciliatioin/ReconPage";
import { reconService } from "@/services/recon-service";
import { useState, useEffect, useCallback } from "react";

export const useReconResults = () => {
  const [data, setData] = useState<ReconResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ page: 1, search: "", status: "" });
  const [totalPages, setTotalPages] = useState(1);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reconService.getResults(filters.page, filters.search, filters.status);
      
      // --- THE FIX IS HERE: Transform Strings to Numbers ---
      const cleanData = res.results.map((item: any) => ({
        ...item,
        // Convert the main fields
        uploadedAmount: Number(item.uploadedAmount),
        variance: Number(item.variance),
        // Handle the nested system record carefully
        systemRecord: item.systemRecord ? {
          ...item.systemRecord,
          amount: Number(item.systemRecord.amount)
        } : null
      }));

      setData(cleanData);
      setTotalPages(res.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(fetch, 300);
    return () => clearTimeout(timer);
  }, [fetch]);

  return { data, loading, totalPages, filters, setFilters, refresh: fetch };
};