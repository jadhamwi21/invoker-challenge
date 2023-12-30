package models

type Friend string

type NewFriend struct {
	Username string `json:"username" validate:"required"`
}
