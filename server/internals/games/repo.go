package games

import (
	"context"
	"encoding/json"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"github.com/redis/go-redis/v9"
)

type GamesRepo struct {
	Redis *redis.Client
}

func NewGamesRepo(redis *redis.Client) *GamesRepo {
	return &GamesRepo{Redis: redis}
}

func getInitialGameValues() ([]byte, []byte, []byte) {
	clientState, _ := json.Marshal(models.PlayerState{InvokedSpells: []string{}, LastInvokedSpell: "", Score: 0})
	opponentState, _ := json.Marshal(models.PlayerState{InvokedSpells: []string{}, LastInvokedSpell: "", Score: 0})
	gameState, _ := json.Marshal(models.GameState{Timestamp: time.Now()})
	return clientState, opponentState, gameState
}

func (Repo *GamesRepo) CreateGame(ctx context.Context, game *models.NewGameBody, client string) error {
	sessionId := game.SessionID
	clientState, opponentState, gameState := getInitialGameValues()
	hash := FormatGameHash(sessionId)

	err := Repo.Redis.HSet(ctx, hash, GAME_STATE_KEY, gameState, client, clientState, game.Opponent, opponentState).Err()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return nil
}
