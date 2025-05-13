package handlers

import (
	"backend/entities"
	"encoding/json"
	"net/http"
)

func QuestionsHandler(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/questions", getQuestions)
}

func getQuestions(w http.ResponseWriter, r *http.Request) {
	successResponse := entities.SuccessResponse{
		Success: true,
	}

	json.NewEncoder(w).Encode(successResponse)
}
