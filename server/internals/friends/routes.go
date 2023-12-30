package friends

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/auth"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddFriendsRoutes(app *fiber.App, db *mongo.Database) {

	repo := NewFriendsRepo(db)
	controller := NewFriendsController(repo)

	router := app.Group("/friends")
	router.Use(auth.Protected)
	router.Post("/", controller.NewFriendHandler)

}
