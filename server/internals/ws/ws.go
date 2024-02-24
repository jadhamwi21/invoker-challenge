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
	HEARTBEAT_EVENT = "heartbeat"
	COUNTDOWN_EVENT = "countdown"
)

// Client Events

const (
	READY_EVENT = "ready"
)

type WebsocketMessage struct {
	Event string      `json:"event"`
	Data  interface{} `json:"data"`
}

func (wsm WebsocketMessage) Format() []byte {
	str, _ := json.Marshal(wsm)
	return str
}

func NewWebsocketMessage(event string, data interface{}) WebsocketMessage {
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
		gameEngine.NewClient(username, clientChannels)

		go func() {
			for {
				select {
				case heartbeat := <-clientChannels.HeartbeatChannel:
					c.WriteMessage(websocket.TextMessage, NewWebsocketMessage(HEARTBEAT_EVENT, heartbeat).Format())
				case countdown := <-clientChannels.CountdownChannel:
					c.WriteMessage(websocket.TextMessage, NewWebsocketMessage(COUNTDOWN_EVENT, countdown).Format())
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
				gameEngine.TriggerReady()
			}
		}
	}))
}
