package matches

import (
	"context"
	"encoding/json"
	"fmt"
	"reflect"

	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/constants"
	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"github.com/jadhamwi21/invoker-challenge/internals/utils"
	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type MatchesRepo struct {
	Redis    *redis.Client
	Database *mongo.Database
}

func NewMatchesRepo(redis *redis.Client, database *mongo.Database) *MatchesRepo {
	return &MatchesRepo{Redis: redis, Database: database}
}

func getInitialMatchState() ([]byte, []byte, []byte) {
	clientState, _ := json.Marshal(models.PlayerState{Orbs: []int{}, Invoked: []int{}, Last: -1, Score: 0})
	opponentState, _ := json.Marshal(models.PlayerState{Orbs: []int{}, Invoked: []int{}, Last: -1, Score: 0})
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

func (Repo *MatchesRepo) GetMatch(sessionId string) (map[string]interface{}, error) {
	hash := utils.FormatMatchHash(sessionId)
	result, err := Repo.Redis.HGetAll(context.Background(), hash).Result()
	if err != nil {
		return nil, err
	}
	response := map[string]interface{}{}
	for k, v := range result {
		var data interface{}
		err := json.Unmarshal([]byte(v), &data)
		if err == nil {
			response[k] = data
		}
	}

	return response, nil
}

func (Repo *MatchesRepo) GetMatches(username string) (interface{}, error) {
	// matchesCollection := Repo.Database.Collection("matches")
	playersCollection := Repo.Database.Collection("players")
	filter := bson.M{"username": username}
	res := &models.BasePlayer{}
	err := playersCollection.FindOne(context.Background(), filter).Decode(res)
	if err != nil {
		return nil, err
	}
	fmt.Println(res.Matches)

	return res.Matches, nil
}

func (Repo *MatchesRepo) SaveMatch(sessionId string) (primitive.ObjectID, error) {
	match, err := Repo.GetMatch(sessionId)
	if err != nil {
		return primitive.NilObjectID, err
	}
	fmt.Println(match)
	matchesCollection := Repo.Database.Collection("matches")
	fmt.Println(matchesCollection)
	res, err := matchesCollection.InsertOne(context.Background(), match)
	if err != nil {
		return primitive.NilObjectID, err
	}
	return res.InsertedID.(primitive.ObjectID), nil
}
