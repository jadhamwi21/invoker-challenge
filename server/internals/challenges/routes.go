package challenges

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/auth"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddChallengesRoutes(app *fiber.App, db *mongo.Database) {
	router := app.Group("/challenges")
	repo := NewChallengesRepo(db)
	controller := NewChallengesController(repo)
	router.Use(auth.Protected)
	router.Post("/", controller.SendChallenge)
	router.Delete("/:challengeId/accept", controller.AcceptChallenge)
	router.Delete("/:challengeId/deny", controller.DenyChallenge)
}
