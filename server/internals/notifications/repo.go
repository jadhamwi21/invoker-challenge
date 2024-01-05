package notifications

import "go.mongodb.org/mongo-driver/mongo"

type NotificationsRepo struct {
	Db *mongo.Database
}

func NewNotificationsRepo(db *mongo.Database) *NotificationsRepo {
	return &NotificationsRepo{Db: db}
}
