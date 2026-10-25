import {
  JobItem,
  JobListResponse,
  UpdateJobRequest,
  RejectJobRequest,
} from "@/types";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const API_BASE_URL = rawBaseUrl.replace(/\/api(\/.*)?$/, "").replace(/\/+$/, "");

// 8. Health Check
export async function fetchHealth(): Promise<{ service: string; status: string }> {
  const res = await fetch(`${API_BASE_URL}/health`, {
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
  const res = await fetch(`${API_BASE_URL}/api/jobs/published${qs}`, {
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
  const res = await fetch(`${API_BASE_URL}/api/jobs/drafts${qs}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch draft jobs: ${res.statusText}`);
  }
  return res.json();
}

// 3. Single Job / Draft Details
export async function fetchJobById(id: number | string): Promise<JobItem> {
  const res = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
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
  const res = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
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
  const res = await fetch(`${API_BASE_URL}/api/jobs/${id}/publish`, {
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
  const res = await fetch(`${API_BASE_URL}/api/jobs/${id}/reject`, {
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
  const res = await fetch(`${API_BASE_URL}/api/pipeline/run`, {
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
