package main

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/jadhamwi21/invoker-challenge/configs"
	"github.com/jadhamwi21/invoker-challenge/internals/auth"
	"github.com/jadhamwi21/invoker-challenge/internals/database"
	"github.com/jadhamwi21/invoker-challenge/internals/friends"
	"github.com/jadhamwi21/invoker-challenge/internals/players"
	"github.com/spf13/viper"
)

func main() {
	configs.EnvConfig()
	db := database.ConnectToDatabase()

	app := fiber.New(fiber.Config{ErrorHandler: func(c *fiber.Ctx, err error) error {
		if err, ok := err.(*fiber.Error); ok {
			c.Status(err.Code)
			return c.JSON(fiber.Map{"code": err.Code, "message": err.Message})
		} else {
			return err
		}
	}})
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowCredentials: true,
	}))

	app.Use(logger.New(logger.Config{
		Format: "[${ip}]:${port} ${status} - ${method} ${path}\n",
	}))

	auth.AddAuthRoutes(app, db)
	players.AddPlayersRoutes(app, db)
	friends.AddFriendsRoutes(app, db)

	PORT := fmt.Sprintf(":%v", viper.GetString("PORT"))
	app.Listen(PORT)
}
