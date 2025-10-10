package quiz

import (
	"backend/db"
	"backend/entities"
	"log"
	"time"
)

func storeAnswers(answers []entities.Answer) {
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

func GetAnswersFromDB() ([]entities.Answer, error) {
	dbClient := db.GetDB()

	rows, err := dbClient.Query("SELECT id, translation_id, correct, wrong, date FROM translations ORDER BY tagalog ASC")

	if err != nil {
		return nil, err
	}

	var answers []entities.Answer
	defer rows.Close()

	for rows.Next() {
		var answer entities.Answer
		err := rows.Scan(&answer.ID, &answer.TranslationId, &answer.Correct, &answer.Wrong, &answer.Date)
		if err != nil {
			return nil, err
		}
		answers = append(answers, answer)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return answers, nil
}

func CreateAnswersTable() {
	dbClient := db.GetDB()

	_, err := dbClient.Exec("CREATE TABLE IF NOT EXISTS answers (id SERIAL PRIMARY KEY, translation_id VARCHAR(255), correct INT, wrong INT, date TIMESTAMP)")

	if err != nil {
		log.Fatal(err)
	}
}

func getActiveDates() []time.Time {
	dbClient := db.GetDB()

	rows, err := dbClient.Query("SELECT DISTINCT date FROM answers ORDER BY date ASC")

	if err != nil {
		log.Fatal(err)
	}

	defer rows.Close()

	dates := []time.Time{}

	for rows.Next() {
		var date time.Time
		err := rows.Scan(&date)

		if err != nil {
			log.Fatal(err)
		}

		dates = append(dates, date)
	}

	return dates
}
