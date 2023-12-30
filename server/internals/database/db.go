package database

import (
	"context"

	"github.com/spf13/viper"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectToDatabase() *mongo.Database {

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(viper.GetString("MONGO_URI")))
	if err != nil {
		panic(err)
	}
	database := client.Database("invoker_challenge")
	return database
}
