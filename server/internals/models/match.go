package models

type MatchPlayer struct {
	Username string `json:"username"`
	Score    int    `json:"score"`
}

type MatchConfig struct {
	Duration int `json:"duration"`
}

type Match struct {
	Player1     MatchPlayer `json:"p1"`
	Player2     MatchPlayer `json:"p2"`
	MatchConfig MatchConfig `json:"config"`
}
