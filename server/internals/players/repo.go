package players

import (
	"context"
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type PlayersRepo struct {
	Db *mongo.Database
}

func NewPlayersRepo(db *mongo.Database) *PlayersRepo {
	return &PlayersRepo{Db: db}
}

func (Repo *PlayersRepo) FindPlayersByQuery(query string, excludedUsername string) ([]string, error) {

	playersDocs := []models.BasePlayer{}
	players := []string{}
	collection := Repo.Db.Collection("players")
	pipeline := bson.A{
		bson.M{
			"$match": bson.M{"username": bson.M{"$regex": query, "$options": "i", "$ne": excludedUsername}},
		},
	}
	cursor, err := collection.Aggregate(context.Background(), pipeline)
	if err != nil {
		return players, err
	}
	defer cursor.Close(context.Background())
	if err := cursor.All(context.TODO(), &playersDocs); err != nil {
		return players, err
	}
	for _, player := range playersDocs {
		players = append(players, player.Username)
	}

	return players, nil
}

func (Repo *PlayersRepo) GetPlayerInfo(username string) (*models.PlayerInfo, error) {

	basePlayer := &models.BasePlayer{}
	playersCollection := Repo.Db.Collection("players")

	err := playersCollection.FindOne(context.Background(), bson.M{"username": username}).Decode(basePlayer)

	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, fiber.NewError(fiber.StatusNotFound, "player with this username is not found")
		}
	}
	friendsNames := []string{}
	friendsFilter := bson.M{"_id": bson.M{"$in": basePlayer.Friends}}
	cursor, err := playersCollection.Find(context.Background(), friendsFilter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		var friend models.BasePlayer
		if err := cursor.Decode(&friend); err != nil {
			return nil, err
		}
		friendsNames = append(friendsNames, friend.Username)
	}
	playerInfo := &models.PlayerInfo{Username: basePlayer.Username, LastName: basePlayer.LastName, FirstName: basePlayer.FirstName, Friends: friendsNames, Matches: []models.Match{}}
	return playerInfo, nil
}
