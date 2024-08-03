package routes

import (
	"log"
	"net/http"
	"strconv"

	"gochat/database"
	"gochat/models"

	// "gochat/models"
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


func sendMessage(context *gin.Context, db *gorm.DB) {
	userID := 1 // Default user ID
	chatID, err := strconv.Atoi(context.Param("chat_id"))

	if err != nil {
		context.HTML(http.StatusBadRequest, "partials/error.html", gin.H{"error": "Invalid chat ID"})
		log.Println("error", err, "sendMessage: parse chatID, error block 1")
		return
	}

	var userMessage models.Message
	if err := context.ShouldBind(&userMessage); err != nil {
		context.HTML(http.StatusBadRequest, "partials/error.html", gin.H{"error": "Invalid input"})
		log.Println("error", err, "sendMessage: bind userMessage, error block 2")
		return
	}
	userMessage.ChatID = uint(chatID)
	userMessage.UserID = uint(userID)// TODO: Replace with actual user authentication
	userMessage.MessageType = models.UserMessageType

	if err := database.AddMessage(db, uint(chatID), &userMessage); err != nil {
		context.HTML(http.StatusInternalServerError, "partials/error.html", gin.H{"error": err.Error()})
		log.Println("error", err, "sendMessage: add message, error block 3")
		return
	}

	aiResponse := utils.GetAIResponse()
	aiMessage, err := utils.SaveAIResponse(db, chatID, userID, aiResponse)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		log.Println("error", err, "sendMessage: save AI response, error block 4")
		return
	}

	context.HTML(http.StatusOK, "components/message.html", gin.H{
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