package auth

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddAuthRoutes(app *fiber.App, db *mongo.Database) {

	repo := NewAuthRepo(db)
	controller := NewAuthController(repo)

	routers := app.Group("/auth")

	routers.Post("/signup", controller.SignupHandler)
	routers.Post("/login", controller.LoginHandler)

}
