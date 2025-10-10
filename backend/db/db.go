package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	_ "github.com/mattn/go-sqlite3" // SQLite driver

	"backend/entities"
)

var db *sql.DB
var sqliteDb *sql.DB

func init() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found — using system environment variables")
	}
	// initDB()
	initSqliteDB()

	// migrateToSqlite()
}

// func initDB() {
// 	connStr := os.Getenv("DATABASE_URL") // safer than hardcoding
// 	var err error
// 	db, err = sql.Open("postgres", connStr)
// 	if err != nil {
// 		log.Fatal("Error opening database:", err)
// 	}

// 	err = db.Ping()
// 	if err != nil {
// 		log.Fatal("Cannot connect to the database:", err)
// 	}

// 	fmt.Println("Connected to the database.")
// }

func initSqliteDB() {
	dbPath := os.Getenv("SQLITE_DB_PATH")
	var err error

	sqliteDb, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatal("Error opening database:", err)
	}

	// SQLite doesn't need Ping to verify remote connectivity, but it's still safe to check
	err = db.Ping()
	if err != nil {
		log.Fatal("Cannot connect to the database:", err)
	}

	fmt.Println("Connected to SQLite database:", dbPath)
}

// func migrateToSqlite() {
// 	// Migrate translations
// 	_, err := sqliteDb.Exec("CREATE TABLE IF NOT EXISTS translations (id SERIAL PRIMARY KEY, tagalog TEXT, english TEXT)")
// 	if err != nil {
// 		log.Fatal("Can't create translations table")
// 	}

// 	translations, err := GetTranslationsFromDB()
// 	if err != nil {
// 		log.Fatal("Error getting translations:", err)
// 	}

// 	for _, translation := range translations {
// 		_, err := sqliteDb.Exec(
// 			`INSERT INTO translations (id, tagalog, english)
// 				VALUES (?, ?, ?)
// 				ON CONFLICT(id) DO UPDATE SET
// 				tagalog = excluded.tagalog,
// 				english = excluded.english;`,
// 			translation.ID,
// 			translation.Tagalog,
// 			translation.English,
// 		)
// 		if err != nil {
// 			log.Fatal("Error inserting translation", err)
// 		}
// 	}

// 	fmt.Println("Finished migrating translations")

// 	// Migrate answers
// 	_, err2 := sqliteDb.Exec("CREATE TABLE IF NOT EXISTS answers (id SERIAL PRIMARY KEY, translation_id VARCHAR(255), correct INT, wrong INT, date TIMESTAMP)")
// 	if err2 != nil {
// 		log.Fatal("Error creating answers table", err2)
// 	}

// 	answers, err := GetAnswersFromDB()
// 	if err != nil {
// 		log.Fatal("Error getting answers", err2)
// 	}

// 	for _, answer := range answers {
// 		_, err := sqliteDb.Exec(
// 			`INSERT INTO answers (id, translation_id, correct, wrong, date)
// 				VALUES (?, ?, ?, ?, ?)
// 				ON CONFLICT(id) DO UPDATE SET
// 				translation_id = excluded.translation_id,
// 				correct = excluded.correct,
// 				wrong = excluded.wrong,
// 				date = excluded.date;`,
// 			answer.ID,
// 			answer.TranslationId,
// 			answer.Correct,
// 			answer.Wrong,
// 			answer.Date,
// 		)
// 		if err != nil {
// 			log.Fatal("Error inserting translation", err)
// 		}
// 	}
// 	fmt.Println("Finished migrating answers")
// }

func GetDB() *sql.DB {
	return sqliteDb
}

func GetAnswersFromDB() ([]entities.Answer, error) {
	rows, err := db.Query("SELECT id, translation_id, correct, wrong, date FROM answers")

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

func GetTranslationsFromDB() ([]entities.Translation, error) {
	dbClient := GetDB()
	rows, err := dbClient.Query("SELECT id, tagalog, english FROM translations ORDER BY tagalog ASC")

	if err != nil {
		return nil, err
	}

	var translations []entities.Translation
	defer rows.Close()

	for rows.Next() {
		var t entities.Translation
		err := rows.Scan(&t.ID, &t.Tagalog, &t.English)
		if err != nil {
			return nil, err
		}
		translations = append(translations, t)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return translations, nil
}

func UpdateTranslationInDB(translation entities.Translation) error {
	dbClient := GetDB()
	_, err := dbClient.Exec("UPDATE translations SET tagalog = $1, english = $2 WHERE id = $3", translation.Tagalog, translation.English, translation.ID)
	return err
}

func CreateTranslationInDB(translation entities.Translation) (int64, error) {
	dbClient := GetDB()
	var id int64

	res, err := dbClient.Exec(
		"INSERT INTO translations (tagalog, english) VALUES (?, ?)",
		translation.Tagalog,
		translation.English,
	)
	if err != nil {
		return 0, err
	}

	id, err = res.LastInsertId()
	if err != nil {
		return 0, err
	}

	return id, nil
}

func DeleteTranslationInDB(id int64) error {
	dbClient := GetDB()
	_, err := dbClient.Exec("DELETE FROM translations WHERE id = $1", id)
	return err
}
