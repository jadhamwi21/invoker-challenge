package engine

import (
	"context"
	"fmt"

	"github.com/jadhamwi21/invoker-challenge/internals/utils"
	"github.com/redis/go-redis/v9"
)

const (
	PLAYERS_NUMBER = 2
	COUNTDOWN      = 3
	MATCH_DURATION = 60
)

type GameContext struct {
	context  context.Context
	cancelFn context.CancelFunc
}

type GameEngine struct {
	sessionId    string
	redisHash    string
	heartbeat    *Heartbeat
	countdown    *Countdown
	players      map[string]*Player
	run          chan bool
	stop         chan bool
	readyPlayers int
	ctx          *GameContext
}

func NewGameEngine(sessionId string, redis *redis.Client) GameEngine {
	hash := utils.FormatMatchHash(sessionId)
	return GameEngine{
		sessionId:    sessionId,
		redisHash:    hash,
		heartbeat:    NewHeartbeat(redis, hash),
		players:      make(map[string]*Player),
		run:          make(chan bool),
		stop:         make(chan bool),
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
	go g.heartbeat.Run(g.ctx.context, heartbeatChannels)
	<-g.ctx.context.Done()
}

func (g *GameEngine) Stop() {

}

func (g *GameEngine) createContext() {
	ctx, cancelFn := context.WithCancel(context.TODO())
	g.ctx = &GameContext{context: ctx, cancelFn: cancelFn}
}

func (g *GameEngine) Listen() {
	for {
		select {
		case <-g.run:
			g.createContext()
			fmt.Println("RUN")
			go g.Run()
		case <-g.stop:
			go g.Stop()
			g.ctx.cancelFn()
		}
	}
}

func (g *GameEngine) TriggerReady() {
	g.readyPlayers++
	fmt.Println("READY")
	if g.readyPlayers == PLAYERS_NUMBER {
		g.run <- true
	}
}

func (g *GameEngine) TriggerUnReady() {
	g.readyPlayers--
	if g.readyPlayers != PLAYERS_NUMBER {
		g.stop <- true
	}
}

func (g *GameEngine) JoinPlayer(username string, channels *Channels, redis *redis.Client) {
	g.players[username] = NewPlayer(channels, redis, g.redisHash, username)
}

func (g *GameEngine) GenerateSpell(username string) error {
	if v, ok := g.players[username]; ok {
		v.mu.generate.Lock()
		defer v.mu.generate.Unlock()
		spellChannels := g.getSharedChannels(SPELL_CHANNEL)
		spell := v.Spells.GenerateSpell()
		generatedSpell := GeneratedSpell{Username: username, Spell: spell}
		for _, v := range spellChannels {
			v <- generatedSpell
		}
		fmt.Print("Generated", generatedSpell, " for ", username)
		return nil
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
		defer v.mu.invoke.Unlock()
		scoreChannels := g.getSharedChannels(SCORE_CHANNEL)
		validInvokation := v.Spells.ValidateInvokation(orbs)
		fmt.Println(validInvokation)
		if validInvokation {
			err := g.GenerateSpell(username)
			if err != nil {
				return err
			}
			v.Score++
			v.UpdateState()
			scoreUpdate := ScoreUpdate{Score: v.Score, Username: username}
			for _, v := range scoreChannels {
				v <- scoreUpdate
			}
		}
		return nil
	}
	return fmt.Errorf("player %v not in this match", username)
}

func (g *GameEngine) KeystrokePress(username string, input interface{}) {
	key := input.(string)

	for currentUsername, player := range g.players {
		if currentUsername != username {
			go func(player *Player) {
				player.Channels.KeystrokeChannel <- key
			}(player)
		} else {
			go func(player *Player) {

				orbEnum := ORB_KEY_TO_ENUM[key]

				if len(player.Orbs) == 3 {
					player.Orbs = append([]int{orbEnum}, player.Orbs[0:2]...)
				} else {
					player.Orbs = append([]int{orbEnum}, player.Orbs...)
				}

				player.UpdateState()
			}(player)
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
