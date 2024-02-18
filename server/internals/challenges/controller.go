package challenges

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/constants"
	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"github.com/jadhamwi21/invoker-challenge/internals/redis"
	"github.com/jadhamwi21/invoker-challenge/internals/sse"
)

type ChallengesController struct {
	Repo *ChallengesRepo
}

func NewChallengesController(repo *ChallengesRepo) *ChallengesController {
	return &ChallengesController{Repo: repo}
}

func (Controller *ChallengesController) SendChallenge(c *fiber.Ctx) error {
	senderUsername := c.Locals("username").(string)
	newChallenge := &models.NewChallengeBody{}
	if err := c.BodyParser(newChallenge); err != nil {
		return err
	}

	challenge := models.Challenge{Sender: senderUsername, Receiver: newChallenge.Username, ID: newChallenge.ID}
	data, _ := json.Marshal(challenge)

	err := redis.RedisClient.HSet(c.Context(), constants.REDIS_CHALLENGES_HASH, newChallenge.ID, data).Err()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "an error has occured", "code": fiber.StatusInternalServerError})
	}

	event := sse.NewSSEvent(constants.NEW_CHALLENGE_EVENT, challenge)
	sse.SseService.SendEventToUser(newChallenge.Username, event)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Challenge Sent", "code": fiber.StatusOK})
}

func (Controller *ChallengesController) AcceptChallenge(c *fiber.Ctx) error {
	// challengeId := c.Params("challengeId")
	return nil
}
func (Controller *ChallengesController) DenyChallenge(c *fiber.Ctx) error {

	challengeId := c.Params("challengeId")
	value := redis.RedisClient.HGet(c.Context(), constants.REDIS_CHALLENGES_HASH, challengeId).Val()
	challenge := &models.Challenge{}
	json.Unmarshal([]byte(value), challenge)
	sender := challenge.Sender
	err := redis.RedisClient.HDel(c.Context(), constants.REDIS_CHALLENGES_HASH, challengeId).Err()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "an error has occured", "code": fiber.StatusInternalServerError})
	}
	event := sse.NewSSEvent(constants.DENY_CHALLENGE_EVENT, challengeId)
	sse.SseService.SendEventToUser(sender, event)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Challenge Denied", "code": fiber.StatusOK})
}
