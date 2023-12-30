package auth

import (
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

var AUTH_ERROR = fiber.NewError(fiber.StatusUnauthorized, "unauthorized")

func Protected(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	authHeaderSplitted := strings.Split(authHeader, " ")
	if len(authHeaderSplitted) != 2 {
		return AUTH_ERROR
	}
	token := authHeaderSplitted[1]
	claims, err := ParseToken(token)
	if err != nil {
		return AUTH_ERROR
	}
	c.Locals("username", claims.Username)
	fmt.Println(c.Locals("username"))
	return c.Next()
}
