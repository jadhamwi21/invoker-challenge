package ws

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/auth"
	"github.com/jadhamwi21/invoker-challenge/internals/engine"
	"github.com/redis/go-redis/v9"
)

// Server Events
const (
	HEARTBEAT_EVENT       = "heartbeat"
	COUNTDOWN_EVENT       = "countdown"
	GENERATED_SPELL_EVENT = "generated_spell"
	SCORE_EVENT           = "score"
)

// Client Events

const (
	READY_EVENT          = "ready"
	GENERATE_SPELL_EVENT = "generate:spell"
	INVOKE_EVENT         = "invoke"
)

type WebsocketMessage struct {
	Event string `json:"event"`
	Data  any    `json:"data"`
}

func (wsm WebsocketMessage) Format() []byte {
	str, _ := json.Marshal(wsm)
	return str
}

func NewWebsocketMessage(event string, data any) WebsocketMessage {
	return WebsocketMessage{Event: event, Data: data}
}

func AddWebsocketToApp(app *fiber.App, redis *redis.Client, engines *engine.Engines) {
	app.Use("/ws/:sessionId", auth.Protected, websocketMiddleware, websocket.New(func(c *websocket.Conn) {
		defer c.Close()
		sessionId := c.Params("sessionId")
		username := c.Locals("username").(string)

		gameEngine, err := engines.GetEngineBySessionID(sessionId)
		if err != nil {
			log.Println("Error getting game engine:", err)
			c.Close()
			return
		}

		clientChannels := engine.NewClientChannels()
		gameEngine.JoinPlayer(username, clientChannels, redis)

		go func() {
			for {
				select {
				case heartbeat := <-clientChannels.HeartbeatChannel:
					heartbeat = heartbeat.(int)
					c.WriteMessage(websocket.TextMessage, NewWebsocketMessage(HEARTBEAT_EVENT, heartbeat).Format())
				case countdown := <-clientChannels.CountdownChannel:
					countdown = countdown.(int)
					c.WriteMessage(websocket.TextMessage, NewWebsocketMessage(COUNTDOWN_EVENT, countdown).Format())
				case spell := <-clientChannels.SpellChannel:
					spell = spell.(engine.GeneratedSpell)
					c.WriteMessage(websocket.TextMessage, NewWebsocketMessage(GENERATED_SPELL_EVENT, spell).Format())
				case score := <-clientChannels.ScoreChannel:
					score = score.(engine.ScoreUpdate)
					c.WriteMessage(websocket.TextMessage, NewWebsocketMessage(SCORE_EVENT, score).Format())
				}
			}
		}()

		for {
			_, msg, err := c.ReadMessage()
			if err != nil {
				log.Println("Error reading message:", err)
				return
			}
			fmt.Println(msg)
			data := &WebsocketMessage{}
			err = json.Unmarshal(msg, data)
			fmt.Println(data)
			if err != nil {
				fmt.Println(err)
			}
			switch data.Event {
			case READY_EVENT:
				go gameEngine.TriggerReady()
			case GENERATE_SPELL_EVENT:
				go gameEngine.GenerateSpell(username)
			case INVOKE_EVENT:
				go gameEngine.Invoke(username, data.Data.([]interface{}))
			}
		}
	}))
}
