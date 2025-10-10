package entities

import "time"

type Answer struct {
	ID            *int64    `json:"id,omitempty"`
	TranslationId string    `json:"translationId"`
	Correct       int       `json:"correct"`
	Wrong         int       `json:"wrong"`
	Date          time.Time `json:"date"`
}
