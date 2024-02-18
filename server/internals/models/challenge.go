package models

type Challenge struct {
	ID       string `json:"id"`
	Sender   string `json:"sender"`
	Receiver string `json:"receiver"`
}

type NewChallengeBody struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}
