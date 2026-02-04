import api from "@/lib/axios";

export const reconService = {
  // Stats
  getStats: async () => {
    const res = await api.get("/reconciliation/stats");
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
  }
};