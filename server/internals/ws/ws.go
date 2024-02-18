package ws

import (
	"fmt"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/auth"
)

func AddWebsocketToApp(app *fiber.App) {
	app.Use("/ws", auth.Protected, websocketMiddleware, websocket.New(func(c *websocket.Conn) {
		for {
			time.Sleep(time.Second * 1)
			c.WriteMessage(1, []byte(fmt.Sprintf("hello there %v", c.Locals("username"))))
		}
	}))
}
