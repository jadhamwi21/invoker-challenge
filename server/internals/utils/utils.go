package utils

import (
	"fmt"

	"github.com/jadhamwi21/invoker-challenge/internals/constants"
)

func FormatMatchHash(sessionId string) string {
	return fmt.Sprintf("%v:%v", constants.MATCH_REDIS_KEY, sessionId)
}
