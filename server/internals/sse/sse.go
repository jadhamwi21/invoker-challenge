package sse

import (
	"fmt"
)

type sseService struct {
	rooms map[string]chan SSEvent
}

var SseService sseService = sseService{rooms: make(map[string]chan SSEvent)}

func (SseService *sseService) AddUser(username string) {
	SseService.rooms[username] = make(chan SSEvent)
	fmt.Println(SseService.rooms)
}

func (SseService *sseService) RemoveUser(username string) {
	fmt.Println("removed", username)
	delete(SseService.rooms, username)
}

func (SseService *sseService) GetUserChannel(username string) chan SSEvent {
	return SseService.rooms[username]
}

func (SseService *sseService) SendEventToUser(username string, event SSEvent) error {
	if _, ok := SseService.rooms[username]; !ok {
		return nil
	}
	channel := SseService.rooms[username]
	fmt.Println("sent event to ", username)
	go func() {
		channel <- event
	}()
	return nil
}
