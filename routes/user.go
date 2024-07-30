package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"gochat/models"
	"gochat/database"
)

// AddUserRoutes sets up the routes for user registration and login
func AddUserRoutes(r *gin.Engine, db *gorm.DB) {
	r.POST("/user/register", func(c *gin.Context) { registerUser(c, db) })
	r.POST("/user/login", func(c *gin.Context) { loginUser(c, db) })
}

/*
registerUser handles user registration.

Takes a JSON object with a username and password and binds it to a User struct, then saves it to the database.
Returns a status message: "registered" if successful, "Invalid input" if input is invalid, "User already exists" if username is taken, or "Failed to register user" if there is an error.

Example request body:
{
	"username": "testuser",
	"password": "password"
}
*/
func registerUser(c *gin.Context, db *gorm.DB) {
	var user models.User
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := database.RegisterUser(db, &user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "registered"})
}

/*
loginUser handles user login.

Takes a JSON object with a username and password and binds it to a User struct, then verifies the user credentials.
Returns a status message: "logged in" if successful, "Invalid input" if input is invalid, "Invalid credentials" if the username or password is incorrect.

Example request body:
{
	"username": "testuser",
	"password": "password"
}
*/
func loginUser(c *gin.Context, db *gorm.DB) {
	var user models.User
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := database.LoginUser(db, &user); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "logged in"})
}