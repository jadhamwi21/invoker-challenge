package notifications

import (
	"context"

	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type NotificationsRepo struct {
	Db *mongo.Database
}

func NewNotificationsRepo(db *mongo.Database) *NotificationsRepo {
	return &NotificationsRepo{Db: db}
}

func (Repo *NotificationsRepo) GetNotifications(clientId primitive.ObjectID) (*[]models.UserNotifification, error) {
	notificationsCollection := Repo.Db.Collection("notifications")
	notifications := &[]models.UserNotifification{}
	cursor, err := notificationsCollection.Find(context.Background(), bson.M{"user_id": clientId})

	if err != nil {
		return nil, err
	}
	if err := cursor.All(context.Background(), notifications); err != nil {
		return nil, err
	}
	return notifications, nil
}

func (Repo *NotificationsRepo) MarkNotificationsAsSeen(clientId primitive.ObjectID) error {
	notificationsCollection := Repo.Db.Collection("notifications")

	_, err := notificationsCollection.UpdateMany(context.Background(), bson.M{"user_id": clientId}, bson.M{"$set": bson.M{"seen": true}})

	if err != nil {
		return err
	}
	return nil
}
