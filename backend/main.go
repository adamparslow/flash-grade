package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
)

type Translation struct {
	Tagalog string `json:"tagalog"`
	English string `json:"english"`
	ID      *int64 `json:"id,omitempty"`
}

type SuccessResponse struct {
	Success bool `json:"success"`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "10000"
	}

	http.HandleFunc("/api/translations", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println(r.Method)
		fmt.Println(r.URL.Path)

		if r.Method == "GET" {
			getTranslations(w, r)
		} else if r.Method == "POST" {
			createTranslation(w, r)
		}
	})

	http.Handle("/api/translations/", corsMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println(r.Method)
		fmt.Println(r.URL.Path)

		if r.Method == "PUT" {
			updateTranslation(w, r)
		} else if r.Method == "DELETE" {
			deleteTranslation(w, r)
		}
	})))

	fmt.Println("Starting server on port", port)
	http.ListenAndServe(":"+port, nil)
}

func getTranslations(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	translations, err := GetTranslationsFromDB()

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

	var translation Translation
	err := json.NewDecoder(r.Body).Decode(&translation)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	id, err := CreateTranslationInDB(translation)

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

	var translation Translation
	err = json.NewDecoder(r.Body).Decode(&translation)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	translation.ID = &id

	err = UpdateTranslationInDB(translation)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	successResponse := SuccessResponse{
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

	err = DeleteTranslationInDB(id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	successResponse := SuccessResponse{
		Success: true,
	}

	json.NewEncoder(w).Encode(successResponse)
}

func getIdFromPath(r *http.Request) (int64, error) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/translations/")
	fmt.Println(idStr)

	id, err := strconv.ParseInt(idStr, 10, 64)

	return id, err
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow all origins for demo — you should lock this down in production
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight (OPTIONS) request
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		// Continue to the next handler
		next.ServeHTTP(w, r)
	})
}
