package engine

import (
	"fmt"

	"github.com/jadhamwi21/invoker-challenge/internals/utils"
	"github.com/redis/go-redis/v9"
)

const (
	PLAYERS_NUMBER = 2
	COUNTDOWN      = 3
	MATCH_DURATION = 60
)

type GameEngine struct {
	sessionId    string
	redisHash    string
	heartbeat    *Heartbeat
	countdown    *Countdown
	players      map[string]*Player
	running      bool
	readyPlayers int
}

func NewGameEngine(sessionId string, redis *redis.Client) GameEngine {
	hash := utils.FormatMatchHash(sessionId)
	return GameEngine{
		sessionId:    sessionId,
		redisHash:    hash,
		heartbeat:    NewHeartbeat(redis, hash),
		players:      make(map[string]*Player),
		running:      false,
		readyPlayers: 0,
		countdown:    NewCountdown(),
	}
}

func (g *GameEngine) getSharedChannels(ev string) []chan interface{} {
	channels := []chan interface{}{}
	for _, v := range g.players {
		switch ev {
		case HEARTBEAT_CHANNEL:
			channels = append(channels, v.Channels.HeartbeatChannel)
		case COUNTDOWN_CHANNEL:
			channels = append(channels, v.Channels.CountdownChannel)
		case SPELL_CHANNEL:
			channels = append(channels, v.Channels.SpellChannel)
		case SCORE_CHANNEL:
			channels = append(channels, v.Channels.ScoreChannel)
		case KEYSTROKE_CHANNEL:
			channels = append(channels, v.Channels.KeystrokeChannel)
		default:
			fmt.Println("Unknown event:", ev)
		}
	}
	return channels
}

func (g *GameEngine) Run() {
	countdownChannels := g.getSharedChannels(COUNTDOWN_CHANNEL)
	heartbeatChannels := g.getSharedChannels(HEARTBEAT_CHANNEL)
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

func (g *GameEngine) JoinPlayer(username string, channels *Channels, redis *redis.Client) {
	g.players[username] = NewPlayer(channels, redis, g.redisHash, username)
}

func (g *GameEngine) GenerateSpell(username string) error {
	if v, ok := g.players[username]; ok {
		v.mu.generate.Lock()
		spellChannels := g.getSharedChannels(SPELL_CHANNEL)
		spell := v.Spells.GenerateSpell()
		v.mu.generate.Unlock()
		generatedSpell := GeneratedSpell{Username: username, Spell: spell}
		for _, v := range spellChannels {
			v <- generatedSpell
		}
	}
	return fmt.Errorf("player %v not in this match", username)
}

func (g *GameEngine) Invoke(username string, input []interface{}) error {
	var orbs []int
	for _, v := range input {
		orbs = append(orbs, int(v.(float64)))
	}
	if v, ok := g.players[username]; ok {
		v.mu.invoke.Lock()
		scoreChannels := g.getSharedChannels(SCORE_CHANNEL)
		validInvokation := v.Spells.ValidateInvokation(orbs)
		if validInvokation {
			err := g.GenerateSpell(username)
			if err != nil {
				return err
			}
			v.UpdateState()
			scoreUpdate := ScoreUpdate{Score: v.Score, Username: username}
			for _, v := range scoreChannels {
				v <- scoreUpdate
			}
		}
		v.mu.invoke.Unlock()
	}
	return fmt.Errorf("player %v not in this match", username)
}

func (g *GameEngine) KeystrokePress(username string, input interface{}) {
	key := input.(string)

	for currentUsername, player := range g.players {
		if currentUsername != username {
			player.Channels.KeystrokeChannel <- key
		}
	}
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
