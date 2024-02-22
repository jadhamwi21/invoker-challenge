package games

import "fmt"

const (
	GAME_REDIS_KEY   = "game"
	GAME_STATE_KEY   = "state"
	START_GAME_EVENT = "start:game"
)

func FormatGameHash(sessionId string) string {
	return fmt.Sprintf("%v:%v", GAME_REDIS_KEY, sessionId)
}
