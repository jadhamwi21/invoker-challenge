package notifications

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type NotificationsController struct {
	Repo *NotificationsRepo
}

func NewNotificationsController(repo *NotificationsRepo) *NotificationsController {
	return &NotificationsController{Repo: repo}
}

func (Controller *NotificationsController) GetNotificationsHandler(c *fiber.Ctx) error {

	id := c.Locals("id").(primitive.ObjectID)

	notifications, err := Controller.Repo.GetNotifications(id)
	if err != nil {
		fmt.Println(err)
		return err
	}

	return c.JSON(notifications)

}

func (Controller *NotificationsController) MarkNotificationsAsSeenHandler(c *fiber.Ctx) error {

	id := c.Locals("id").(primitive.ObjectID)
	err := Controller.Repo.MarkNotificationsAsSeen(id)
	if err != nil {
		fmt.Println(err)
		return err
	}

	return c.SendStatus(fiber.StatusOK)

}
