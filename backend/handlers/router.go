package handlers

import (
	"net/http"
)

func Router() http.Handler {
	router := http.NewServeMux()

	TranslationsHandler(router)
	QuestionsHandler(router)

	corsRoute := CorsMiddleware(router)

	return corsRoute
}
