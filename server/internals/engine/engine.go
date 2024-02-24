package engine

import (
	"fmt"

	"github.com/jadhamwi21/invoker-challenge/internals/utils"
)

type Channels struct {
	HeartbeatChannel chan int
}

func NewClientChannels() Channels {
	return Channels{HeartbeatChannel: make(chan int)}
}

type GameEngine struct {
	sessionId string
	redisHash string
	heartbeat Heartbeat
	players   map[string]Channels
	running   bool
}

func (g *GameEngine) getHeartbeatChannels() []chan int {
	channels := []chan int{}
	for _, v := range g.players {
		channels = append(channels, v.HeartbeatChannel)
	}
	return channels
}

func (g *GameEngine) Run() {
	heartbeatChannels := g.getHeartbeatChannels()
	go g.heartbeat.Run(heartbeatChannels)
}

func (g *GameEngine) UpdateRunningState(running bool) {
	g.running = running
	if running {
		go g.Run()
	} else {
		fmt.Println("stop")
	}
}

func (g *GameEngine) NewClient(username string, channels Channels) {
	g.players[username] = channels
}
func NewGameEngine(sessionId string) GameEngine {
	hash := utils.FormatMatchHash(sessionId)
	return GameEngine{sessionId: sessionId, redisHash: hash, heartbeat: Heartbeat{timestamp: 0}, players: make(map[string]Channels), running: false}
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
