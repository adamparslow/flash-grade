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
	initSqliteDB()

}

func initSqliteDB() {
	dbPath := os.Getenv("SQLITE_DB_PATH")
	var err error

	sqliteDb, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatal("Error opening database:", err)
	}

	// SQLite doesn't need Ping to verify remote connectivity, but it's still safe to check
	sqliteDb.Ping()
	if err != nil {
		log.Fatal("Cannot connect to the database:", err)
	}

	fmt.Println("Connected to SQLite database:", dbPath)
}

func GetDB() *sql.DB {
	return sqliteDb
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
