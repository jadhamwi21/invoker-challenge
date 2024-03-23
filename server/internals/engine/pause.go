package engine

import (
	"context"
	"time"
)

type Pause struct {
	Timer string
}

func (p *Pause) Run(ctx context.Context, channel chan interface{}, signal chan bool) {
	channel <- map[string]interface{}{"pause": true, "timer": 30}
	for i := 29; i >= 0; i-- {
		select {
		case <-ctx.Done():
			channel <- map[string]interface{}{"pause": false, "timer": -1}
			signal <- true
			return
		default:
			time.Sleep(time.Second)
			channel <- map[string]interface{}{"pause": true, "timer": i}
		}
	}
}
