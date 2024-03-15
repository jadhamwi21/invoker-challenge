package engine

const (
	HEARTBEAT_CHANNEL = "HeartbeatChannel"
	COUNTDOWN_CHANNEL = "CountdownChannel"
	SPELL_CHANNEL     = "SpellChannel"
	SCORE_CHANNEL     = "ScoreChannel"
	KEYSTROKE_CHANNEL = "KeystrokeChannel"
	PAUSE_CHANNEL     = "PauseChannel"
)

type Channels struct {
	HeartbeatChannel chan interface{}
	CountdownChannel chan interface{}
	SpellChannel     chan interface{}
	ScoreChannel     chan interface{}
	KeystrokeChannel chan interface{}
	PauseChannel     chan interface{}
}

func NewChannels() *Channels {
	return &Channels{HeartbeatChannel: make(chan interface{}), CountdownChannel: make(chan interface{}), SpellChannel: make(chan interface{}), ScoreChannel: make(chan interface{}), KeystrokeChannel: make(chan interface{}), PauseChannel: make(chan interface{})}
}
