package models

import (
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type BasePlayer struct {
	Username  string               `bson:"username"`
	FirstName string               `bson:"firstname"`
	LastName  string               `bson:"lastname"`
	Password  string               `bson:"password"`
	Email     string               `bson:"email"`
	Friends   []primitive.ObjectID `bson:"friends"`
	Matches   []primitive.ObjectID `bson:"matches"`
}

type NewPlayer struct {
	Username  string `json:"username" validate:"required"`
	FirstName string `json:"firstname" validate:"required"`
	LastName  string `json:"lastname" validate:"required"`
	Password  string `json:"password" validate:"required,min=8"`
	Email     string `json:"email" validate:"required"`
}

type PlayerLoginCredentials struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type PlayerClaims struct {
	Username string `json:"username"`
	jwt.MapClaims
}
