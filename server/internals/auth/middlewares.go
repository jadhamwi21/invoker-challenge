package auth

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var AUTH_ERROR = fiber.NewError(fiber.StatusUnauthorized, "unauthorized")

func Protected(c *fiber.Ctx) error {
	token1, token2 := c.Cookies("jwt"), c.Query("jwt")
	var token string
	if token1 != "" {
		token = token1
	}
	if token2 != "" {
		token = token2
	}
	claims, err := ParseToken(token)
	if err != nil {
		return AUTH_ERROR
	}
	c.Locals("username", claims.Username)
	id, _ := primitive.ObjectIDFromHex(claims.ID)
	c.Locals("id", id)

	return c.Next()
}
