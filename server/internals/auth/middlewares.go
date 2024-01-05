package auth

import (
	"github.com/gofiber/fiber/v2"
)

var AUTH_ERROR = fiber.NewError(fiber.StatusUnauthorized, "unauthorized")

func Protected(c *fiber.Ctx) error {
	token := c.Cookies("jwt")

	claims, err := ParseToken(token)
	if err != nil {
		return AUTH_ERROR
	}
	c.Locals("username", claims.Username)

	return c.Next()
}
