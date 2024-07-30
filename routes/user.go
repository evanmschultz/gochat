package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AddUserRoutes(router *gin.Engine, db *gorm.DB) {
    // router.GET("/user/register", renderRegisterForm)
    // router.POST("/user/register", func(context *gin.Context) { registerUser(context, db) })
    // router.GET("/user/login", renderLoginForm)
    // router.POST("/user/login", func(context *gin.Context) { loginUser(context, db) })
}

// func renderRegisterForm(c *gin.Context) {
//     c.HTML(http.StatusOK, "register.html", nil)
// }

// func renderLoginForm(c *gin.Context) {
//     c.HTML(http.StatusOK, "login.html", nil)
// }

// func registerUser(context *gin.Context, db *gorm.DB) {
//     var user models.User
//     if err := context.ShouldBind(&user); err != nil {
//         context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
//         return
//     }

//     if err := database.RegisterUser(db, &user); err != nil {
//         context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
//         return
//     }

//     context.JSON(http.StatusOK, gin.H{"status": "registered"})
// }

// func loginUser(context *gin.Context, db *gorm.DB) {
//     var user models.User
//     if err := context.ShouldBind(&user); err != nil {
//         log.Printf("Invalid input: %v", err)
//         context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
//         return
//     }

//     log.Printf("Attempting login for user: %s", user.Username)
//     if err := database.LoginUser(db, &user); err != nil {
//         log.Printf("Invalid credentials for user %s: %v", user.Username, err)
//         context.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
//         return
//     }

//     session := sessions.Default(context)
//     session.Set("userID", user.ID)
//     session.Save()

//     log.Printf("User logged in: %+v", user)

//     context.JSON(http.StatusOK, gin.H{
//         "username": user.Username,
//         "userID":   user.ID,
//     })
// }