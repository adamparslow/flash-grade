package handlers

import (
	"net/http"
)

func Router() http.Handler {
	router := http.NewServeMux()

	TranslationsHandler(router)
	QuestionsHandler(router)
	SearchHandler(router)

	corsRoute := CorsMiddleware(router)

	return corsRoute
}
