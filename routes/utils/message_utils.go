package utils

import (
	"gochat/database"
	"gochat/models"
	"net/http"
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
	return strconv.Atoi(context.Param("chat_id"))
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
func SaveAIResponse(db *gorm.DB, chatID int, message string) (*models.Message, error) {
	aiResponse := &models.Message{
		ChatID:      uint(chatID),
		UserID:      1,
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

/*
RespondBasedOnAcceptHeader conditionally responds with JSON or HTML based on the Accept header.

If the Accept header is "text/html", it renders an HTML template with the messages.
If the Accept header is not "text/html", it returns the messages as JSON.

- Args:
	* `context` (*gin.Context) The Gin context for the current HTTP request.
	* `messages` ([]gin.H) A list of messages to respond with.
	* `userMessage` (*models.Message) The user message to include in the response.
	* `aiMessage` (*models.Message) The AI message to include in the response.
*/
func RespondBasedOnAcceptHeader(context *gin.Context, messages []gin.H, userMessage, aiMessage *models.Message) {
	if context.GetHeader("Accept") == "text/html" {
		context.HTML(http.StatusOK, "new_messages.html", gin.H{
			"messages": []gin.H{
				{
					"id":          userMessage.ID,
					"message":     userMessage.Message,
					"messageType": userMessage.MessageType,
				},
				{
					"id":          aiMessage.ID,
					"message":     aiMessage.Message,
					"messageType": aiMessage.MessageType,
				},
			},
		})
	} else {
		context.JSON(http.StatusOK, gin.H{"messages": messages})
	}
}