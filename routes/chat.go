package routes

import (
	"net/http"
	"sort"
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

    // HTMX routes
    // router.POST("/chat/htmx", func(context *gin.Context) { createChatHtmx(context, db) })
}

/*
createChatHtmx creates a new chat in the database and returns the chat item as HTML.

It is used for HTMX requests to create a chat without a full page reload.
The chat is associated with the current user (hardcoded to user ID 1 for now).
If the chat is created successfully, it returns the chat item as HTML.
If there is an error, it returns an error message.

- Args:
    * `context` (*gin.Context) The Gin context for the current HTTP request.
    * `db` (*gorm.DB) The database connection.
*/
func createChat(context *gin.Context, db *gorm.DB) {
	var chat models.Chat
	chat.UserID = 1 // TODO: Replace with actual user authentication

	if err := database.AddChat(db, &chat); err != nil {
		context.HTML(http.StatusInternalServerError, "partials/error.html", gin.H{"error": "Failed to create chat"})
		return
	}

	context.HTML(http.StatusOK, "components/chat_item.html", gin.H{
		"id":    chat.ID,
		"title": "Chat " + strconv.Itoa(int(chat.ID)),
	})
}

/*
getChatHistory retrieves the chat history for a given chat ID.

It will conditionally return the chat history as JSON or HTML based on the Accept header.

It expects the chat ID as a URL parameter.
If the chat is found, it returns the chat history.
If there is an error, it returns an appropriate HTTP status code and error message.

- Args:
    * `context` (*gin.Context) The Gin context for the current HTTP request.
    * `db` (*gorm.DB) The database connection.

- Returns:
    * `messages` ([]gin.H) A list of messages in the chat.
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

    context.HTML(http.StatusOK, "partials/chat_history.html", gin.H{
        "messages": messages,
        "chatID":   chatID,
    })
    context.HTML(http.StatusOK, "components/input_form.html", gin.H{"chatID": chatID, "title": "GoChat",})
}

/*
getAllChatsForUser retrieves all chats associated with the current user.

It will conditionally return the chat list as JSON or HTML based on the Accept header.

The user ID is hardcoded to 1 for now.
If the chats are found, it returns the chat list.
If there is an error, it returns an appropriate HTTP status code and error message.

- Args:
    * `context` (*gin.Context) The Gin context for the current HTTP request.
    * `db` (*gorm.DB) The database connection.

- Returns:
    * `chats` ([]gin.H) A list of chats associated with the user.
*/
func getAllChatsForUser(context *gin.Context, db *gorm.DB) {
    userID := 1
    chats, err := database.GetAllChatsForUser(db, uint(userID))
    if err != nil {
        context.HTML(http.StatusInternalServerError, "partials/chat_list.html", gin.H{"error": "Failed to retrieve chats"})
        return
    }

    // Sort chats in descending order of ID
    sort.Slice(chats, func(i, j int) bool {
        return chats[i].ID > chats[j].ID
    })

    var chatList []gin.H
    for _, chat := range chats {
        chatList = append(chatList, gin.H{
            "id":    chat.ID,
            "title": "Chat " + strconv.Itoa(int(chat.ID)),
        })
    }

    context.HTML(http.StatusOK, "partials/chat_list.html", gin.H{
        "chats": chatList,
    })
}

/*
deleteChat deletes a chat from the database.

It expects the chat ID as a URL parameter.
If the chat is deleted successfully, it returns a success message.

- Args:
    * `context` (*gin.Context) The Gin context for the current HTTP request.
    * `db` (*gorm.DB) The database connection.

- Returns:
    * `status` (string) A success message if the chat is deleted.
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

