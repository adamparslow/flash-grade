package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"os"
)

const lingvanexAPIURL = "https://api-b2b.backenster.com/b1/api/v3/translate"
const tagalogLanguageCode = "tl_PH"
const englishLanguageCode = "en_AU"

func SearchHandler(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/search", search)
}

func search(w http.ResponseWriter, r *http.Request) {
	englishText := r.URL.Query().Get("english")
	tagalogText := r.URL.Query().Get("tagalog")

	var result string
	var err error

	if englishText != "" {
		result, err = translate(englishText, englishLanguageCode, tagalogLanguageCode)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	if tagalogText != "" {
		result, err = translate(tagalogText, tagalogLanguageCode, englishLanguageCode)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	json.NewEncoder(w).Encode(map[string]string{"result": result})
}

func translate(input string, from string, to string) (string, error) {
	data := map[string]any{
		"from":     from,
		"to":       to,
		"data":     input,
		"platform": "api",
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", lingvanexAPIURL, bytes.NewReader(jsonData))
	if err != nil {
		return "", err
	}

	authCode := "Bearer " + os.Getenv("LINGVANEX_API_KEY")

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", authCode)
	client := &http.Client{}

	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}

	defer resp.Body.Close()
	var respBody bytes.Buffer
	_, err = respBody.ReadFrom(resp.Body)
	if err != nil {
		return "", err
	}

	// Parse the JSON response and extract the "result" field
	var resultObj struct {
		Result string `json:"result"`
	}
	if err := json.Unmarshal(respBody.Bytes(), &resultObj); err != nil {
		return "", err
	}
	return resultObj.Result, nil
}
