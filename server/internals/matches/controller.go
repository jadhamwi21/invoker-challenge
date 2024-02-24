package matches

import (
	"encoding/json"
	"fmt"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/challenges"
	"github.com/jadhamwi21/invoker-challenge/internals/constants"
	"github.com/jadhamwi21/invoker-challenge/internals/engine"
	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"github.com/jadhamwi21/invoker-challenge/internals/sse"
	"github.com/jadhamwi21/invoker-challenge/internals/validation"
)

type MatchesController struct {
	Repo    *MatchesRepo
	Engines *engine.Engines
}

func NewMatchesController(repo *MatchesRepo, engines *engine.Engines) *MatchesController {
	return &MatchesController{Repo: repo, Engines: engines}
}

func (Controller *MatchesController) CreateMatchHandler(c *fiber.Ctx) error {
	body := &models.NewMatchBody{}
	if err := c.BodyParser(body); err != nil {
		return err
	}
	validate := validator.New()
	if err := validate.Struct(body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": fiber.StatusBadRequest, "error": validation.FormatValidationError(err)})
	}
	client := c.Locals("username").(string)
	fmt.Println(body.SessionID)
	value, err := Controller.Repo.Redis.HGet(c.Context(), challenges.REDIS_SESSIONS_HASH, body.SessionID).Result()
	fmt.Println(value)
	if err != nil {
		return err
	}
	session := &models.Session{}
	err = json.Unmarshal([]byte(value), session)
	if err != nil {
		return err
	}
	if session.P1 != client && session.P2 != client {
		return fiber.NewError(fiber.StatusUnauthorized, "you're unauthorized to start this match")
	}
	err = Controller.Repo.CreateMatch(c.Context(), body, client)
	if err != nil {
		return err
	}
	gameEngine := engine.NewGameEngine(body.SessionID)
	Controller.Engines.AddEngine(&gameEngine)
	event := sse.NewSSEvent(constants.START_MATCH_EVENT, body.SessionID)

	go sse.SseService.SendEventToUser(session.P1, event)
	go sse.SseService.SendEventToUser(session.P2, event)
	return c.SendStatus(fiber.StatusOK)
}
