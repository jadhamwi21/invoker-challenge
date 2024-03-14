package models

type MatchPlayer struct {
	Username string `json:"username"`
	Score    int    `json:"score"`
}

type NewMatchBody struct {
	Opponent  string `json:"opponent" validate:"required"`
	SessionID string `json:"sessionId" validate:"required"`
}

type PlayerState struct {
	Invoked []int `json:"invoked_spells"`
	Score   int   `json:"score"`
	Last    int   `json:"last_spell"`
	Current int   `json:"current_spell"`
	Orbs    []int `json:"orbs"`
}

type MatchState struct {
	Timestamp int `json:"timestamp"`
}

type Match struct {
	P1    PlayerState `json:"p1"`
	P2    PlayerState `json:"p2"`
	Match MatchState  `json:"state"`
}
