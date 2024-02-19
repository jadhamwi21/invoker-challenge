package challenges

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/auth"
	"github.com/redis/go-redis/v9"
)

func AddChallengesRoutes(app *fiber.App, redis *redis.Client) {
	router := app.Group("/challenges")
	repo := NewChallengesRepo(redis)
	controller := NewChallengesController(repo)
	router.Use(auth.Protected)
	router.Post("/", controller.SendChallenge)
	router.Delete("/:challengeId/accept", controller.AcceptChallenge)
	router.Delete("/:challengeId/deny", controller.DenyChallenge)
}
