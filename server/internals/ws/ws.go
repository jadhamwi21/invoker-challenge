package ws

import (
	"fmt"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/auth"
	"github.com/redis/go-redis/v9"
)

func AddWebsocketToApp(app *fiber.App, redis *redis.Client) {
	app.Use("/ws/:sessionId", auth.Protected, websocketMiddleware, websocket.New(func(c *websocket.Conn) {

		for {
			time.Sleep(time.Second * 1)
			c.WriteMessage(1, []byte(fmt.Sprintf("hello there %v", c.Locals("username"))))
		}
	}))
}
