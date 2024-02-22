package games

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/auth"
	"github.com/redis/go-redis/v9"
)

func AddGamesRoutes(app *fiber.App, redis *redis.Client) {

	repo := NewGamesRepo(redis)
	controller := NewGamesController(repo)

	router := app.Group("/games")

	router.Use(auth.Protected)

	router.Post("/", controller.CreateGameHandler)

}
