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
AddChatRoutes adds chat-related routes to the Gin router.

- Args:
    * `router` (*gin.Engine) The Gin router.
    * `db` (*gorm.DB) The database connection.
*/
func AddChatRoutes(router *gin.Engine, db *gorm.DB) {
    router.POST("/chat", func(context *gin.Context) { createChat(context, db) })
    router.GET("/chat/:chat_id", func(context *gin.Context) { getChatHistory(context, db) })
    router.DELETE("/chat/:chat_id", func(context *gin.Context) { deleteChat(context, db) })
    router.GET("/user/chats", func(context *gin.Context) { getAllChatsForUser(context, db) })
}

/*
createChat creates a new chat in the database.

It expects a JSON payload in the request body containing the chat details.
The chat is associated with the current user (hardcoded to user ID 1 for now).
If the chat is created successfully, the function returns the chat ID and title.
If there is an error, it returns an appropriate HTTP status code and error message.

- Args:
    * `context` (*gin.Context) The Gin context for the current HTTP request.
    * `db` (*gorm.DB) The database connection.
*/
func createChat(context *gin.Context, db *gorm.DB) {
    var chat models.Chat
    if err := context.ShouldBindJSON(&chat); err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    chat.UserID = 1
    if err := database.AddChat(db, &chat); err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create chat"})
        return
    }

    context.JSON(http.StatusOK, gin.H{"id": chat.ID, "title": "Chat " + strconv.Itoa(int(chat.ID))})
}

/*
getChatHistory retrieves the chat history for a given chat ID.

It expects the chat ID as a URL parameter.
If the chat is found, it returns the chat history.
If the chat is not found, it returns an appropriate HTTP status code and error message.

- Args:
    * `context` (*gin.Context) The Gin context for the current HTTP request.
    * `db` (*gorm.DB) The database connection.
*/
func getChatHistory(context *gin.Context, db *gorm.DB) {
    chatID, err := strconv.Atoi(context.Param("chat_id"))
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid chat ID"})
        return
    }

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

/*
getAllChatsForUser retrieves all chats associated with the current user.

The user ID is hardcoded to 1 for now.
If the chats are found, it returns the chat list.
If there is an error, it returns an appropriate HTTP status code and error message.

- Args:
    * `context` (*gin.Context) The Gin context for the current HTTP request.
    * `db` (*gorm.DB) The database connection.
*/
func getAllChatsForUser(context *gin.Context, db *gorm.DB) {
    userID := 1

    chats, err := database.GetAllChatsForUser(db, uint(userID))
    if err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve chats"})
        return
    }

    var chatList []gin.H
    for _, chat := range chats {
        chatList = append(chatList, gin.H{
            "id":    chat.ID,
            "title": "Chat " + strconv.Itoa(int(chat.ID)),
        })
    }

    context.JSON(http.StatusOK, gin.H{"chats": chatList})
}

/*
deleteChat deletes a chat from the database.

It expects the chat ID as a URL parameter.
If the chat is deleted successfully, it returns a success message.

- Args:
    * `context` (*gin.Context) The Gin context for the current HTTP request.
    * `db` (*gorm.DB) The database connection.
*/
func deleteChat(context *gin.Context, db *gorm.DB) {
    chatID, err := strconv.Atoi(context.Param("chat_id"))
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid chat ID"})
        return
    }

    if err := database.DeleteChat(db, uint(chatID)); err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete chat"})
        return
    }

    context.JSON(http.StatusOK, gin.H{"status": "chat deleted"})
}