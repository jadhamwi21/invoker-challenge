package models

import (
	"time"
)

type NewGameBody struct {
	Opponent  string `json:"opponent" validate:"required"`
	SessionID string `json:"sessionId" validate:"required"`
}

type PlayerState struct {
	InvokedSpells    []string `json:"invoked_spells"`
	Score            int16    `json:"score"`
	LastInvokedSpell string   `json:"last_invoked_spell"`
}

type GameState struct {
	Timestamp time.Time `json:"timestamp"`
}
