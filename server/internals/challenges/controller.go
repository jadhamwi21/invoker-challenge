package challenges

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"github.com/jadhamwi21/invoker-challenge/internals/sse"
)

type ChallengesController struct {
	Repo *ChallengesRepo
}

func NewChallengesController(repo *ChallengesRepo) *ChallengesController {
	return &ChallengesController{Repo: repo}
}

func (c *ChallengesController) SendChallengeHandler(ctx *fiber.Ctx) error {
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
	go sse.SseService.SendEventToUser(newChallenge.Username, event)

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Challenge Sent", "code": fiber.StatusOK})
}

func (c *ChallengesController) ChallengeActionHandler(ctx *fiber.Ctx) error {

	challengeID := ctx.Params("challengeId")
	action := ctx.Params("action")

	if challengeID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Challenge ID is required")
	}

	validActions := map[string]bool{
		CHALLENGE_ACCEPT_ACTION: true,
		CHALLENGE_DENY_ACTION:   true,
		CHALLENGE_CANCEL_ACTION: true,
	}
	if !validActions[action] {
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

	var recipient string
	if action == CHALLENGE_CANCEL_ACTION {
		recipient = challenge.Receiver
	} else {
		recipient = challenge.Sender
	}

	event := sse.NewSSEvent(CHALLENGE_ACTION_MAP[action], challenge.ID)
	sse.SseService.SendEventToUser(recipient, event)

	if action == CHALLENGE_ACCEPT_ACTION {
		sessionID := uuid.New()
		err := c.Repo.SaveSession(ctx.Context(), sessionID, challenge.Sender, challenge.Receiver)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "An error has occured")
		}
		sessionEvent := sse.NewSSEvent(SESSION_CREATE_EVENT, sessionID)
		go sse.SseService.SendEventToUser(challenge.Sender, sessionEvent)
		go sse.SseService.SendEventToUser(challenge.Receiver, sessionEvent)
	}

	return nil
}
