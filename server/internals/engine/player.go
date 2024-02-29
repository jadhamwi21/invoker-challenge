package engine

import (
	"context"
	"encoding/json"
	"sync"

	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"github.com/redis/go-redis/v9"
)

type PlayerMutex struct {
	invoke   *sync.Mutex
	generate *sync.Mutex
}

func NewPlayerMutex() *PlayerMutex {
	return &PlayerMutex{invoke: &sync.Mutex{}, generate: &sync.Mutex{}}
}

type Player struct {
	Channels *Channels
	Spells   *PlayerSpells
	Score    int
	redis    *redis.Client
	Hash     string
	Username string
	mu       *PlayerMutex
}

type ScoreUpdate struct {
	Score    int    `json:"score"`
	Username string `json:"username"`
}

func NewPlayer(channels *Channels, redis *redis.Client, hash string, username string) *Player {
	return &Player{Username: username, Channels: channels, Spells: NewPlayerSpells(), redis: redis, Hash: hash, mu: NewPlayerMutex()}
}

func (p *Player) UpdateState() error {
	p.Score++
	newState := models.PlayerState{Invoked: p.Spells.Invoked, Score: p.Score, Last: p.Spells.Last, Current: p.Spells.Current}
	data, err := json.Marshal(newState)
	if err != nil {
		return err
	}
	err = p.redis.HSet(context.Background(), p.Hash, p.Username, data).Err()
	if err != nil {
		return err
	}
	return nil
}
