package friends

import (
	"fmt"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"github.com/jadhamwi21/invoker-challenge/internals/validation"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type FriendsController struct {
	Repo *FriendsRepo
}

func NewFriendsController(repo *FriendsRepo) *FriendsController {
	return &FriendsController{Repo: repo}
}

func (Controller *FriendsController) NewFriendRequestHandler(c *fiber.Ctx) error {

	username := c.Locals("username").(string)
	friend := &models.NewFriendRequest{}
	if err := c.BodyParser(friend); err != nil {
		return err
	}
	validate := validator.New()

	if err := validate.Struct(friend); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": fiber.StatusBadRequest, "error": validation.FormatValidationError(err)})
	}
	err := Controller.Repo.FriendRequest(username, friend.Username)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"code": fiber.StatusOK, "message": "friend request sent"})
}

func (Controller *FriendsController) AcceptFriendRequestHandler(c *fiber.Ctx) error {

	username := c.Locals("username").(string)
	requestId := c.Params("id")
	err := Controller.Repo.AcceptFriendRequest(username, requestId)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"code": fiber.StatusOK, "message": "friend request accepted"})
}

func (Controller *FriendsController) RejectFriendRequestHandler(c *fiber.Ctx) error {

	username := c.Locals("username").(string)
	requestId := c.Params("id")
	err := Controller.Repo.RejectFriendRequest(username, requestId)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"code": fiber.StatusOK, "message": "friend request rejected"})
}

func (Controller *FriendsController) GetFriendsHandler(c *fiber.Ctx) error {

	username := c.Locals("username").(string)

	friends, err := Controller.Repo.GetFriendsByUsername(username)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(friends)
}

func (Controller *FriendsController) FriendStatusHandler(c *fiber.Ctx) error {

	username := c.Locals("username").(string)
	friendUsername := c.Params("username")
	res, err := Controller.Repo.FriendStatusCheck(username, friendUsername)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(res)
}

func (Controller *FriendsController) RemoveFriendHandler(c *fiber.Ctx) error {

	clientId := c.Locals("id").(primitive.ObjectID)
	fmt.Println(clientId)
	friendUsername := c.Params("username")
	err := Controller.Repo.RemoveFriend(clientId, friendUsername)
	if err != nil {
		return err
	}
	return c.SendStatus(fiber.StatusOK)
}
