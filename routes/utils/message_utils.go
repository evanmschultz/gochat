package utils

import (
	"gochat/database"
	"gochat/models"
	"log"

	// "net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

/*
ParseAndValidateChatID parses and validates the chat ID from the request URL.

If the chat ID is not a valid integer, it returns an error.
If the chat ID is valid, it returns the parsed chat ID.

- Args:
	* `context` (*gin.Context) The Gin context for the current HTTP request.

- Returns:
	* `int` The parsed chat ID.
	* `error` An error if the chat ID is not a valid integer.
*/
func ParseAndValidateChatID(context *gin.Context) (int, error) {
	chatID, err := strconv.Atoi(context.Param("chat_id"))
	log.Println(chatID)
	return chatID, err
}

/*
ParseAndValidateMessage parses and validates the message from the request body.

If the message is not a valid JSON payload, it returns an error.
If the message is valid, it returns the parsed message.

- Args:
	* `context` (*gin.Context) The Gin context for the current HTTP request.
	* `chatID` (int) The chat ID associated with the message.
	
- Returns:
	* `*models.Message` The parsed and validated message.
	* `error` An error if the message is not a valid JSON payload.
*/
func ParseAndValidateMessage(context *gin.Context, chatID int) (*models.Message, error) {
	var message models.Message
	if err := context.ShouldBindJSON(&message); err != nil {
		return nil, err
	}
	message.ChatID = uint(chatID)
	message.UserID = 1 // Default user ID
	message.MessageType = models.UserMessageType
	return &message, nil
}

/*
SaveAIResponse saves the AI response to the database.

It creates a new message with the AI response and associates it with the chat ID.
If the message is saved successfully, it returns the message.
If there is an error, it returns an error.

- Args:
	* `db` (*gorm.DB) The database connection.
	* `chatID` (int) The chat ID associated with the AI response.
	* `message` (string) The AI response message.

- Returns:
	* `*models.Message` The AI response message.
	* `error` An error if the message is not saved successfully.
*/
func SaveAIResponse(db *gorm.DB, chatID int, userID int, message string) (*models.Message, error) {
	aiResponse := &models.Message{
		ChatID:      uint(chatID),
		UserID:      uint(userID),
		Message:     message,
		MessageType: models.AIMessageType,
	}
	err := database.AddMessage(db, uint(chatID), aiResponse)
	return aiResponse, err
}

/*
GetAIResponse returns a hardcoded AI response message.

This is a temp function that produces an example of an AI response message that can be used in the chat
and is only intended for testing and development purposes.

- Returns:
	* `string` The hardcoded AI response message.
*/
func GetAIResponse() string {
	return `Example go code:
` + "```go\n" + `package main

import "fmt"

func main() {
	fmt.Println("Hello, world!")
}
` + "```\n\n" + `This is hardcoded in the backend for now. ` + "`inline-code`" + ` this is an example of inline code.`
}

/*
FetchUpdatedChatHistory retrieves the updated chat history for a given chat ID.

It fetches the chat history from the database based on the chat ID.
If the chat is found, it returns the chat history.
If there is an error, it returns an error.

- Args:
	* `db` (*gorm.DB) The database connection.
	* `chatID` (int) The chat ID associated with the chat history.

- Returns:
	* `[]gin.H` A list of messages in the chat.
	* `error` An error if the chat is not found.
*/
func FetchUpdatedChatHistory(db *gorm.DB, chatID int) ([]gin.H, error) {
	chat, err := database.GetChat(db, uint(chatID))
	if err != nil {
		return nil, err
	}

	messages := make([]gin.H, len(chat.Messages))
	for i, msg := range chat.Messages {
		messages[i] = gin.H{
			"id":          msg.ID,
			"message":     msg.Message,
			"messageType": msg.MessageType,
		}
	}
	return messages, nil
}
