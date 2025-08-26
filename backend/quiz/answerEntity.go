package quiz

import "time"

type Answer struct {
	TranslationId string `json:"translationId"`
	Correct       int    `json:"correct"`
	Wrong         int    `json:"wrong"`
	Date          time.Time `json:"date"`
}
