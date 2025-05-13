package main

import (
	"backend/handlers"
	"fmt"
	"net/http"
	"os"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "10000"
	}

	mainMux := http.NewServeMux()
	mainMux.Handle("/", handlers.TranslationsHandler())

	corsHandler := handlers.CorsMiddleware(mainMux)

	fmt.Println("Starting server on port", port)
	http.ListenAndServe(":"+port, corsHandler)
}
