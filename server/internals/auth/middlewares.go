package auth

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

var AUTH_ERROR = fiber.NewError(fiber.StatusUnauthorized, "unauthorized")

func Protected(c *fiber.Ctx) error {
	token := c.Cookies("jwt")
	fmt.Println(token)
	claims, err := ParseToken(token)
	if err != nil {
		return AUTH_ERROR
	}
	c.Locals("username", claims.Username)
	fmt.Println(c.Locals("username"))
	return c.Next()
}
