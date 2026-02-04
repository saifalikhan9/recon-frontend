import ReconciliationPage, { ApiResponse, ReconResult } from '@/src/components/reconciliatioin/ReconPage'
export async function fetchReconResults({
    page,
    search,
    statusFilter,
    token,
    limit = 10,
  }: {
    page: number;
    search: string;
    statusFilter: string;
    token: string;
    limit?: number;
  }): Promise<{ data: ReconResult[]; totalPages: number; error: string }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(statusFilter && statusFilter !== "ALL" && { status: statusFilter }),
        // jobId: "current-job-id"
      });
      const res = await fetch(`http://localhost:3001/api/reconciliation/results?${params}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch results");
      const json: ApiResponse = await res.json();
      return { data: json.results, totalPages: json.pages, error: "" };
    } catch (err: any) {
      return { data: [], totalPages: 1, error: err?.message || "Something went wrong" };
    }
  }

 const Page = async() => {
    
  return (
    <div>
        <ReconciliationPage/>
    </div>
  )
}
export default Page