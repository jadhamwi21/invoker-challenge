package matchmake

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/constants"
	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"github.com/jadhamwi21/invoker-challenge/internals/sse"
)

type MatchMakeController struct {
	Repo *MatchMakeRepo
}

func NewMatchMakeController(repo *MatchMakeRepo) *MatchMakeController {
	return &MatchMakeController{Repo: repo}
}

func (Controller *MatchMakeController) InitiateMatch(c *fiber.Ctx) error {
	senderUsername := c.Locals("username").(string)
	receiverUsername := c.Params("username")
	msg := fmt.Sprintf("You're challenged by %v", senderUsername)
	challenge := models.Challenge{Message: msg, Receiver: receiverUsername}
	event := sse.NewSSEvent(constants.CHALLENGE_EVENT, challenge)
	fmt.Println(receiverUsername)
	err := sse.SseService.SendEventToUser(receiverUsername, event)
	if err != nil {
		fmt.Printf("error sending challenge")
		return err
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Challenge Sent", "code": fiber.StatusOK})
}
