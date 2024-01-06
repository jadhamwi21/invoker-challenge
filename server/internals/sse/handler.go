package sse

import (
	"bufio"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func SSEHandler(c *fiber.Ctx) error {
	username := c.Locals("username").(string)
	c.Set("Content-Type", "text/event-stream")
	c.Set("Cache-Control", "no-cache")
	c.Set("Connection", "keep-alive")
	c.Set("Transfer-Encoding", "chunked")
	SseService.AddUser(username)
	c.Context().SetBodyStreamWriter(func(w *bufio.Writer) {
		channel := SseService.GetUserChannel(username)

		for {
			event := <-channel
			message, err := event.Format()
			if err != nil {
				fmt.Printf("%v", err)
				continue
			}

			if event.IsExitEvent() {
				SseService.RemoveUser(username)
				close(channel)
				break
			}
			fmt.Fprint(w, message)
			w.Flush()

		}

	})

	return nil
}

func SSEDisconnectHandler(c *fiber.Ctx) error {
	username := c.Locals("username").(string)
	SseService.SendEventToUser(username, NewExitEvent())
	return nil
}
