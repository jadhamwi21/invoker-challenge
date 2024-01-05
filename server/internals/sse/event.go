package sse

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strings"
)

const _EXIT_EVENT = "EXIT"

type SSEvent struct {
	eventType string
	data      interface{}
}

func NewSSEvent(eventType string, data interface{}) SSEvent {
	return SSEvent{eventType: eventType, data: data}
}

func NewExitEvent() SSEvent {
	return NewSSEvent(_EXIT_EVENT, nil)
}

func (event SSEvent) Format() (string, error) {
	var buf bytes.Buffer
	enc := json.NewEncoder(&buf)

	m := event.data

	err := enc.Encode(m)
	if err != nil {
		return "", nil
	}
	sb := strings.Builder{}

	sb.WriteString(fmt.Sprintf("event: %s\n", event.eventType))
	sb.WriteString(fmt.Sprintf("retry: %d\n", 15000))
	sb.WriteString(fmt.Sprintf("data: %v\n\n", strings.Trim(buf.String(), "\n")))

	return sb.String(), nil
}

func (event SSEvent) IsExitEvent() bool {
	return event.eventType == _EXIT_EVENT
}
