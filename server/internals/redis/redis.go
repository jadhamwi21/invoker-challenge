package redis

import (
	"context"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

func InitializeRedis() {
	ctx := context.Background()
	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	_, err := client.Ping(ctx).Result()
	if err != nil {
		panic(err)
	}
	RedisClient = client
}
