package notifications

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/auth"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddNotificationsRoutes(app *fiber.App, db *mongo.Database) {

	repo := NewNotificationsRepo(db)
	controller := NewNotificationsController(repo)

	router := app.Group("/notifications")

	router.Use(auth.Protected)

	router.Get("/", controller.GetNotificationsHandler)
	router.Put("/seen", controller.MarkNotificationsAsSeenHandler)

}
