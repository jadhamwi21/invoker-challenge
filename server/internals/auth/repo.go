package auth

import "go.mongodb.org/mongo-driver/mongo"

type AuthRepo struct {
	Db *mongo.Database
}

func NewAuthRepo(db *mongo.Database) *AuthRepo {
	return &AuthRepo{Db: db}
}
