package api

import (
	"net/http"

	"rojgar-bridge-backend/internal/api/handlers"
	"rojgar-bridge-backend/internal/api/middleware"
	"rojgar-bridge-backend/internal/config"
)

func NewRouter(cfg *config.Config) http.Handler {
	mux := http.NewServeMux()

	// 8. Health Check
	mux.HandleFunc("GET /health", handlers.HealthCheck)
	mux.HandleFunc("GET /api/health", handlers.HealthCheck)

	// 1. Public Jobs Feed
	mux.HandleFunc("GET /api/jobs/published", handlers.GetPublishedJobs)

	// 2. Admin Review Drafts
	mux.HandleFunc("GET /api/jobs/drafts", handlers.GetDraftJobs)

	// 3. Single Job Details & 4. Edit Draft
	mux.HandleFunc("GET /api/jobs/{id}", handlers.GetJobByID)
	mux.HandleFunc("PUT /api/jobs/{id}", handlers.UpdateJob)

	// 5. 1-Click Publish & 6. Reject Draft
	mux.HandleFunc("POST /api/jobs/{id}/publish", handlers.PublishJob)
	mux.HandleFunc("POST /api/jobs/{id}/reject", handlers.RejectJob)

	// 7. Trigger Scraping Pipeline
	mux.HandleFunc("POST /api/pipeline/run", handlers.TriggerPipeline)

	// Apply Middlewares
	handler := middleware.Logger(mux)
	handler = middleware.CORS(cfg.AllowedOrigin)(handler)

	return handler
}
