package games

import (
	"encoding/json"
	"fmt"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/challenges"
	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"github.com/jadhamwi21/invoker-challenge/internals/sse"
	"github.com/jadhamwi21/invoker-challenge/internals/validation"
)

type GamesController struct {
	Repo *GamesRepo
}

func NewGamesController(repo *GamesRepo) *GamesController {
	return &GamesController{Repo: repo}
}

func (Controller *GamesController) CreateGameHandler(c *fiber.Ctx) error {
	body := &models.NewGameBody{}
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
	err = Controller.Repo.CreateGame(c.Context(), body, client)
	if err != nil {
		return err
	}
	event := sse.NewSSEvent(START_GAME_EVENT, body.SessionID)
	go sse.SseService.SendEventToUser(session.P1, event)
	go sse.SseService.SendEventToUser(session.P2, event)
	return c.SendStatus(fiber.StatusOK)
}
