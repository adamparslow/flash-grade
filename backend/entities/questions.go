package entities

type Question struct {
	Translations []Translation `json:"translations"`
	EnglishFirst bool          `json:"englishFirst"`
	Alternatives []string      `json:"alternatives,omitempty"`
	Type         string        `json:"type" enum:"SINGLE,MULTI,MATCH"`
}
