package routes

import (
	"net/http"
	"strconv"

	"gochat/database"
	"gochat/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// AddChatRoutes sets up the routes for creating, getting, and deleting chats.
func AddChatRoutes(r *gin.Engine, db *gorm.DB) {
	r.POST("/chat", func(c *gin.Context) { createChat(c, db) })
	r.GET("/chat/:chat_id", func(c *gin.Context) { getChatHistory(c, db) })
	r.DELETE("/chat/:chat_id", func(c *gin.Context) { deleteChat(c, db) })
	r.GET("/user/:user_id/chats", func(c *gin.Context) { getAllChatsForUser(c, db) })
}

/*
createChat handles creating a chat.

Takes a JSON object with chat details, binds it to a Chat struct, and adds it to the database.
Returns a status message: "chat created" and the chat ID if successful, "Invalid input" if input is invalid, 
"Failed to create chat" if there was an error in creating the chat.

Example request body:
{
	"user_id": 1,
	"messages": []
}
*/
func createChat(c *gin.Context, db *gorm.DB) {
	var chat models.Chat
	if err := c.ShouldBindJSON(&chat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := database.AddChat(db, &chat); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create chat"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "chat created", "chat_id": chat.ID})
}

/*
getChatHistory handles getting chat history.

Retrieves a chat by ID from the database and returns the chat ID and message history.
Returns a status message: "Chat not found" if the chat does not exist, "Invalid chat ID" if the chat ID is invalid.

Example response:
{
	"chat_id": 1,
	"history": [...]
}
*/
func getChatHistory(c *gin.Context, db *gorm.DB) {
	chatID, err := strconv.Atoi(c.Param("chat_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid chat ID"})
		return
	}

	chat, err := database.GetChat(db, uint(chatID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Chat not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"chat_id": chatID, "history": chat.Messages})
}

/*
getAllChatsForUser handles retrieving all chats for a specific user.

Takes the user_id from the URL parameters and returns a list of all chat IDs associated with that user.
Returns a status message: "Failed to retrieve chats" if there was an error in retrieving the chats, 
"Invalid user ID" if the user ID is invalid.

Example response:
{
	"user_id": 1,
	"chats": [...]
}
*/
func getAllChatsForUser(c *gin.Context, db *gorm.DB) {
	userID, err := strconv.Atoi(c.Param("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	chats, err := database.GetAllChats(db)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve chats"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user_id": userID, "chats": chats})
}

/*
deleteChat handles deleting a chat.

Deletes a chat by ID from the database.
Returns a status message: "chat deleted" if successful, "Invalid chat ID" if the chat ID is invalid, 
"Failed to delete chat" if there was an error in deleting the chat.

Example response:
{
	"status": "chat deleted"
}
*/
func deleteChat(c *gin.Context, db *gorm.DB) {
	chatID, err := strconv.Atoi(c.Param("chat_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid chat ID"})
		return
	}

	if err := database.DeleteChat(db, uint(chatID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete chat"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "chat deleted"})
}