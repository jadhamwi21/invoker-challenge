package players

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/auth"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddPlayersRoutes(app *fiber.App, db *mongo.Database) {

	repo := NewPlayersRepo(db)
	controller := NewPlayersController(repo)

	router := app.Group("/players")

	router.Use(auth.Protected)

	router.Get("/", controller.GetPlayersHandler)

}
