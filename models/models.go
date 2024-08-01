package models

import (
	"gorm.io/gorm"
)

type MessageType string

const (
	UserMessageType MessageType = "USER"
	AIMessageType   MessageType = "AI"
)

// User represents a user in the database
type User struct {
	gorm.Model
	Username string `json:"username" gorm:"unique"`
	Password string `json:"password"`
}

// Chat represents a chat between users
type Chat struct {
	gorm.Model
	UserID   uint      `json:"user_id"`
	Messages []Message `json:"messages" gorm:"constraint:OnDelete:CASCADE;"`
}

// Message represents a message in a chat
type Message struct {
	gorm.Model
	ChatID      uint       `json:"chat_id"`
	UserID      uint       `json:"user_id"`
	Message     string     `json:"message"`
	MessageType MessageType `json:"message_type"`
}