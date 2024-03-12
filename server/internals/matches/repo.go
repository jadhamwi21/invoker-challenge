package matches

import (
	"context"
	"encoding/json"
	"reflect"

	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/constants"
	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"github.com/jadhamwi21/invoker-challenge/internals/utils"
	"github.com/redis/go-redis/v9"
)

type MatchesRepo struct {
	Redis *redis.Client
}

func NewMatchesRepo(redis *redis.Client) *MatchesRepo {
	return &MatchesRepo{Redis: redis}
}

func getInitialMatchState() ([]byte, []byte, []byte) {
	clientState, _ := json.Marshal(models.PlayerState{Invoked: []int{}, Last: -1, Score: 0})
	opponentState, _ := json.Marshal(models.PlayerState{Invoked: []int{}, Last: -1, Score: 0})
	matchState, _ := json.Marshal(models.MatchState{Timestamp: 0})
	return clientState, opponentState, matchState
}

func (Repo *MatchesRepo) CreateMatch(ctx context.Context, match *models.NewMatchBody, client string) error {
	sessionId := match.SessionID
	clientState, opponentState, matchState := getInitialMatchState()
	hash := utils.FormatMatchHash(sessionId)

	err := Repo.Redis.HSet(ctx, hash, constants.MATCH_STATE_KEY, matchState, client, clientState, match.Opponent, opponentState).Err()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return nil
}

func (Repo *MatchesRepo) GetMatchPlayers(sessionId string) ([]string, error) {
	hash := utils.FormatMatchHash(sessionId)
	result := Repo.Redis.HGetAll(context.Background(), hash)
	if result.Err() != nil {
		return []string{}, result.Err()
	}
	matchState := result.Val()
	delete(matchState, "state")
	keys := reflect.ValueOf(matchState).MapKeys()
	players := []string{}
	for _, v := range keys {
		players = append(players, v.String())
	}
	return players, nil
}
