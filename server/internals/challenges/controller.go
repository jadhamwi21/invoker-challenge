package challenges

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"github.com/jadhamwi21/invoker-challenge/internals/sse"
)

type ChallengesController struct {
	Repo *ChallengesRepo
}

func NewChallengesController(repo *ChallengesRepo) *ChallengesController {
	return &ChallengesController{Repo: repo}
}

func (c *ChallengesController) SendChallenge(ctx *fiber.Ctx) error {
	senderUsername := ctx.Locals("username").(string)
	newChallenge := &models.NewChallengeBody{}
	if err := ctx.BodyParser(newChallenge); err != nil {
		return err
	}

	challenge := models.Challenge{Sender: senderUsername, Receiver: newChallenge.Username, ID: newChallenge.ID}

	if err := c.Repo.StoreNewChallenge(ctx.Context(), challenge); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	event := sse.NewSSEvent(NEW_CHALLENGE_EVENT, challenge)
	sse.SseService.SendEventToUser(newChallenge.Username, event)

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Challenge Sent", "code": fiber.StatusOK})
}

func (c *ChallengesController) HandleChallengeAction(ctx *fiber.Ctx) error {
	challengeID, action := getChallengeParams(ctx)
	if challengeID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Challenge ID is required")
	}
	if action != CHALLENGE_ACCEPT_ACTION && action != CHALLENGE_DENY_ACTION {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid Action")
	}
	challenge, err := c.Repo.GetChallengeByID(ctx.Context(), challengeID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	err = c.Repo.ClearChallenge(ctx.Context(), challengeID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	event := sse.NewSSEvent(CHALLENGE_ACTION_MAP[action], challenge.ID)
	sse.SseService.SendEventToUser(challenge.Sender, event)

	return nil
}

func getChallengeParams(ctx *fiber.Ctx) (string, string) {
	return ctx.Params("challengeId"), ctx.Params("action")
}
