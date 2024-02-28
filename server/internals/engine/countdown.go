package engine

import "time"

type Countdown struct {
	val int
}

func (c *Countdown) pushCountdownValueToChannels(channels []chan interface{}, val int) {
	for _, ch := range channels {
		ch <- val
	}
}

func (c *Countdown) Run(channels []chan interface{}) {
	go c.pushCountdownValueToChannels(channels, c.val)
	for i := 0; i < COUNTDOWN; i++ {
		time.Sleep(time.Second)
		c.val--
		go c.pushCountdownValueToChannels(channels, c.val)
	}
	c.val = COUNTDOWN
}
