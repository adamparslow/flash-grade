package quiz 

import (
	"backend/db"
	"backend/entities"
	"encoding/json"
	"math/rand"
	"net/http"
	"time"
	"fmt"
)

func QuizHandler(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/questions", getQuestions)
	mux.HandleFunc("POST /api/answers", postAnswers)
	mux.HandleFunc("GET /api/streak", getStreakStatus)
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
				Type:         "SINGLE",
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
				Type:         "MULTI",
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
				Type:         "MATCH",
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

func postAnswers(w http.ResponseWriter, r *http.Request) {
	var answers []Answer 

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&answers); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	for _, ans := range answers {
		if ans.TranslationId == "" {
			http.Error(w, "Missing translationId in one or more answers", http.StatusBadRequest)
			return
		}
	}

	storeAnswers(answers)
}

func getStreakStatus(w http.ResponseWriter, r *http.Request) {
	dates := getActiveDates()
	var previous time.Time = dates[0]
	var streak int = 0
	var freezeCount int = 0
	var freeze int = 0

	for _, date := range dates[1:] {
		fmt.Println(date.Sub(previous).Hours())

		daysDifference := date.Sub(previous).Hours() / 24

		if (daysDifference == 1) {
			streak++
			freezeCount++
		} else {
			differenceMinusFreeze := daysDifference - freeze

			if (differenceMinusFreeze < 0) {
				freeze = 0
				streak = 0
				freezeCount = 0
			}

			if (freeze > 0) {
				freeze--
			} else {
				streak = 0
				freezeCount = 0
			}
		}

		if (freezeCount == 5 && freeze < 2) {
			freezeCount = 0
			freeze++
		}

		previous = date
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"streak": streak,
		"freeze": freeze,
	})
}
