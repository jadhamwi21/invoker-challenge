package matches

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/auth"
	"github.com/jadhamwi21/invoker-challenge/internals/engine"
	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddMatchesRoutes(app *fiber.App, redis *redis.Client, db *mongo.Database, engines *engine.Engines) {

	repo := NewMatchesRepo(redis, db)
	controller := NewMatchesController(repo, engines)

	router := app.Group("/matches")

	router.Use(auth.Protected)

	router.Post("/", controller.CreateMatchHandler)
	router.Get("/:username?", controller.GetMatches)
	router.Get("/session/:sessionId", NewMatchMiddleware(redis).MatchMiddleware, controller.GetMatch)
}
