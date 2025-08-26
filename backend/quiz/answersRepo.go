package quiz

import (
	"backend/db"
	"log"
)

func storeAnswers(answers []Answer) {
	dbClient := db.GetDB()

	for _, answer := range answers {
		_, err := dbClient.Exec(
			"INSERT INTO answers (translation_id, correct, wrong, date) VALUES ($1, $2, $3, $4)", 
			answer.TranslationId, answer.Correct, answer.Wrong, answer.Date)

		if err != nil {
			log.Fatal(err)
		}
	}
}

func CreateAnswersTable() {
	dbClient := db.GetDB()

	_, err := dbClient.Exec("CREATE TABLE IF NOT EXISTS answers (id SERIAL PRIMARY KEY, translation_id VARCHAR(255), correct INT, wrong INT, date TIMESTAMP)")

	if err != nil {
		log.Fatal(err)
	}
}