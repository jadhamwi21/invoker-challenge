package engine

import (
	"fmt"

	"github.com/jadhamwi21/invoker-challenge/internals/utils"
	"github.com/redis/go-redis/v9"
)

const (
	PLAYERS_NUMBER     = 2
	COUNTDOWN          = 3
	MATCH_DURATION     = 60
	HEARTBEAT_CHANNELS = "HeartbeatChannels"
	COUNTDOWN_CHANNELS = "CountdownChannels"
)

type Channels struct {
	HeartbeatChannel chan int
	CountdownChannel chan int
}

func NewClientChannels() Channels {
	return Channels{HeartbeatChannel: make(chan int), CountdownChannel: make(chan int)}
}

type GameEngine struct {
	sessionId    string
	redisHash    string
	heartbeat    Heartbeat
	countdown    Countdown
	spells       Spells
	players      map[string]Channels
	running      bool
	readyPlayers int
}

func NewGameEngine(sessionId string, redis *redis.Client) GameEngine {
	hash := utils.FormatMatchHash(sessionId)
	return GameEngine{
		sessionId:    sessionId,
		redisHash:    hash,
		heartbeat:    Heartbeat{timestamp: MATCH_DURATION, redis: redis, redisHash: hash},
		players:      make(map[string]Channels),
		running:      false,
		readyPlayers: 0,
		countdown:    Countdown{val: COUNTDOWN},
	}
}

func (g *GameEngine) getChannels(ev string) []chan int {
	channels := []chan int{}
	for _, v := range g.players {
		switch ev {
		case HEARTBEAT_CHANNELS:
			channels = append(channels, v.HeartbeatChannel)
		case COUNTDOWN_CHANNELS:
			channels = append(channels, v.CountdownChannel)
		default:
			fmt.Println("Unknown event:", ev)
		}
	}
	return channels
}

func (g *GameEngine) Run() {
	countdownChannels := g.getChannels(COUNTDOWN_CHANNELS)
	heartbeatChannels := g.getChannels(HEARTBEAT_CHANNELS)
	g.countdown.Run(countdownChannels)
	go g.heartbeat.Run(heartbeatChannels)
}

func (g *GameEngine) updateRunningState() {
	g.running = g.readyPlayers == PLAYERS_NUMBER
	if g.running {
		go g.Run()
	}
}

func (g *GameEngine) TriggerReady() {
	g.readyPlayers++
	g.updateRunningState()

}

func (g *GameEngine) TriggerUnReady() {
	g.readyPlayers--
	g.updateRunningState()
}

func (g *GameEngine) NewClient(username string, channels Channels) {
	g.players[username] = channels
}

type Engines struct {
	sessions map[string]*GameEngine
}

func (e *Engines) AddEngine(engine *GameEngine) {
	e.sessions[engine.sessionId] = engine
}

func (e *Engines) GetEngineBySessionID(sessionId string) (*GameEngine, error) {
	if _, ok := e.sessions[sessionId]; !ok {
		return &GameEngine{}, fmt.Errorf("session [%v] not found", sessionId)
	}
	return e.sessions[sessionId], nil
}

func NewEngines() *Engines {
	return &Engines{sessions: make(map[string]*GameEngine)}
}
