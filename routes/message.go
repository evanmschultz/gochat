package routes

import (
	"net/http"
	"strconv"

	"gochat/database"
	"gochat/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// AddMessageRoutes sets up the routes for sending, editing, and deleting messages.
func AddMessageRoutes(r *gin.Engine, db *gorm.DB) {
	r.POST("/chat/:chat_id/message", func(c *gin.Context) { sendMessage(c, db) })
	r.PUT("/chat/:chat_id/message/:message_id", func(c *gin.Context) { editMessage(c, db) })
}

/*
sendMessage handles sending a message to a chat.

Takes a JSON object with a message, binds it to a Message struct, and adds it to the chat's message history in the database.
Returns a status message: "message sent" and the message ID if successful, "Chat not found" if the chat does not exist, "Invalid input" if input is invalid.

Example request body:
{
	"message": "Hello, world!"
}
*/
func sendMessage(c *gin.Context, db *gorm.DB) {
	chatID, err := strconv.Atoi(c.Param("chat_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid chat ID"})
		return
	}

	var message models.Message
	if err := c.BindJSON(&message); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := database.AddMessage(db, uint(chatID), &message); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Mock AI response
	aiResponse := "This is a response from the AI."
	c.JSON(http.StatusOK, gin.H{
		"status":      "message sent",
		"userMessage": message.Message,
		"aiResponse":  aiResponse,
		"messageID":   message.ID,
	})
}

/*
editMessage handles editing a specific message in a chat.

Takes the message_id from the URL parameters and a JSON object with the new message content.
Returns a status message: "message edited" if successful, "Invalid input" if input is invalid.

Example request body:
{
	"message": "Hello, edited message!"
}
*/
func editMessage(c *gin.Context, db *gorm.DB) {
	messageID, err := strconv.Atoi(c.Param("message_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid message ID"})
		return
	}

	chatID, err := strconv.Atoi(c.Param("chat_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid chat ID"})
		return
	}

	newMessage, err := bindMessage(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := database.UpdateMessage(db, uint(chatID), uint(messageID), newMessage.Message); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":     "message edited",
		"messageID":  messageID,
		"newMessage": newMessage.Message,
	})
}

// bindMessage is a helper function to bind a JSON message to a Message struct.
func bindMessage(c *gin.Context) (models.Message, error) {
	var message models.Message
	err := c.BindJSON(&message)
	return message, err
}