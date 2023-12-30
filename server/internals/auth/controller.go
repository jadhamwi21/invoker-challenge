package auth

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/validation"
)

type AuthController struct {
	Repo *AuthRepo
}

func NewAuthController(repo *AuthRepo) *AuthController {
	return &AuthController{Repo: repo}
}

type SignupBody struct {
	Username  string `json:"username" validate:"required"`
	FirstName string `json:"firstname" validate:"required"`
	LastName  string `json:"lastname" validate:"required"`
	Password  string `json:"password" validate:"required"`
	Email     string `json:"email" validate:"required"`
}

func (controller *AuthController) SignupHandler(c *fiber.Ctx) error {
	body := &SignupBody{}

	if err := c.BodyParser(body); err != nil {
		return err
	}
	validate := validator.New()

	if err := validate.Struct(body); err != nil {
		return c.JSON(fiber.Map{"status": fiber.StatusBadRequest, "errors": validation.FormatValidationError(err)})
	}

	return c.JSON(fiber.Map{"status": "OK"})

}
