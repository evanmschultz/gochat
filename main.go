package main

import (
	"gochat/database"
	"gochat/routes"

	"github.com/gin-gonic/gin"
)

/*
main is the entry point for the application.

It initializes the database connection, sets up the Gin router, and starts the server on port 8080.
*/
func main() {
    db := database.InitDB("test.db")

    router := routes.SetupRouter(db)

    // Load HTML templates
    router.LoadHTMLGlob("frontend/templates/**/*")

    // Serve static files
    router.Static("/static", "./frontend/static")

    // Serve index.html as the main entry point
    router.GET("/", func(c *gin.Context) {
        c.HTML(200, "pages/index.html", gin.H{
            "title": "GoChat",
        })
    })

    // Start the server on port 8080
    router.Run(":8080")
}