package auth

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var AUTH_ERROR = fiber.NewError(fiber.StatusUnauthorized, "unauthorized")

func Protected(c *fiber.Ctx) error {
	token := c.Cookies("jwt")

	claims, err := ParseToken(token)
	if err != nil {
		return AUTH_ERROR
	}
	c.Locals("username", claims.Username)
	id, _ := primitive.ObjectIDFromHex(claims.ID)
	c.Locals("id", id)

	return c.Next()
}
