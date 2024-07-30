package main

import (
	"gochat/database"
	"gochat/routes"

	"github.com/gin-gonic/gin"
)

func main() {
    db := database.InitDB("test.db")

    router := routes.SetupRouter(db)

    // Load HTML templates
    router.LoadHTMLGlob("frontend/templates/*")

    // Serve static files
    router.Static("/static", "./frontend/static")

    // Serve index.html as the main entry point
    router.GET("/", func(c *gin.Context) {
        c.File("./frontend/templates/index.html")
    })

    // Start the server on port 8080
    router.Run(":8080")
}