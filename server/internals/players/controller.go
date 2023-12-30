package players

import (
	"github.com/gofiber/fiber/v2"
)

type PlayersController struct {
	Repo *PlayersRepo
}

func NewPlayersController(repo *PlayersRepo) *PlayersController {
	return &PlayersController{Repo: repo}
}

func (Controller *PlayersController) GetPlayersHandler(c *fiber.Ctx) error {

	query := c.Query("q")
	username := c.Locals("username").(string)
	players, err := Controller.Repo.FindPlayersByQuery(query, username)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(players)
}
