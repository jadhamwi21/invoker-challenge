package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Friend string

type NewFriendRequest struct {
	Username string `json:"username" validate:"required"`
}

type FriendRequest struct {
	ID        primitive.ObjectID `bson:"_id"`
	Requester primitive.ObjectID `bson:"requester"`
	Requestee primitive.ObjectID `bson:"requestee"`
}
