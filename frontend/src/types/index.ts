export type NoticeType =
  | "recruitment"
  | "result"
  | "admit_card"
  | "interview_schedule";

export interface RawNotice {
  source_portal: string;
  notice_title: string;
  notice_url: string;
  advt_number?: string;
  published_at?: string;
  fetched_at?: string;
  content_text?: string;
}

export interface JobDetails {
  title: string;
  notice_type: NoticeType | string;
  organization: string;
  category: string;
  state: string;
  advt_number?: string;
  total_vacancies: number;
  min_age?: number;
  max_age?: number;
  qualification: string;
  application_start?: string;
  application_end?: string;
  exam_date?: string;
  fee_general?: string;
  fee_reserved?: string;
  salary_payscale?: string;
  official_apply_url?: string;
  official_notice_url?: string;
  summary_points?: string[];
  confidence_score?: number;
}

export interface JobItem {
  id: number;
  hash: string;
  source_portal: string;
  status: "published" | "draft" | "rejected";
  raw_notice?: RawNotice;
  details: JobDetails;
  review_notes?: string;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
}

export interface JobListResponse {
  count: number;
  jobs: JobItem[];
}

export interface UpdateJobRequest {
  details: Partial<JobDetails>;
  review_notes?: string;
}

export interface RejectJobRequest {
  reason?: string;
}

// For UI Category/Filter states
export interface FilterState {
  searchQuery: string;
  selectedNoticeType: string;
  categories: string[];
  qualifications: string[];
  states: string[];
  sortBy: "latest" | "deadline" | "posts";
}
