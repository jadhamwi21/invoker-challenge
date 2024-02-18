package matchmake

import "go.mongodb.org/mongo-driver/mongo"

type MatchMakeRepo struct {
	Database *mongo.Database
}

func NewMatchMakeRepo(db *mongo.Database) *MatchMakeRepo {
	return &MatchMakeRepo{Database: db}
}
