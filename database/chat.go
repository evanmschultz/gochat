package database

import (
	"errors"

	"gochat/models"

	"gorm.io/gorm"
)

func AddChat(db *gorm.DB, chat *models.Chat) error {
	result := db.Create(chat)
	return result.Error
}

func GetChat(db *gorm.DB, chatID uint) (*models.Chat, error) {
	var chat models.Chat
	result := db.Preload("Messages").First(&chat, chatID)
	if result.Error != nil {
		return nil, result.Error
	}
	return &chat, nil
}

func GetAllChatsForUser(db *gorm.DB, userID uint) ([]models.Chat, error) {
	var chats []models.Chat
	result := db.Where("user_id = ?", userID).Find(&chats)
	return chats, result.Error
}

func DeleteChat(db *gorm.DB, chatID uint) error {
	result := db.Delete(&models.Chat{}, chatID)
	return result.Error
}

func AddMessage(db *gorm.DB, chatID uint, message *models.Message) error {
	var chat models.Chat
	if err := db.First(&chat, chatID).Error; err != nil {
		return errors.New("chat not found")
	}

	message.ChatID = chatID
	result := db.Create(message)
	return result.Error
}

func GetAllChats(db *gorm.DB) ([]models.Chat, error) {
	var chats []models.Chat
	result := db.Preload("Messages").Find(&chats)
	if result.Error != nil {
		return nil, result.Error
	}
	return chats, nil
}

// func UpdateMessage(db *gorm.DB, chatID, messageID uint, newMessageContent string) error {
// 	var chat models.Chat
// 	if err := db.First(&chat, chatID).Error; err != nil {
// 		return errors.New("chat not found")
// 	}

// 	var message models.Message
// 	result := db.First(&message, messageID)
// 	if result.Error != nil {
// 		return result.Error
// 	}

// 	if message.ChatID != chatID {
// 		return errors.New("message does not belong to this chat")
// 	}

// 	message.Message = newMessageContent
// 	result = db.Save(&message)
// 	return result.Error
// }