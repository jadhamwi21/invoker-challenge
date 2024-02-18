package models

type Challenge struct {
	Message  string `json:"message"`
	Receiver string `json:"receiver"`
}
