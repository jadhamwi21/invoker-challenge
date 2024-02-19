package challenges

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"github.com/redis/go-redis/v9"
)

type ChallengesRepo struct {
	Redis *redis.Client
}

func NewChallengesRepo(redis *redis.Client) *ChallengesRepo {
	return &ChallengesRepo{Redis: redis}
}

func (r *ChallengesRepo) StoreNewChallenge(ctx context.Context, challenge models.Challenge) error {
	data, _ := json.Marshal(challenge)
	err := r.Redis.HSet(ctx, REDIS_CHALLENGES_HASH, challenge.ID, data).Err()
	if err != nil {
		return fmt.Errorf("failed to store challenge: %w", err)
	}
	return nil
}

func (r *ChallengesRepo) GetChallengeByID(ctx context.Context, challengeID string) (*models.Challenge, error) {
	value, err := r.Redis.HGet(ctx, REDIS_CHALLENGES_HASH, challengeID).Result()
	if err != nil {
		return nil, fmt.Errorf("failed to get challenge: %w", err)
	}
	challenge := &models.Challenge{}
	if err := json.Unmarshal([]byte(value), challenge); err != nil {
		return nil, fmt.Errorf("failed to unmarshal challenge: %w", err)
	}
	return challenge, nil
}

func (r *ChallengesRepo) ClearChallenge(ctx context.Context, challengeID string) error {
	if err := r.Redis.HDel(ctx, REDIS_CHALLENGES_HASH, challengeID).Err(); err != nil {
		return fmt.Errorf("failed to delete challenge: %w", err)
	}
	return nil
}
