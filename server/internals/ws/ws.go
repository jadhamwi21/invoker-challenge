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

const (
	MESSAGE_TYPE = 1
)

const (
	HEARTBEAT_EVENT = "heartbeat"
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
		sessionId := c.Params("sessionId")
		username := c.Locals("username").(string)

		gameEngine, err := engines.GetEngineBySessionID(sessionId)
		if err != nil {
			c.Close()
		}
		clientChannels := engine.NewClientChannels()
		gameEngine.NewClient(username, clientChannels)
		for {
			// Write Routine
			go func() {
				select {
				case heartbeat := <-clientChannels.HeartbeatChannel:
					c.WriteMessage(MESSAGE_TYPE, NewWebsocketMessage(HEARTBEAT_EVENT, heartbeat).Format())
				}
			}()
			go func() {
				var (
					msg []byte
					err error
				)
				if _, msg, err = c.ReadMessage(); err != nil {
					log.Println("read:", err)
				}
				fmt.Println(string(msg))
				if string(msg) == "ready" {
					gameEngine.UpdateRunningState(true)
				}

			}()

		}
	}))
}
