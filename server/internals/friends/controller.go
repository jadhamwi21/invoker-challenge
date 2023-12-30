package friends

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"github.com/jadhamwi21/invoker-challenge/internals/validation"
)

type FriendsController struct {
	Repo *FriendsRepo
}

func NewFriendsController(repo *FriendsRepo) *FriendsController {
	return &FriendsController{Repo: repo}
}

func (Controller *FriendsController) NewFriendHandler(c *fiber.Ctx) error {

	username := c.Locals("username").(string)
	friend := &models.NewFriend{}
	if err := c.BodyParser(friend); err != nil {
		return err
	}
	validate := validator.New()

	if err := validate.Struct(friend); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": fiber.StatusBadRequest, "error": validation.FormatValidationError(err)})
	}
	err := Controller.Repo.AddNewFriend(username, friend.Username)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"code": fiber.StatusOK, "message": "friend added"})
}