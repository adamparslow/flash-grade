package handlers

import (
	"backend/quiz"
	"backend/translations"
	"net/http"
)

func Router() http.Handler {
	router := http.NewServeMux()

	translations.TranslationsHandler(router)
	quiz.QuizHandler(router)
	SearchHandler(router)

	corsRoute := CorsMiddleware(router)

	return corsRoute
}
