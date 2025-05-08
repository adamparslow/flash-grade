package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "10000"
	}

	http.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		fmt.Fprint(w, "Hello from Go backend!")
	})

	fmt.Println("Starting server on port", port)
	http.ListenAndServe(":"+port, nil)
}
