package engine

import (
	"context"
	"encoding/json"
	"time"

	"github.com/jadhamwi21/invoker-challenge/internals/constants"
	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"github.com/redis/go-redis/v9"
)

type Heartbeat struct {
	timestamp int
	redis     *redis.Client
	redisHash string
}

func (h *Heartbeat) bump() {
	h.timestamp--
}

func (h *Heartbeat) pushHeartbeatToChannels(channels []chan interface{}, timestamp int) {
	for _, ch := range channels {
		ch <- timestamp
	}
}

func (h *Heartbeat) save(timestamp int) error {

	matchState := models.MatchState{Timestamp: timestamp}
	data, err := json.Marshal(matchState)
	if err != nil {

		return err
	}
	err = h.redis.HSet(context.Background(), h.redisHash, constants.MATCH_STATE_KEY, data).Err()
	if err != nil {

		return err
	}
	return nil
}

func (h *Heartbeat) Run(channels []chan interface{}) {
	go h.pushHeartbeatToChannels(channels, h.timestamp)
	for i := 0; i < MATCH_DURATION; i++ {
		time.Sleep(time.Second)
		h.bump()
		go h.pushHeartbeatToChannels(channels, h.timestamp)
		go h.save(h.timestamp)
	}
}
