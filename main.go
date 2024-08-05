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
    router.LoadHTMLGlob("frontend/templates/**/*")

    // // Serve static files
    // router.Static("/static", "./frontend/static")

    // Serve static files
    router.Static("/static", "./frontend/static") // Serve CSS and other static files
    router.Static("/dist", "./frontend/dist")     // Serve JS files

    // Serve index.html as the main entry point
    router.GET("/", func(context *gin.Context) {
        context.HTML(200, "index", gin.H{
            "title": "GoChat",
        })
    })

    // Start the server on port 8080
    router.Run(":8080")
}