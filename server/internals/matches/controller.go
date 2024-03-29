package matches

import (
	"context"
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
	"go.mongodb.org/mongo-driver/bson"
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
		return fiber.NewError(fiber.StatusUnauthorized, "you're unauthorized to create this match")
	}
	err = Controller.Repo.CreateMatch(c.Context(), body, client)
	if err != nil {
		return err
	}
	gameEngine := engine.NewGameEngine(body.SessionID, Controller.Repo.Redis)
	go func() {
		gameEngine.Loop()
		gameEngine.GameOver()
		matchObjectId, err := Controller.Repo.SaveMatch(body.SessionID)
		if err != nil {
			fmt.Println(err)
			return
		}

		playersCollection := Controller.Repo.Database.Collection("players")
		filter := bson.M{
			"$or": []bson.M{
				{"username": session.P1},
				{"username": session.P2},
			},
		}
		fmt.Println(filter)

		playersCollection.UpdateMany(context.Background(), filter, bson.M{"$push": bson.M{"matches": matchObjectId}})
	}()
	Controller.Engines.AddEngine(&gameEngine)
	event := sse.NewSSEvent(constants.START_MATCH_EVENT, body.SessionID)

	go sse.SseService.SendEventToUser(session.P1, event)
	go sse.SseService.SendEventToUser(session.P2, event)
	return c.SendStatus(fiber.StatusOK)
}

func (Controller *MatchesController) GetMatch(c *fiber.Ctx) error {

	sessionId := c.Params("sessionId")
	match, err := Controller.Repo.GetMatch(sessionId)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(match)
}

func (Controller *MatchesController) GetMatches(c *fiber.Ctx) error {
	var username string
	params := c.Params("username")
	if params != "" {
		username = params
	} else {
		username = c.Locals("username").(string)
	}
	matches, err := Controller.Repo.GetMatches(username)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(matches)
}
