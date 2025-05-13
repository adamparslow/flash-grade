package entities

type Question struct {
	Translations []Translation `json:"translations"`
	EnglishFirst bool          `json:"englishFirst"`
	Alternatives []string      `json:"alternatives,omitempty"`
	QuestionType string        `json:"questionType" enum:"SINGLE,MULTI,MATCH"`
}
