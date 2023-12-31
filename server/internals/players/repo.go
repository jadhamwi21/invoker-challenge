package players

import (
	"context"

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
	if err := cursor.All(context.TODO(), &playersDocs); err != nil {
		return players, err
	}
	for _, player := range playersDocs {
		players = append(players, player.Username)
	}

	return players, nil
}
