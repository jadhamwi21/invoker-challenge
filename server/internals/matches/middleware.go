package matches

import (
	"github.com/gofiber/fiber/v2"
	"github.com/redis/go-redis/v9"
)

type match_middleware struct {
	Repo *MatchesRepo
}

func (mw *match_middleware) MatchMiddleware(c *fiber.Ctx) error {
	username := c.Locals("username").(string)
	sessinId := c.Params("sessionId")
	players, err := mw.Repo.GetMatchPlayers(sessinId)
	if err != nil {
		return err
	}
	for _, player := range players {
		if player == username {
			return c.Next()
		}
	}
	return fiber.NewError(fiber.StatusUnauthorized, "you're not a player of this match")
}

func NewMatchMiddleware(redis *redis.Client) *match_middleware {
	repo := NewMatchesRepo(redis)
	return &match_middleware{Repo: repo}
}
