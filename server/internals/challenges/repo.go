package challenges

import "go.mongodb.org/mongo-driver/mongo"

type ChallengesRepo struct {
	Database *mongo.Database
}

func NewChallengesRepo(db *mongo.Database) *ChallengesRepo {
	return &ChallengesRepo{Database: db}
}
