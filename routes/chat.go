package routes

import (
	"log"
	"net/http"
	"strconv"

	"gochat/database"
	"gochat/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AddChatRoutes(router *gin.Engine, db *gorm.DB) {
    router.POST("/chat", func(context *gin.Context) { createChat(context, db) })
    router.GET("/chat/:chat_id", func(context *gin.Context) { getChatHistory(context, db) })
    router.DELETE("/chat/:chat_id", func(context *gin.Context) { deleteChat(context, db) })
    router.GET("/user/chats", func(context *gin.Context) { getAllChatsForUser(context, db) })
}

func createChat(context *gin.Context, db *gorm.DB) {
    // session := sessions.Default(context)
    // userID := session.Get("userID")
    // if userID == nil {
    //     context.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
    //     return
    // }

    var chat models.Chat
    if err := context.ShouldBindJSON(&chat); err != nil {
        log.Printf("Invalid input: %v", err)
        context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    // chat.UserID = userID.(uint)
	chat.UserID = 1
    if err := database.AddChat(db, &chat); err != nil {
        log.Printf("Failed to create chat: %v", err)
        context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create chat"})
        return
    }

    log.Printf("Chat created with ID %d", chat.ID)
    chatItemHTML := `<li data-chat-id="` + strconv.Itoa(int(chat.ID)) + `">Chat ` + strconv.Itoa(int(chat.ID)) + `</li>`
    context.Header("Content-Type", "text/html")
    context.String(http.StatusOK, chatItemHTML)
}

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

    var chatHistoryHTML string
    for _, message := range chat.Messages {
        chatHistoryHTML += `<div>` + message.Message + `</div>`
    }

    context.Header("Content-Type", "text/html")
    context.String(http.StatusOK, chatHistoryHTML)
}

func getAllChatsForUser(context *gin.Context, db *gorm.DB) {
    // session := sessions.Default(context)
    // userID := session.Get("userID")
    // if userID == nil {
    //     context.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
    //     return
    // }

	userID := 1

    chats, err := database.GetAllChatsForUser(db, uint(userID))
    if err != nil {
		log.Printf("Failed to retrieve chats for user %d: %v", userID, err)
        context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve chats"})
        return
    }

    var chatListHTML string
    for _, chat := range chats {
        chatListHTML += `<li data-chat-id="` + strconv.Itoa(int(chat.ID)) + `">Chat ` + strconv.Itoa(int(chat.ID)) + `</li>`
    }

    context.Header("Content-Type", "text/html")
    context.String(http.StatusOK, chatListHTML)
}

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