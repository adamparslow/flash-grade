package handlers

import (
	"backend/db"
	"backend/entities"
	"encoding/json"
	"fmt"
	"net/http"
)

func TranslationsHandler() http.Handler {
	translationsMux := http.NewServeMux()

	translationsMux.HandleFunc("GET /api/translations", func(w http.ResponseWriter, r *http.Request) {
		getTranslations(w, r)
	})

	translationsMux.HandleFunc("POST /api/translations", func(w http.ResponseWriter, r *http.Request) {
		createTranslation(w, r)
	})

	translationsMux.HandleFunc("PUT /api/translations/{translationId}", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("PUT /api/translations/{translationId}")
		fmt.Println(r.PathValue("translationId"))
		updateTranslation(w, r)
	})

	translationsMux.HandleFunc("DELETE /api/translations/{translationId}", func(w http.ResponseWriter, r *http.Request) {
		deleteTranslation(w, r)
	})

	return translationsMux
}

func getTranslations(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	translations, err := db.GetTranslationsFromDB()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	encoder := json.NewEncoder(w)
	encoder.Encode(translations)
}

func createTranslation(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

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
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	id, err := getIdFromPath(r)
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
	translation.ID = &id

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
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	id, err := getIdFromPath(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = db.DeleteTranslationInDB(id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	successResponse := entities.SuccessResponse{
		Success: true,
	}

	json.NewEncoder(w).Encode(successResponse)
}
