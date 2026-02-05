import api from "@/lib/axios";

export interface BackendStatsResponse {
  total: number;
  breakdown: {
    matched: number;
    partial: number;
    unmatched: number;
    duplicate: number;
  };
  accuracy: string; // Backend sends "85.5" as string
}

export const reconService = {
  // Stats
  getStats: async (jobId?: string) => {
    // If we have a specific Job ID, we send it. Otherwise, get global stats.
    const query = jobId ? `?jobId=${jobId}` : "";
    const res = await api.get<BackendStatsResponse>(`/reconciliation/stats${query}`);
    return res.data;
  },

  // Upload
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Results (with filters)
  getResults: async (page = 1, search = "", status = "") => {
    const params = new URLSearchParams({ 
      page: String(page), 
      limit: "10",
      search,
      status 
    });
    const res = await api.get(`/reconciliation/results?${params}`);
    return res.data;
  },


  getAuditLogs: async (reconId: string) => {
    const res = await api.get(`/reconciliation/audit/${reconId}`);
    return res.data; 
  },
  
  // NEW: Manual Override (We will need this later for the "Edit" button)
  manualOverride: async (id: string, status: string, notes: string) => {
    const res = await api.patch(`/reconciliation/${id}/status`, { status, notes });
    return res.data;
  }
};