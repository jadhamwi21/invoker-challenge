package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/auth"
	"github.com/jadhamwi21/invoker-challenge/internals/database"
)

func main() {

	db := database.ConnectToDatabase()

	app := fiber.New()

	auth.AddAuthRoutes(app, db)

	app.Listen(":8080")
}
