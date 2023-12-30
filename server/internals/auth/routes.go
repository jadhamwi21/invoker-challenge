package auth

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddAuthRoutes(app *fiber.App, db *mongo.Database) {

	repo := NewAuthRepo(db)
	controller := NewAuthController(repo)

	router := app.Group("/auth")

	router.Post("/signup", controller.SignupHandler)
	router.Post("/login", controller.LoginHandler)
	router.Post("/logout", Protected, controller.LogoutHandler)

}
