package friends

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/auth"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddFriendsRoutes(app *fiber.App, db *mongo.Database) {

	repo := NewFriendsRepo(db)
	controller := NewFriendsController(repo)

	friendRouter := app.Group("/friend")
	friendRouter.Use(auth.Protected)
	friendRouter.Post("/request", controller.NewFriendRequestHandler)
	friendRouter.Post("/accept/:id", controller.AcceptFriendRequestHandler)
	friendRouter.Post("/reject/:id", controller.RejectFriendRequestHandler)

	friendsRouter := app.Group("/friends")

	friendsRouter.Get("/", controller.GetFriendsHandler)

}
