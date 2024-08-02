package database

import (
	"errors"

	"gochat/models"

	"gorm.io/gorm"
)

/*
AddChat adds a new chat to the database.

- Args:
	* `db` (*gorm.DB) The database connection.
	* `chat` (*models.Chat) The chat to add.

- Returns:
	(error) An error if the operation failed.
*/
func AddChat(db *gorm.DB, chat *models.Chat) error {
	result := db.Create(chat)
	return result.Error
}

/*
GetChat retrieves a chat by ID from the database.

- Args:
	* `db` (*gorm.DB) The database connection.
	* `chatID` (uint) The ID of the chat to retrieve.

- Returns:
	(*models.Chat) The chat if found, or an error if the operation failed.
*/
func GetChat(db *gorm.DB, chatID uint) (*models.Chat, error) {
	var chat models.Chat
	result := db.Preload("Messages").First(&chat, "id = ?", chatID)
	if result.Error != nil {
		return nil, result.Error
	}
	return &chat, nil
}

/*
GetAllChatsForUser retrieves all chats for a given user from the database.

- Args:
	* `db` (*gorm.DB) The database connection.
	* `userID` (uint) The ID of the user.

- Returns:
	([]models.Chat) A list of chats for the user, or an error if the operation failed.
*/
func GetAllChatsForUser(db *gorm.DB, userID uint) ([]models.Chat, error) {
	var chats []models.Chat
	result := db.Where("user_id = ?", userID).Find(&chats)
	return chats, result.Error
}

/*
DeleteChat deletes a chat from the database.

- Args:
	* `db` (*gorm.DB) The database connection.
	* `chatID` (uint) The ID of the chat to delete.

- Returns:
	(error) An error if the operation failed.
*/
func DeleteChat(db *gorm.DB, chatID uint) error {
	conditions := map[string]interface{}{"id": chatID}
	result := db.Delete(&models.Chat{}, conditions)
	return result.Error
}

/*
AddMessage adds a new message to a chat in the database.

- Args:
	* `db` (*gorm.DB) The database connection.
	* `chatID` (uint) The ID of the chat to add the message to.
	* `message` (*models.Message) The message to add.

- Returns:
	(error) An error if the operation failed.
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

- Args:
	* `db` (*gorm.DB) The database connection.

- Returns:
	([]models.Chat) A list of all chats, or an error if the operation failed.
*/
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