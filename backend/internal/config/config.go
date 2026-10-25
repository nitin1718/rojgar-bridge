package config

import (
	"os"
)

type Config struct {
	Port          string
	AllowedOrigin string
	Environment   string
	ScraperURL    string
}

func Load() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	allowedOrigin := os.Getenv("ALLOWED_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:3000"
	}

	env := os.Getenv("ENV")
	if env == "" {
		env = "development"
	}

	scraperURL := os.Getenv("SCRAPER_URL")
	if scraperURL == "" {
		scraperURL = "https://rozgarhub-3tc9.onrender.com/api/jobs/drafts"
	}

	return &Config{
		Port:          port,
		AllowedOrigin: allowedOrigin,
		Environment:   env,
		ScraperURL:    scraperURL,
	}
}
