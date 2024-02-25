package models

type MatchPlayer struct {
	Username string `json:"username"`
	Score    int    `json:"score"`
}

type Match struct {
	Player1 MatchPlayer `json:"p1"`
	Player2 MatchPlayer `json:"p2"`
}

type NewMatchBody struct {
	Opponent  string `json:"opponent" validate:"required"`
	SessionID string `json:"sessionId" validate:"required"`
}

type PlayerState struct {
	InvokedSpells    []string `json:"invoked_spells"`
	Score            int16    `json:"score"`
	LastInvokedSpell string   `json:"last_invoked_spell"`
}

type MatchState struct {
	Timestamp int `json:"timestamp"`
}
