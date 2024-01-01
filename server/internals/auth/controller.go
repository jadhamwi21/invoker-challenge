package auth

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"github.com/jadhamwi21/invoker-challenge/internals/validation"
)

type AuthController struct {
	Repo *AuthRepo
}

func NewAuthController(repo *AuthRepo) *AuthController {
	return &AuthController{Repo: repo}
}

func (Controller *AuthController) SignupHandler(c *fiber.Ctx) error {
	body := &models.NewPlayer{}

	if err := c.BodyParser(body); err != nil {
		return err
	}

	validate := validator.New()
	if err := validate.Struct(body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": fiber.StatusBadRequest, "error": validation.FormatValidationError(err)})
	}
	validEmail := validation.ValidateEmail(body.Email)
	if !validEmail {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": fiber.StatusBadRequest, "error": "Invalid email"})
	}
	err := Controller.Repo.CreateNewPlayer(body)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"code": fiber.StatusOK})

}

func (Controller *AuthController) LoginHandler(c *fiber.Ctx) error {
	body := &models.PlayerLoginCredentials{}

	if err := c.BodyParser(body); err != nil {
		return err
	}

	validate := validator.New()
	if err := validate.Struct(body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": fiber.StatusBadRequest, "error": validation.FormatValidationError(err)})
	}
	response, token, err := Controller.Repo.AuthenticatePlayer(body)
	if err != nil {
		return err
	}
	c.Cookie(&fiber.Cookie{Name: "jwt", Value: token, HTTPOnly: true})
	return c.Status(fiber.StatusOK).JSON(response)

}

func (Controller *AuthController) LogoutHandler(c *fiber.Ctx) error {
	c.ClearCookie("jwt")
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"code": fiber.StatusOK})

}
