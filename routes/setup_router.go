package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

/*
SetupRouter sets up the routes for the application.

Takes a pointer to a gorm.DB instance initialize default gin.Engine, sets routes in gin.Engine 
returns a pointer to a gin.Engine instance.
*/
func SetupRouter(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	AddUserRoutes(r, db)
	AddChatRoutes(r, db)
	AddMessageRoutes(r, db)

	return r
}