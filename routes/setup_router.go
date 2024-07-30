package routes

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB) *gin.Engine {
    router := gin.Default()

    // Set up session middleware
    store := cookie.NewStore([]byte("super-secret-key"))
    store.Options(sessions.Options{
        HttpOnly: true,
        Secure:   false, // Set to true if using HTTPS
        MaxAge:   3600,  // 1 hour
    })
    router.Use(sessions.Sessions("mysession", store))

    AddUserRoutes(router, db)
    AddChatRoutes(router, db)
    AddMessageRoutes(router, db)

    return router
}