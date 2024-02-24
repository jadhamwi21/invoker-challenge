package engine

import (
	"time"
)

type Heartbeat struct {
	timestamp int
}

func (h *Heartbeat) bump() {
	h.timestamp--
}

func (h *Heartbeat) pushHeartbeatToChannels(channels []chan int, timestamp int) {
	for _, ch := range channels {
		ch <- timestamp
	}
}

func (h *Heartbeat) Run(channels []chan int) {
	go h.pushHeartbeatToChannels(channels, h.timestamp)
	for i := 0; i < MATCH_DURATION; i++ {
		time.Sleep(time.Second)
		h.bump()
		go h.pushHeartbeatToChannels(channels, h.timestamp)
	}
}
