package main

import (
	"backend/handlers"
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	log.Println("Starting server setup")
	port := os.Getenv("PORT")
	log.Println("Port", port)
	if port == "" {
		port = "10000"
	}

	router := handlers.Router()

	fmt.Println("Starting server on port", port)
	http.ListenAndServe(":"+port, router)
}
