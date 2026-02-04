
import { StatCard } from './StatsCard'

type StatsResponse = {
  total: string,
  breakdown: { matched: string, partial: string, unmatched: string, duplicate: string },
  accuracy: string
}
export const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2M3MDY4LWQ0NTYtNDA5Mi1hZTFmLWRiM2Y1MGYyOTY5YSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3MDIxMTgxMCwiZXhwIjoxNzcwMjk4MjEwfQ.U3GoOz5M9-kQzQGUl942hS-TedY4TwK04--3YffVD1s";
export const reconUrl = "http://localhost:3001/api/reconciliation"
// Ensure all values in the response are strings
async function getStats(): Promise<StatsResponse> {
  const res = await fetch(`${reconUrl}/stats`, {
    headers: {
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();


  return {
    ...data,
    total: data.total?.toString?.() ?? '',
    breakdown: {
      matched: data.breakdown?.matched?.toString?.() ?? '',
      partial: data.breakdown?.partial?.toString?.() ?? '',
      unmatched: data.breakdown?.unmatched?.toString?.() ?? '',
      duplicate: data.breakdown?.duplicate?.toString?.() ?? ''
    },
    accuracy: data.accuracy?.toString?.() ?? ''
  };
}

export const Stats = async () => {
  try {
    const data = await getStats()
    console.log(data);

    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Total Records" value={data.total} />
        <StatCard title="Matched" value={data.breakdown.matched} className="text-green-600" />
        <StatCard title="Unmatched" value={data.breakdown.unmatched} className="text-orange-500" />
        <StatCard title="Partial" value={data.breakdown.partial} />
        <StatCard title="Duplicate" value={data.breakdown.duplicate} />
      </div>
    )
  } catch (error) {
    console.error("Stats fetch failed:", error)

    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Total Records" value="—" />
        <StatCard title="Matched" value="—" />
        <StatCard title="Unmatched" value="—" />
        <StatCard title="Partial" value="—" />
        <StatCard title="Duplicate" value="—" />
      </div>
    )
  }
}

