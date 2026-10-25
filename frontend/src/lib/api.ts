import {
  JobItem,
  JobListResponse,
  UpdateJobRequest,
  RejectJobRequest,
} from "@/types";

export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim() !== "" && !envUrl.includes("localhost:8080")) {
    let clean = envUrl.trim().replace(/\/api(\/.*)?$/, "").replace(/\/+$/, "");
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `https://${clean}`;
    }
    return clean;
  }

  // If running in browser on a deployed production domain (e.g. Render)
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return "https://rojgar-bridge-backend.onrender.com";
  }

  return envUrl || "http://localhost:8080";
}

// 8. Health Check
export async function fetchHealth(): Promise<{ service: string; status: string }> {
  const res = await fetch(`${getApiBaseUrl()}/health`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.statusText}`);
  }
  return res.json();
}

// 1. Public Jobs Feed
export async function fetchPublishedJobs(params?: {
  type?: string;
  limit?: number;
  offset?: number;
}): Promise<JobListResponse> {
  const query = new URLSearchParams();
  if (params?.type && params.type !== "all") query.set("type", params.type);
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.offset !== undefined) query.set("offset", params.offset.toString());

  const qs = query.toString() ? `?${query.toString()}` : "";
  const res = await fetch(`${getApiBaseUrl()}/api/jobs/published${qs}`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch published jobs: ${res.statusText}`);
  }
  return res.json();
}

// 2. Admin Review Drafts
export async function fetchDraftJobs(params?: {
  type?: string;
  limit?: number;
  offset?: number;
}): Promise<JobListResponse> {
  const query = new URLSearchParams();
  if (params?.type && params.type !== "all") query.set("type", params.type);
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.offset !== undefined) query.set("offset", params.offset.toString());

  const qs = query.toString() ? `?${query.toString()}` : "";
  const res = await fetch(`${getApiBaseUrl()}/api/jobs/drafts${qs}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch draft jobs: ${res.statusText}`);
  }
  return res.json();
}

// 3. Single Job / Draft Details
export async function fetchJobById(id: number | string): Promise<JobItem> {
  const res = await fetch(`${getApiBaseUrl()}/api/jobs/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch job #${id}: ${res.statusText}`);
  }
  return res.json();
}

// 4. Edit Draft
export async function updateJob(
  id: number | string,
  payload: UpdateJobRequest
): Promise<{ message: string; job: JobItem }> {
  const res = await fetch(`${getApiBaseUrl()}/api/jobs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to update job #${id}: ${res.statusText}`);
  }
  return res.json();
}

// 5. 1-Click Publish Draft
export async function publishJob(
  id: number | string
): Promise<{ id: number; status: string; message: string }> {
  const res = await fetch(`${getApiBaseUrl()}/api/jobs/${id}/publish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    throw new Error(`Failed to publish job #${id}: ${res.statusText}`);
  }
  return res.json();
}

// 6. Reject / Archive Draft
export async function rejectJob(
  id: number | string,
  reason?: string
): Promise<{ id: number; status: string; message: string }> {
  const res = await fetch(`${getApiBaseUrl()}/api/jobs/${id}/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason: reason || "" }),
  });

  if (!res.ok) {
    throw new Error(`Failed to reject job #${id}: ${res.statusText}`);
  }
  return res.json();
}

// 7. Trigger Scraping Pipeline
export async function triggerPipeline(): Promise<{ message: string; new_count?: number }> {
  const res = await fetch(`${getApiBaseUrl()}/api/pipeline/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    throw new Error(`Failed to trigger scraping pipeline: ${res.statusText}`);
  }
  return res.json();
}
