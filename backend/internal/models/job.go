package models

import "time"

type RawNotice struct {
	SourcePortal string `json:"source_portal"`
	NoticeTitle  string `json:"notice_title"`
	NoticeURL    string `json:"notice_url"`
	AdvtNumber   string `json:"advt_number"`
	PublishedAt  string `json:"published_at"`
	FetchedAt    string `json:"fetched_at"`
	ContentText  string `json:"content_text"`
}

type JobDetails struct {
	Title             string   `json:"title"`
	NoticeType        string   `json:"notice_type"` // "recruitment" | "result" | "admit_card" | "interview_schedule"
	Organization      string   `json:"organization"`
	Category          string   `json:"category"`
	State             string   `json:"state"`
	AdvtNumber        string   `json:"advt_number"`
	TotalVacancies    int      `json:"total_vacancies"`
	MinAge            int      `json:"min_age,omitempty"`
	MaxAge            int      `json:"max_age,omitempty"`
	Qualification     string   `json:"qualification"`
	ApplicationStart  string   `json:"application_start"`
	ApplicationEnd    string   `json:"application_end"`
	ExamDate          string   `json:"exam_date"`
	FeeGeneral        string   `json:"fee_general"`
	FeeReserved       string   `json:"fee_reserved"`
	SalaryPayscale    string   `json:"salary_payscale"`
	OfficialApplyURL  string   `json:"official_apply_url"`
	OfficialNoticeURL string   `json:"official_notice_url"`
	SummaryPoints     []string `json:"summary_points,omitempty"`
	ConfidenceScore   float64  `json:"confidence_score,omitempty"`
}

type JobItem struct {
	ID           int         `json:"id"`
	Hash         string      `json:"hash"`
	SourcePortal string      `json:"source_portal"`
	Status       string      `json:"status"` // "published" | "draft" | "rejected"
	RawNotice    *RawNotice  `json:"raw_notice,omitempty"`
	Details      JobDetails  `json:"details"`
	ReviewNotes  string      `json:"review_notes"`
	CreatedAt    time.Time   `json:"created_at"`
	UpdatedAt    time.Time   `json:"updated_at"`
	PublishedAt  *time.Time  `json:"published_at"`
}

type JobListResponse struct {
	Count int       `json:"count"`
	Jobs  []JobItem `json:"jobs"`
}

type UpdateJobRequest struct {
	Details     JobDetails `json:"details"`
	ReviewNotes string     `json:"review_notes"`
}

type RejectJobRequest struct {
	Reason string `json:"reason,omitempty"`
}
