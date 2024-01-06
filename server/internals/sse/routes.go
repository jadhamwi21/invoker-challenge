package sse

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/auth"
)

func SetupSSE(app *fiber.App) {
	router := app.Group("/sse")
	router.Get("/", auth.Protected, SSEHandler)
	router.Delete("/", auth.Protected, SSEDisconnectHandler)
}
