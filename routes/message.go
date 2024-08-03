package routes

import (
	"net/http"

	"gochat/database"
	"gochat/routes/utils"

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
sendMessage adds a new message to the chat history.

It expects a JSON payload in the request body containing the message details.
The message is associated with the current user (hardcoded to user ID 1 for now).
If the message is added successfully, the function returns the updated chat history.
If there is an error, it returns an appropriate HTTP status code and error message.

- Args:
	* `context` (*gin.Context) The Gin context for the current HTTP request.
	* `db` (*gorm.DB) The database connection.

- Returns:
	* `JSON` or `HTML` The updated chat history using the `RespondBasedOnAcceptHeader` function.
	* `error` An error if the chat ID or message is invalid.
*/
func sendMessage(context *gin.Context, db *gorm.DB) {
	chatID, err := utils.ParseAndValidateChatID(context)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userMessage, err := utils.ParseAndValidateMessage(context, chatID)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = database.AddMessage(db, uint(chatID), userMessage)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	aiResponse := utils.GetAIResponse()
	aiMessage, err := utils.SaveAIResponse(db, chatID, aiResponse)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	messages, err := utils.FetchUpdatedChatHistory(db, chatID)
	if err != nil {
		context.JSON(http.StatusNotFound, gin.H{"error": "Chat not found"})
		return
	}

	utils.RespondBasedOnAcceptHeader(context, messages, userMessage, aiMessage)
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