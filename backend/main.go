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

	router := handlers.Router()

	fmt.Println("Starting server on port", port)
	http.ListenAndServe(":"+port, router)
}
