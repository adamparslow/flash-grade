package handlers

import (
	"net/http"
	"backend/quiz"
)

func Router() http.Handler {
	router := http.NewServeMux()

	TranslationsHandler(router)
	quiz.QuizHandler(router)
	SearchHandler(router)

	corsRoute := CorsMiddleware(router)

	return corsRoute
}
