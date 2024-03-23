package main

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/jadhamwi21/invoker-challenge/configs"
	"github.com/jadhamwi21/invoker-challenge/internals/auth"
	"github.com/jadhamwi21/invoker-challenge/internals/challenges"
	"github.com/jadhamwi21/invoker-challenge/internals/database"
	"github.com/jadhamwi21/invoker-challenge/internals/engine"
	"github.com/jadhamwi21/invoker-challenge/internals/friends"
	"github.com/jadhamwi21/invoker-challenge/internals/matches"
	"github.com/jadhamwi21/invoker-challenge/internals/notifications"
	"github.com/jadhamwi21/invoker-challenge/internals/players"
	"github.com/jadhamwi21/invoker-challenge/internals/redis"
	"github.com/jadhamwi21/invoker-challenge/internals/sse"
	"github.com/jadhamwi21/invoker-challenge/internals/ws"
	"github.com/spf13/viper"
)

func main() {
	configs.EnvConfig()
	db := database.ConnectToDatabase()
	redis := redis.InitializeRedis()

	app := fiber.New(fiber.Config{ErrorHandler: func(c *fiber.Ctx, err error) error {
		fmt.Println(err.Error())
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
	engines := engine.NewEngines()

	auth.AddAuthRoutes(app, db)
	players.AddPlayersRoutes(app, db)
	friends.AddFriendsRoutes(app, db)
	notifications.AddNotificationsRoutes(app, db)
	challenges.AddChallengesRoutes(app, redis)
	matches.AddMatchesRoutes(app, redis, db, engines)
	ws.AddWebsocketToApp(app, redis, engines)
	sse.SetupSSE(app)

	PORT := fmt.Sprintf(":%v", viper.GetString("PORT"))
	app.Listen(PORT)
}
