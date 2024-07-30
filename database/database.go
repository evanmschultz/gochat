package database

import (
	"log"

	"gochat/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

/*
InitDB initializes the database connection.

Takes a string dbFileName, the name of the database file to connect to.
Opens a connection to the database, auto migrates the schema, and returns the DB connection.
*/
func InitDB(dbFileName string) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(dbFileName), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto migrate the schema
	db.AutoMigrate(&models.User{}, &models.Chat{}, &models.Message{})

	return db
}