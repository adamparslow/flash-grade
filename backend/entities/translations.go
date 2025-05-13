package entities

type Translation struct {
	Tagalog string `json:"tagalog"`
	English string `json:"english"`
	ID      *int64 `json:"id,omitempty"`
}
