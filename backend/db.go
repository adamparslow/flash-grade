package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var db *sql.DB

func init() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found — using system environment variables")
	}
	initDB()
}

func initDB() {
	connStr := os.Getenv("DATABASE_URL") // safer than hardcoding
	fmt.Println(connStr)
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Error opening database:", err)
	}

	fmt.Println(db.Stats())

	err = db.Ping()
	if err != nil {
		log.Fatal("Cannot connect to the database:", err)
	}

	fmt.Println("Connected to the database.")
}

func GetTranslationsFromDB() ([]Translation, error) {
	rows, err := db.Query("SELECT id, tagalog, english FROM translations ORDER BY tagalog ASC")

	if err != nil {
		return nil, err
	}

	var translations []Translation
	defer rows.Close()

	for rows.Next() {
		var t Translation
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

func UpdateTranslationInDB(translation Translation) error {
	_, err := db.Exec("UPDATE translations SET tagalog = $1, english = $2 WHERE id = $3", translation.Tagalog, translation.English, translation.ID)
	return err
}

func CreateTranslationInDB(translation Translation) (int64, error) {
	var id int64

	err := db.QueryRow("INSERT INTO translations (tagalog, english) VALUES ($1, $2) RETURNING id", translation.Tagalog, translation.English).Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, err
}

func DeleteTranslationInDB(id int64) error {
	_, err := db.Exec("DELETE FROM translations WHERE id = $1", id)
	return err
}
