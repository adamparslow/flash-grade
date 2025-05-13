package handlers

import (
	"backend/db"
	"backend/entities"
	"encoding/json"
	"math/rand"
	"net/http"
)

func QuestionsHandler(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/questions", getQuestions)
}

func getQuestions(w http.ResponseWriter, r *http.Request) {
	translations, err := db.GetTranslationsFromDB()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	questions := []entities.Question{}

	randomTranslations := randomiseTranslations(translations)
	currentIndex := 0

	for i := 0; i < 15; i++ {
		questionType := getRandomQuestionType()
		var question entities.Question
		switch questionType {
		case "SINGLE":
			translation := randomTranslations[currentIndex]

			if currentIndex < len(randomTranslations)-1 {
				currentIndex++
			} else {
				currentIndex = 0
				randomTranslations = randomiseTranslations(translations)
			}

			question = entities.Question{
				Translations: []entities.Translation{translation},
				Alternatives: []string{},
				QuestionType: "SINGLE",
				EnglishFirst: isEnglishQuestion(),
			}
		case "MULTI":
			var questionTranslations []entities.Translation
			if currentIndex < len(randomTranslations)-4 {
				questionTranslations = randomTranslations[currentIndex : currentIndex+4]
				currentIndex += 4
			} else {
				randomTranslations = randomiseTranslations(translations)
				currentIndex = 0
				questionTranslations = randomTranslations[currentIndex : currentIndex+4]
				currentIndex += 4
			}

			question = entities.Question{
				Translations: questionTranslations,
				Alternatives: []string{},
				QuestionType: "MULTI",
				EnglishFirst: isEnglishQuestion(),
			}

		case "MATCH":
			var questionTranslations []entities.Translation
			if currentIndex < len(randomTranslations)-4 {
				questionTranslations = randomTranslations[currentIndex : currentIndex+4]
				currentIndex += 4
			} else {
				randomTranslations = randomiseTranslations(translations)
				currentIndex = 0
				questionTranslations = randomTranslations[currentIndex : currentIndex+4]
				currentIndex += 4
			}

			question = entities.Question{
				Translations: questionTranslations,
				Alternatives: []string{},
				QuestionType: "MATCH",
				EnglishFirst: isEnglishQuestion(),
			}
		}

		questions = append(questions, question)
	}

	json.NewEncoder(w).Encode(questions)
}

func getRandomQuestionType() string {
	return []string{"SINGLE", "MULTI", "MATCH"}[rand.Intn(3)]
}

func randomiseTranslations(arr []entities.Translation) []entities.Translation {
	arrCopy := make([]entities.Translation, len(arr))
	copy(arrCopy, arr)
	rand.Shuffle(len(arr), func(i, j int) {
		arr[i], arr[j] = arr[j], arr[i]
	})
	return arr
}

func isEnglishQuestion() bool {
	return rand.Intn(2) == 0
}
