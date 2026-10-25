package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"rojgar-bridge-backend/internal/models"
	"rojgar-bridge-backend/internal/store"
)

// 1. Public Jobs Feed: GET /api/jobs/published
func GetPublishedJobs(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	noticeType := q.Get("type")
	limitStr := q.Get("limit")
	offsetStr := q.Get("offset")

	limit := 20
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}

	offset := 0
	if o, err := strconv.Atoi(offsetStr); err == nil && o >= 0 {
		offset = o
	}

	jobs, count := store.GlobalStore.GetPublished(noticeType, limit, offset)

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(models.JobListResponse{
		Count: count,
		Jobs:  jobs,
	})
}

// 2. Admin Review Drafts: GET /api/jobs/drafts
func GetDraftJobs(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	noticeType := q.Get("type")
	limitStr := q.Get("limit")
	offsetStr := q.Get("offset")

	limit := 20
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}

	offset := 0
	if o, err := strconv.Atoi(offsetStr); err == nil && o >= 0 {
		offset = o
	}

	jobs, count := store.GlobalStore.GetDrafts(noticeType, limit, offset)

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(models.JobListResponse{
		Count: count,
		Jobs:  jobs,
	})
}

// 3. Single Job / Draft Details: GET /api/jobs/{id}
func GetJobByID(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "invalid job id", http.StatusBadRequest)
		return
	}

	job, found := store.GlobalStore.GetByID(id)
	if !found {
		http.Error(w, "job not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(job)
}

// 4. Edit Draft: PUT /api/jobs/{id}
func UpdateJob(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "invalid job id", http.StatusBadRequest)
		return
	}

	var req models.UpdateJobRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	updatedJob, err := store.GlobalStore.Update(id, req.Details, req.ReviewNotes)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "job updated successfully",
		"job":     updatedJob,
	})
}

// 5. 1-Click Publish Draft: POST /api/jobs/{id}/publish
func PublishJob(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "invalid job id", http.StatusBadRequest)
		return
	}

	job, err := store.GlobalStore.Publish(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"id":      job.ID,
		"status":  "published",
		"message": "job published successfully",
	})
}

// 6. Reject / Archive Draft: POST /api/jobs/{id}/reject
func RejectJob(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "invalid job id", http.StatusBadRequest)
		return
	}

	var req models.RejectJobRequest
	_ = json.NewDecoder(r.Body).Decode(&req)

	job, err := store.GlobalStore.Reject(id, req.Reason)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"id":      job.ID,
		"status":  "rejected",
		"message": "job rejected",
	})
}

// 7. Trigger Scraping Pipeline: POST /api/pipeline/run
func TriggerPipeline(w http.ResponseWriter, r *http.Request) {
	scraperURL := os.Getenv("SCRAPER_URL")
	if scraperURL == "" {
		scraperURL = "https://rozgarhub-3tc9.onrender.com/api/jobs/drafts"
	}

	newCount, err := store.GlobalStore.SyncFromScraper(scraperURL)
	if err != nil {
		log.Printf("⚠️ Scraper sync error: %v", err)
		http.Error(w, fmt.Sprintf("Failed to sync from scraper: %v", err), http.StatusBadGateway)
		return
	}

	log.Printf("📥 Scraper sync complete: %d new draft notices imported", newCount)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"message":   fmt.Sprintf("Scraper sync complete! %d new draft notices imported.", newCount),
		"new_count": newCount,
	})
}
