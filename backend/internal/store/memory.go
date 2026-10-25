package store

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"rojgar-bridge-backend/internal/models"
)

type Store struct {
	mu   sync.RWMutex
	jobs map[int]*models.JobItem
}

var GlobalStore *Store

func init() {
	now := time.Now()
	publishedTime := now.Add(-2 * time.Hour)

	initialJobs := []*models.JobItem{
		{
			ID:           4,
			Hash:         "9e375da3d021cf301c79dc72a24b397db672520267211986a51eda20d050cd4f",
			SourcePortal: "UPSC",
			Status:       "published",
			Details: models.JobDetails{
				Title:             "Notice: 04 Posts of Homoeopathic Physician in NDMC",
				NoticeType:        "recruitment",
				Organization:      "UPSC",
				Category:          "Central Govt",
				State:             "All India",
				AdvtNumber:        "Advt-04/2026",
				TotalVacancies:    4,
				MinAge:            18,
				MaxAge:            30,
				Qualification:     "Degree in Homoeopathy from a recognised University",
				ApplicationStart:  "2026-10-20",
				ApplicationEnd:    "2026-11-15",
				ExamDate:          "To be announced",
				FeeGeneral:        "₹100",
				FeeReserved:       "₹0 for SC/ST/Women",
				SalaryPayscale:    "Level-10 (₹56,100 - ₹1,77,500)",
				OfficialApplyURL:  "https://upsc.gov.in/whats-new/04 Posts of Homoeopathic Physician in NDMC/Notice",
				OfficialNoticeURL: "https://upsc.gov.in/whats-new/04 Posts of Homoeopathic Physician in NDMC/Notice",
				SummaryPoints: []string{
					"Recruitment notice from UPSC",
					"Detailed eligibility & exam pattern available in official PDF",
				},
				ConfidenceScore: 0.95,
			},
			ReviewNotes: "Reviewed and published.",
			CreatedAt:   now.Add(-4 * time.Hour),
			UpdatedAt:   publishedTime,
			PublishedAt: &publishedTime,
		},
		{
			ID:           1,
			Hash:         "11223344556677889900aabbccddeeff00112233445566778899aabbccddeeff",
			SourcePortal: "SSC",
			Status:       "published",
			Details: models.JobDetails{
				Title:             "SSC CGL 2025 - Combined Graduate Level Examination",
				NoticeType:        "recruitment",
				Organization:      "Staff Selection Commission (SSC)",
				Category:          "Central Govt",
				State:             "All India",
				AdvtNumber:        "SSC-CGL/2025",
				TotalVacancies:    14582,
				MinAge:            18,
				MaxAge:            32,
				Qualification:     "Graduate in any discipline",
				ApplicationStart:  "2026-09-24",
				ApplicationEnd:    "2026-11-24",
				ExamDate:          "Dec 2026 - Jan 2027",
				FeeGeneral:        "₹100",
				FeeReserved:       "₹0 for SC/ST/Women/ESM",
				SalaryPayscale:    "Pay Level-4 to Level-8 (₹25,500 - ₹1,51,100)",
				OfficialApplyURL:  "https://ssc.gov.in",
				OfficialNoticeURL: "https://ssc.gov.in/notices/cgl-2025.pdf",
				SummaryPoints: []string{
					"Major national recruitment for Group B & C officers",
					"Two-tier computer based test",
				},
				ConfidenceScore: 0.99,
			},
			ReviewNotes: "Verified with official SSC gazette.",
			CreatedAt:   now.Add(-24 * time.Hour),
			UpdatedAt:   now.Add(-20 * time.Hour),
			PublishedAt: &publishedTime,
		},
		{
			ID:           2,
			Hash:         "aa223344556677889900aabbccddeeff00112233445566778899aabbccddeeff",
			SourcePortal: "RRB",
			Status:       "published",
			Details: models.JobDetails{
				Title:             "RRB NTPC 2025 - Non-Technical Popular Categories",
				NoticeType:        "recruitment",
				Organization:      "Railway Recruitment Board (RRB)",
				Category:          "Central Govt",
				State:             "All India",
				AdvtNumber:        "CEN 05/2025",
				TotalVacancies:    8113,
				MinAge:            18,
				MaxAge:            33,
				Qualification:     "12th Pass / Graduate",
				ApplicationStart:  "2026-09-14",
				ApplicationEnd:    "2026-10-28",
				ExamDate:          "Feb 2027",
				FeeGeneral:        "₹500 (₹400 refundable after CBT-1)",
				FeeReserved:       "₹250 (Full refund after CBT-1)",
				SalaryPayscale:    "Level 2 to Level 6 (₹19,900 - ₹35,400 basic)",
				OfficialApplyURL:  "https://rrbapply.gov.in",
				OfficialNoticeURL: "https://indianrailways.gov.in",
				SummaryPoints: []string{
					"Station Master, Goods Guard, Senior Clerk typist posts",
					"Selection through CBT 1, CBT 2 & Typing skill test",
				},
				ConfidenceScore: 0.98,
			},
			ReviewNotes: "Verified official RRB notice.",
			CreatedAt:   now.Add(-48 * time.Hour),
			UpdatedAt:   now.Add(-40 * time.Hour),
			PublishedAt: &publishedTime,
		},
		{
			ID:           6,
			Hash:         "80879a5fc2d7556b67433dd2bacfd380042607a2b539b0e663c8eb4835609748",
			SourcePortal: "UPSC",
			Status:       "draft",
			RawNotice: &models.RawNotice{
				SourcePortal: "UPSC",
				NoticeTitle:  "Notice: 704 Posts of Vice-Principal in Education department, GNCTD",
				NoticeURL:    "https://upsc.gov.in/whats-new/704 Posts of Vice-Principal in Education department, GNCTD/Notice",
				AdvtNumber:   "Advt-12/2026",
				PublishedAt:  now.Format(time.RFC3339),
				FetchedAt:    now.Format(time.RFC3339),
				ContentText:  "Title: Notice: 704 Posts of Vice-Principal in Education department, GNCTD. Eligibility: Master's degree from recognized university with B.Ed. Age Limit: 18-35 years. Pay Scale: Level 10.",
			},
			Details: models.JobDetails{
				Title:             "Notice: 704 Posts of Vice-Principal in Education department, GNCTD",
				NoticeType:        "recruitment",
				Organization:      "UPSC",
				Category:          "Central Govt",
				State:             "Delhi",
				AdvtNumber:        "Advt-12/2026",
				TotalVacancies:    704,
				MinAge:            18,
				MaxAge:            35,
				Qualification:     "Master's Degree with B.Ed from recognized institution",
				ApplicationStart:  "2026-10-25",
				ApplicationEnd:    "2026-11-20",
				ExamDate:          "To be announced",
				FeeGeneral:        "₹100",
				FeeReserved:       "₹0 for SC/ST/PH",
				SalaryPayscale:    "Level-10 (₹56,100 - ₹1,77,500)",
				OfficialApplyURL:  "https://upsc.gov.in/whats-new/704 Posts of Vice-Principal in Education department, GNCTD/Notice",
				OfficialNoticeURL: "https://upsc.gov.in/whats-new/704 Posts of Vice-Principal in Education department, GNCTD/Notice",
				SummaryPoints: []string{
					"Recruitment notice from UPSC for GNCTD Education Department",
					"Requires Master degree and B.Ed with teaching experience",
				},
				ConfidenceScore: 0.88,
			},
			ReviewNotes: "Auto-scraped and extracted by AI. Awaiting review.",
			CreatedAt:   now.Add(-1 * time.Hour),
			UpdatedAt:   now.Add(-1 * time.Hour),
			PublishedAt: nil,
		},
		{
			ID:           7,
			Hash:         "778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566",
			SourcePortal: "IBPS",
			Status:       "draft",
			RawNotice: &models.RawNotice{
				SourcePortal: "IBPS",
				NoticeTitle:  "IBPS Specialist Officer (SO XIV) Preliminary Exam Admit Card 2026",
				NoticeURL:    "https://ibps.in/crp-so-xiv/admit-card",
				AdvtNumber:   "CRP-SPL-XIV",
				PublishedAt:  now.Format(time.RFC3339),
				FetchedAt:    now.Format(time.RFC3339),
				ContentText:  "Call Letter for Online Preliminary Examination for recruitment of Specialist Officers in Participating Banks.",
			},
			Details: models.JobDetails{
				Title:             "IBPS SO XIV Preliminary Exam Admit Card 2026 Released",
				NoticeType:        "admit_card",
				Organization:      "Institute of Banking Personnel Selection (IBPS)",
				Category:          "Bank",
				State:             "All India",
				AdvtNumber:        "CRP-SPL-XIV",
				TotalVacancies:    1984,
				MinAge:            20,
				MaxAge:            30,
				Qualification:     "Engineering / IT / MBA / Law / Agriculture Graduate",
				ApplicationStart:  "2026-08-01",
				ApplicationEnd:    "2026-08-28",
				ExamDate:          "Nov 09, 2026",
				FeeGeneral:        "₹850",
				FeeReserved:       "₹175 for SC/ST/PWD",
				SalaryPayscale:    "Scale I Officer (₹48,480 basic)",
				OfficialApplyURL:  "https://ibps.in",
				OfficialNoticeURL: "https://ibps.in/crp-so-xiv/admit-card",
				SummaryPoints: []string{
					"Online prelim call letters available for download",
					"Candidates must bring valid photo ID to examination centre",
				},
				ConfidenceScore: 0.92,
			},
			ReviewNotes: "Scraped admit card release notice.",
			CreatedAt:   now.Add(-30 * time.Minute),
			UpdatedAt:   now.Add(-30 * time.Minute),
			PublishedAt: nil,
		},
	}

	jobMap := make(map[int]*models.JobItem)
	for _, j := range initialJobs {
		jobMap[j.ID] = j
	}

	GlobalStore = &Store{
		jobs: jobMap,
	}
}

func (s *Store) GetPublished(noticeType string, limit, offset int) ([]models.JobItem, int) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var result []models.JobItem
	for _, j := range s.jobs {
		if j.Status == "published" {
			if noticeType != "" && !strings.EqualFold(j.Details.NoticeType, noticeType) {
				continue
			}
			result = append(result, *j)
		}
	}

	total := len(result)
	if offset > total {
		return []models.JobItem{}, total
	}

	end := offset + limit
	if limit <= 0 || end > total {
		end = total
	}

	return result[offset:end], total
}

func (s *Store) GetDrafts(noticeType string, limit, offset int) ([]models.JobItem, int) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var result []models.JobItem
	for _, j := range s.jobs {
		if j.Status == "draft" {
			if noticeType != "" && !strings.EqualFold(j.Details.NoticeType, noticeType) {
				continue
			}
			result = append(result, *j)
		}
	}

	total := len(result)
	if offset > total {
		return []models.JobItem{}, total
	}

	end := offset + limit
	if limit <= 0 || end > total {
		end = total
	}

	return result[offset:end], total
}

func (s *Store) GetByID(id int) (*models.JobItem, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	item, exists := s.jobs[id]
	if !exists {
		return nil, false
	}
	cp := *item
	return &cp, true
}

func (s *Store) Update(id int, details models.JobDetails, reviewNotes string) (*models.JobItem, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	item, exists := s.jobs[id]
	if !exists {
		return nil, fmt.Errorf("job with id %d not found", id)
	}

	item.Details = details
	if reviewNotes != "" {
		item.ReviewNotes = reviewNotes
	}
	item.UpdatedAt = time.Now()

	cp := *item
	return &cp, nil
}

func (s *Store) Publish(id int) (*models.JobItem, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	item, exists := s.jobs[id]
	if !exists {
		return nil, fmt.Errorf("job with id %d not found", id)
	}

	now := time.Now()
	item.Status = "published"
	item.PublishedAt = &now
	item.UpdatedAt = now
	if item.ReviewNotes == "" {
		item.ReviewNotes = "Reviewed and published."
	}

	cp := *item
	return &cp, nil
}

func (s *Store) Reject(id int, reason string) (*models.JobItem, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	item, exists := s.jobs[id]
	if !exists {
		return nil, fmt.Errorf("job with id %d not found", id)
	}

	item.Status = "rejected"
	item.UpdatedAt = time.Now()
	if reason != "" {
		item.ReviewNotes = fmt.Sprintf("Rejected: %s", reason)
	}

	cp := *item
	return &cp, nil
}

// SyncFromScraper fetches draft jobs from the external scraper endpoint and ingests them into the store
func (s *Store) SyncFromScraper(scraperURL string) (int, error) {
	if scraperURL == "" {
		scraperURL = "https://rozgarhub-3tc9.onrender.com/api/jobs/drafts"
	}

	client := &http.Client{
		Timeout: 20 * time.Second,
	}

	resp, err := client.Get(scraperURL)
	if err != nil {
		return 0, fmt.Errorf("failed to call scraper at %s: %w", scraperURL, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("scraper returned status %d", resp.StatusCode)
	}

	var data struct {
		Count int              `json:"count"`
		Jobs  []models.JobItem `json:"jobs"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return 0, fmt.Errorf("failed to decode scraper response: %w", err)
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	newCount := 0
	for _, job := range data.Jobs {
		// Deduplicate: check if notice hash or notice URL is already present in store
		alreadyExists := false
		for _, existing := range s.jobs {
			if existing.Hash != "" && job.Hash != "" && existing.Hash == job.Hash {
				alreadyExists = true
				break
			}
			if existing.RawNotice != nil && job.RawNotice != nil &&
				existing.RawNotice.NoticeURL != "" &&
				existing.RawNotice.NoticeURL == job.RawNotice.NoticeURL {
				alreadyExists = true
				break
			}
		}

		if alreadyExists {
			continue
		}

		// Ensure unique ID
		targetID := job.ID
		if _, taken := s.jobs[targetID]; taken || targetID <= 0 {
			targetID = 1
			for id := range s.jobs {
				if id >= targetID {
					targetID = id + 1
				}
			}
		}

		jobCopy := job
		jobCopy.ID = targetID
		if jobCopy.Status == "" {
			jobCopy.Status = "draft"
		}
		if jobCopy.CreatedAt.IsZero() {
			jobCopy.CreatedAt = time.Now()
		}
		if jobCopy.UpdatedAt.IsZero() {
			jobCopy.UpdatedAt = time.Now()
		}

		s.jobs[targetID] = &jobCopy
		newCount++
	}

	return newCount, nil
}
