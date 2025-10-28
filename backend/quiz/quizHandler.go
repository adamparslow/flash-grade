package quiz

import (
	"backend/db"
	"backend/entities"
	"encoding/json"
	"math/rand"
	"net/http"
	"time"
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
	var answers []entities.Answer

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

type streakResponse struct {
	Streak int `json:"streak"`
	Freeze int `json:"freeze"`
}

func getStreakStatus(w http.ResponseWriter, r *http.Request) {
	dates := getActiveDates()

	streakData := getStreakStatusInternal(dates)

	json.NewEncoder(w).Encode(streakData)
}

func getStreakStatusInternal(dates []time.Time) streakResponse {
	if len(dates) == 0 {
		return streakResponse{
			Streak: 0,
			Freeze: 0,
		}
	}

	seen := make(map[int64]bool)
	var normalisedDates []time.Time

	for _, t := range dates {
		normalisedT := time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, time.Local)

		key := normalisedT.UnixNano()
		if !seen[key] {
			seen[key] = true
			normalisedDates = append(normalisedDates, normalisedT)
		}
	}

	var previous time.Time = normalisedDates[0]
	var streak int = 1
	var freezeCount int = 1
	var freeze int = 0

	for _, date := range normalisedDates[1:] {
		daysDifference := date.Sub(previous).Hours() / 24

		if daysDifference == 1 {
			streak++
			freezeCount++
		} else {
			differenceMinusFreeze := daysDifference - float64(freeze)

			if differenceMinusFreeze < 0 {
				freeze = 0
				streak = 0
				freezeCount = 0
			}

			if freeze > 0 {
				freeze--
				streak++
			} else {
				streak = 1
				freezeCount = 0
			}
		}

		if freezeCount == 5 && freeze < 2 {
			freezeCount = 0
			freeze++
		}

		previous = date
	}

	return streakResponse{
		Streak: streak,
		Freeze: freeze,
	}
}
