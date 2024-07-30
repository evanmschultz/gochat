package main

import (
	"gochat/database"
	"gochat/routes"
)

/*
main initializes the database connection and sets up the router.

Creates a connection to the database and initializes the router with the database connection.
Runs the router on port 8080.
*/
func main() {
	db := database.InitDB("test.db")

	r := routes.SetupRouter(db)
	r.Run(":8080")
}