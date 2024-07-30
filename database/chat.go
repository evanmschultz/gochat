package database

import (
	"errors"

	"gochat/models"
	"gorm.io/gorm"
)

/*
AddChat adds a new chat to the database.

Takes a pointer to a Chat struct and adds it to the database.
Returns an error if the operation failed.
*/
func AddChat(db *gorm.DB, chat *models.Chat) error {
	result := db.Create(chat)
	return result.Error
}

/*
GetChat retrieves a chat by ID from the database.

Takes a chat ID and returns the chat information.
Returns an error if the chat is not found.
*/
func GetChat(db *gorm.DB, chatID uint) (*models.Chat, error) {
	var chat models.Chat
	result := db.Preload("Messages").First(&chat, chatID)
	if result.Error != nil {
		return nil, result.Error
	}
	return &chat, nil
}

/*
DeleteChat deletes a chat from the database.

Takes a chat ID and deletes the chat from the database.
Returns an error if the operation failed.
*/
func DeleteChat(db *gorm.DB, chatID uint) error {
	result := db.Delete(&models.Chat{}, chatID)
	return result.Error
}

/*
AddMessage adds a new message to a chat in the database.

Takes a chat ID and a pointer to a Message struct, and adds the message to the chat.
Returns an error if the operation failed.
*/
func AddMessage(db *gorm.DB, chatID uint, message *models.Message) error {
	var chat models.Chat
	if err := db.First(&chat, chatID).Error; err != nil {
		return errors.New("chat not found")
	}

	message.ChatID = chatID
	result := db.Create(message)
	return result.Error
}

/*
GetAllChats retrieves all chats from the database.

Returns a list of all chats and an error if the operation failed.
*/
func GetAllChats(db *gorm.DB) ([]models.Chat, error) {
	var chats []models.Chat
	result := db.Preload("Messages").Find(&chats)
	if result.Error != nil {
		return nil, result.Error
	}
	return chats, nil
}

/*
UpdateMessage updates a message in a chat in the database.

Takes a chat ID, message ID, and the new message content.
Returns an error if the operation failed.
*/
func UpdateMessage(db *gorm.DB, chatID, messageID uint, newMessageContent string) error {
	var chat models.Chat
	if err := db.First(&chat, chatID).Error; err != nil {
		return errors.New("chat not found")
	}

	var message models.Message
	result := db.First(&message, messageID)
	if result.Error != nil {
		return result.Error
	}

	if message.ChatID != chatID {
		return errors.New("message does not belong to this chat")
	}

	message.Message = newMessageContent
	result = db.Save(&message)
	return result.Error
}