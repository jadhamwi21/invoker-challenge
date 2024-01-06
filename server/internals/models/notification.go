package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Notification struct {
	Timestamp primitive.DateTime `bson:"timestamp"`
	ID        primitive.ObjectID `bson:"_id"`
	UserID    primitive.ObjectID `bson:"user_id"`
	Text      string             `bson:"text"`
}
