package friends

import (
	"context"
	"fmt"

	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type FriendsRepo struct {
	Db *mongo.Database
}

func NewFriendsRepo(db *mongo.Database) *FriendsRepo {
	return &FriendsRepo{Db: db}
}

func (Repo *FriendsRepo) AddNewFriend(clientUsername string, friendUsername string) error {
	collection := Repo.Db.Collection("players")
	friendDoc := &models.BasePlayer{}
	clientDoc := &models.BasePlayer{}
	fmt.Println(clientUsername)
	friendFilter := bson.M{"username": friendUsername}
	clientFilter := bson.M{"username": clientUsername}
	err := collection.FindOne(context.Background(), friendFilter).Decode(friendDoc)
	if err != nil {
		return err
	}
	err = collection.FindOne(context.Background(), clientFilter).Decode(clientDoc)
	if err != nil {
		return err
	}
	exists := false
	for _, current := range clientDoc.Friends {

		if current.Timestamp().Equal(friendDoc.ID.Timestamp()) {
			exists = true
		}
	}

	if exists {
		return nil
	}

	filter := bson.M{"username": clientUsername}
	update := bson.M{"$push": bson.M{"friends": friendDoc.ID}}
	_, err = collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}
	return nil
}
