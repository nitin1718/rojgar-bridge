package main

import (
	"fmt"
	"log"
	"net/http"

	"rojgar-bridge-backend/internal/api"
	"rojgar-bridge-backend/internal/config"
	"rojgar-bridge-backend/internal/store"
)

func main() {
	cfg := config.Load()
	router := api.NewRouter(cfg)

	// Fetch initial drafts from scraper in the background
	go func() {
		log.Printf("🔄 Connecting to scraper at %s...", cfg.ScraperURL)
		count, err := store.GlobalStore.SyncFromScraper(cfg.ScraperURL)
		if err != nil {
			log.Printf("⚠️ Initial scraper sync warning: %v", err)
		} else {
			log.Printf("📥 Initial scraper sync complete: %d notices imported", count)
		}
	}()

	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("🚀 Rojgar Bridge Backend running on http://localhost%s", addr)
	log.Printf("🌐 Allowed CORS Origin: %s", cfg.AllowedOrigin)

	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
