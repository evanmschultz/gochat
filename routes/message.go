package routes

import (
	"net/http"
	"strconv"

	"gochat/database"
	"gochat/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

/*
AddMessageRoutes adds message-related routes to the Gin router.

- Args:
	* `router` (*gin.Engine) The Gin router.
	* `db` (*gorm.DB) The database connection.
*/
func AddMessageRoutes(router *gin.Engine, db *gorm.DB) {
	router.POST("/chat/:chat_id/message", func(context *gin.Context) { sendMessage(context, db) })
}

/*
sendMessage sends a message to a chat.

It expects a JSON payload in the request body containing the message details.
The message is associated with the current user (hardcoded to user ID 1 for now).
If the message is sent successfully, the function returns the updated chat history.
If there is an error, it returns an appropriate HTTP status code and error message.

- Args:
	* `context` (*gin.Context) The Gin context for the current HTTP request.
	* `db` (*gorm.DB) The database connection.
*/
func sendMessage(context *gin.Context, db *gorm.DB) {
	chatID, err := strconv.Atoi(context.Param("chat_id"))
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid chat ID"})
		return
	}

	var message models.Message
	if err := context.ShouldBindJSON(&message); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	message.ChatID = uint(chatID)
	message.UserID = 1 // Default user ID
	message.MessageType = models.UserMessageType
	if err := database.AddMessage(db, uint(chatID), &message); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Hardcoded AI response with Go code
	aiResponse := models.Message{
		ChatID:      uint(chatID),
		UserID:      1, // Same user ID as the user
		Message:     "```go\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, world!\")\n}\n```",
		MessageType: models.AIMessageType,
	}
	if err := database.AddMessage(db, uint(chatID), &aiResponse); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Fetch updated chat history
	chat, err := database.GetChat(db, uint(chatID))
	if err != nil {
		context.JSON(http.StatusNotFound, gin.H{"error": "Chat not found"})
		return
	}

	var messages []gin.H
	for _, msg := range chat.Messages {
		messages = append(messages, gin.H{
			"id":          msg.ID,
			"message":     msg.Message,
			"messageType": msg.MessageType,
		})
	}

	context.JSON(http.StatusOK, gin.H{"messages": messages})
}

// func editMessage(context *gin.Context, db *gorm.DB) {
// 	messageID, err := strconv.Atoi(context.Param("message_id"))
// 	if err != nil {
// 		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid message ID"})
// 		return
// 	}

// 	chatID, err := strconv.Atoi(context.Param("chat_id"))
// 	if err != nil {
// 		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid chat ID"})
// 		return
// 	}

// 	newMessage, err := bindMessage(context)
// 	if err != nil {
// 		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
// 		return
// 	}

// 	if err := database.UpdateMessage(db, uint(chatID), uint(messageID), newMessage.Message); err != nil {
// 		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	context.JSON(http.StatusOK, gin.H{
// 		"status":     "message edited",
// 		"messageID":  messageID,
// 		"newMessage": newMessage.Message,
// 	})
// }

// func bindMessage(context *gin.Context) (models.Message, error) {
// 	var message models.Message
// 	err := context.BindJSON(&message)
// 	return message, err
// }