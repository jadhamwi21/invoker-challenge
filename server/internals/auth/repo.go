package auth

import (
	"context"
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type AuthRepo struct {
	Db *mongo.Database
}

func NewAuthRepo(db *mongo.Database) *AuthRepo {
	return &AuthRepo{Db: db}
}

func (Repo *AuthRepo) CreateNewPlayer(newPlayer *models.NewPlayer) error {
	collection := Repo.Db.Collection("players")
	playerExistsFilter := bson.D{{"username", newPlayer.Username}}
	result := collection.FindOne(context.Background(), playerExistsFilter)
	if result.Err() == nil {
		return fiber.NewError(fiber.StatusConflict, "Player with this username already exists")
	}

	player := &models.BasePlayer{Friends: []primitive.ObjectID{}, Matches: []primitive.ObjectID{}, Username: newPlayer.Username, Password: newPlayer.Password, FirstName: newPlayer.FirstName, LastName: newPlayer.LastName, Email: newPlayer.Email, ID: primitive.NewObjectID()}

	collection.InsertOne(context.Background(), player)
	return nil
}

func (Repo *AuthRepo) AuthenticatePlayer(player *models.PlayerLoginCredentials) (*models.PlayerLoginResponse, string, error) {
	collection := Repo.Db.Collection("players")
	playerFilter := bson.D{{Key: "username", Value: player.Username}}
	var basePlayer models.BasePlayer
	err := collection.FindOne(context.Background(), playerFilter).Decode(&basePlayer)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, "", fiber.NewError(fiber.StatusNotFound, "player with this username is not found")
		}
	}
	if player.Password != basePlayer.Password {
		return nil, "", fiber.NewError(fiber.StatusUnauthorized, "incorrect password")
	}

	token, _ := GenerateJwt(&basePlayer)

	playerResponse := &models.PlayerLoginResponse{FirstName: basePlayer.FirstName, LastName: basePlayer.LastName, Username: player.Username}

	return playerResponse, token, nil
}
