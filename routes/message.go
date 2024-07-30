package routes

import (
	"net/http"
	"strconv"

	"gochat/database"
	"gochat/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AddMessageRoutes(router *gin.Engine, db *gorm.DB) {
    router.POST("/chat/:chat_id/message", func(context *gin.Context) { sendMessage(context, db) })
    // router.PUT("/chat/:chat_id/message/:message_id", func(context *gin.Context) { editMessage(context, db) })
}

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
    message.UserID = 1 // Hardcoding userID for testing
    if err := database.AddMessage(db, uint(chatID), &message); err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Hardcoded AI response with Go code
    aiResponse := models.Message{
        ChatID:  uint(chatID),
        UserID:  2, // Assuming AI has userID 2
        Message: "```go\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, world!\")\n}\n```",
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

    var chatHistoryHTML string
    for _, message := range chat.Messages {
        chatHistoryHTML += `<div>` + message.Message + `</div>`
    }

    context.Header("Content-Type", "text/html")
    context.String(http.StatusOK, chatHistoryHTML)
}

// func editMessage(context *gin.Context, db *gorm.DB) {
//     messageID, err := strconv.Atoi(context.Param("message_id"))
//     if err != nil {
//         context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid message ID"})
//         return
//     }

//     chatID, err := strconv.Atoi(context.Param("chat_id"))
//     if err != nil {
//         context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid chat ID"})
//         return
//     }

//     newMessage, err := bindMessage(context)
//     if err != nil {
//         context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
//         return
//     }

//     if err := database.UpdateMessage(db, uint(chatID), uint(messageID), newMessage.Message); err != nil {
//         context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
//         return
//     }

//     context.JSON(http.StatusOK, gin.H{
//         "status":     "message edited",
//         "messageID":  messageID,
//         "newMessage": newMessage.Message,
//     })
// }

// func bindMessage(context *gin.Context) (models.Message, error) {
//     var message models.Message
//     err := context.BindJSON(&message)
//     return message, err
// }