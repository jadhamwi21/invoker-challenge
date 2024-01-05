package notifications

import (
	"bufio"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/sse"
)

type NotificationsController struct {
	Repo *NotificationsRepo
}

func NewNotificationsController(repo *NotificationsRepo) *NotificationsController {
	return &NotificationsController{Repo: repo}
}

func (Controller *NotificationsController) SubscriptionHandler(c *fiber.Ctx) error {
	username := c.Locals("username").(string)
	c.Set("Content-Type", "text/event-stream")
	c.Set("Cache-Control", "no-cache")
	c.Set("Connection", "keep-alive")
	c.Set("Transfer-Encoding", "chunked")
	sse.SseService.AddUser(username)
	c.Context().SetBodyStreamWriter(func(w *bufio.Writer) {
		channel := sse.SseService.GetUserChannel(username)

		for {
			event := <-channel
			message, err := event.Format()
			if err != nil {
				fmt.Printf("%v", err)
				continue
			}
			fmt.Println("msg", message)

			fmt.Fprint(w, message)
			w.Flush()
			if event.IsExitEvent() {
				sse.SseService.RemoveUser(username)
				close(channel)
				break
			}

		}

	})

	return nil
}

func (Controller *NotificationsController) UnsubscribeHandler(c *fiber.Ctx) error {
	username := c.Locals("username").(string)
	go sse.SseService.SendEventToUser(username, sse.NewExitEvent())
	return nil
}
