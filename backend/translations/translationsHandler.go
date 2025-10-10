package translations

import (
	"backend/db"
	"backend/entities"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

func TranslationsHandler(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/translations", getTranslations)
	mux.HandleFunc("POST /api/translations", createTranslation)
	mux.HandleFunc("PUT /api/translations/{translationId}", updateTranslation)
	mux.HandleFunc("DELETE /api/translations/{translationId}", deleteTranslation)
}

func getTranslations(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Getting translations")

	translations, err := db.GetTranslationsFromDB()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	encoder := json.NewEncoder(w)
	encoder.Encode(translations)
}

func createTranslation(w http.ResponseWriter, r *http.Request) {
	var translation entities.Translation
	err := json.NewDecoder(r.Body).Decode(&translation)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	id, err := db.CreateTranslationInDB(translation)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	translation.ID = &id
	json.NewEncoder(w).Encode(translation)
}

func updateTranslation(w http.ResponseWriter, r *http.Request) {
	translationIdPathValue := r.PathValue("translationId")
	translationId, err := strconv.ParseInt(translationIdPathValue, 10, 64)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var translation entities.Translation
	err = json.NewDecoder(r.Body).Decode(&translation)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	translation.ID = &translationId

	err = db.UpdateTranslationInDB(translation)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	successResponse := entities.SuccessResponse{
		Success: true,
	}

	json.NewEncoder(w).Encode(successResponse)
}

func deleteTranslation(w http.ResponseWriter, r *http.Request) {
	translationIdPathValue := r.PathValue("translationId")
	translationId, err := strconv.ParseInt(translationIdPathValue, 10, 64)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = db.DeleteTranslationInDB(translationId)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	successResponse := entities.SuccessResponse{
		Success: true,
	}

	json.NewEncoder(w).Encode(successResponse)
}
