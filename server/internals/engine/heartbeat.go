package engine

import (
	"time"
)

type Heartbeat struct {
	timestamp int
}

func (h *Heartbeat) Bump() {
	h.timestamp++
}

func (h *Heartbeat) pushHeartbeatToChannels(channels []chan int) {
	for _, ch := range channels {
		ch <- h.timestamp
	}
}

func (h *Heartbeat) Run(channels []chan int) {
	for i := 0; i < 30; i++ {
		time.Sleep(time.Second)
		h.Bump()
		go h.pushHeartbeatToChannels(channels)
	}
}
