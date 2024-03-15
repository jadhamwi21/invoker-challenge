package engine

import (
	"context"
	"encoding/json"
	"fmt"
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
	Orbs     []int
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
	return &Player{Username: username, Channels: channels, Spells: NewPlayerSpells(), redis: redis, Hash: hash, mu: NewPlayerMutex(), Orbs: []int{}, Score: 0}
}

func CopyPlayer(player *Player, channels *Channels, redis *redis.Client, hash string, username string) *Player {
	return &Player{Username: player.Username, Channels: channels, Spells: player.Spells, redis: redis, Hash: hash, mu: NewPlayerMutex(), Orbs: player.Orbs, Score: player.Score}
}

func (p *Player) UpdateState() error {

	newState := models.PlayerState{Invoked: p.Spells.Invoked, Score: p.Score, Last: p.Spells.Last, Current: p.Spells.Current, Orbs: p.Orbs}
	data, err := json.Marshal(newState)
	fmt.Println(p.Score)
	if err != nil {
		fmt.Println(err)
		return err
	}
	err = p.redis.HSet(context.Background(), p.Hash, p.Username, data).Err()
	if err != nil {
		return err
	}
	return nil
}
