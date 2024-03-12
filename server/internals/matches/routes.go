package matches

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/auth"
	"github.com/jadhamwi21/invoker-challenge/internals/engine"
	"github.com/redis/go-redis/v9"
)

func AddMatchesRoutes(app *fiber.App, redis *redis.Client, engines *engine.Engines) {

	repo := NewMatchesRepo(redis)
	controller := NewMatchesController(repo, engines)
	repo.GetMatchPlayers("04319720-f856-4e9b-a4e9-b553fbe157da")
	router := app.Group("/matches")

	router.Use(auth.Protected)

	router.Post("/", controller.CreateMatchHandler)

}
