package engine

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"github.com/redis/go-redis/v9"
)

type Player struct {
	Channels Channels
	Spells   *PlayerSpells
	Score    int
	redis    *redis.Client
	Hash     string
	Username string
}

type ScoreUpdate struct {
	Score    int    `json:"score"`
	Username string `json:"username"`
}

func NewClientChannels() Channels {
	return Channels{HeartbeatChannel: make(chan interface{}), CountdownChannel: make(chan interface{}), SpellChannel: make(chan interface{}), ScoreChannel: make(chan interface{})}
}

func NewPlayer(channels Channels, redis *redis.Client, hash string, username string) *Player {
	return &Player{Username: username, Channels: channels, Spells: NewPlayerSpells(), redis: redis, Hash: hash}
}

func (p *Player) UpdateState() {
	p.Score++
	newState := models.PlayerState{Invoked: p.Spells.Invoked, Score: p.Score, Last: p.Spells.Last, Current: p.Spells.Current}
	data, err := json.Marshal(newState)
	if err != nil {
		fmt.Println(err)
		return
	}
	p.redis.HSet(context.Background(), p.Hash, p.Username, data)
}
