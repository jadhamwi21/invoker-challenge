package matchmake

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/auth"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddMatchMakeRoutes(app *fiber.App, db *mongo.Database) {
	router := app.Group("/matchmake")
	repo := NewMatchMakeRepo(db)
	controller := NewMatchMakeController(repo)
	router.Use(auth.Protected)
	router.Post("/:username", controller.InitiateMatch)

}
