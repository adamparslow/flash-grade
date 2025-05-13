package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

func getIdFromPath(r *http.Request) (int64, error) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/translations/")
	fmt.Println(idStr)

	id, err := strconv.ParseInt(idStr, 10, 64)

	return id, err
}

func CorsMiddleware(next http.Handler) http.Handler {
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
