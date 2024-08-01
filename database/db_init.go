package database

import (
	"log"
	"os"

	"gochat/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

/*
InitDB initializes the database connection and sets up the schema.

If the database file does not exist, it creates the file and sets up the schema.
If the database file exists, it connects to the existing database and sets up the schema.

- Args:
	* `dbFileName` (string) The name of the database file.

- Returns:
	(*gorm.DB) The database connection.
*/
func InitDB(dbFileName string) *gorm.DB {
	var db *gorm.DB

	if _, err := os.Stat(dbFileName); os.IsNotExist(err) {
		db, err = gorm.Open(sqlite.Open(dbFileName), &gorm.Config{})
		if err != nil {
			log.Fatalf("Failed to connect to database: %v", err)
		}

		// Auto migrate the schema
		db.AutoMigrate(&models.User{}, &models.Chat{}, &models.Message{})

		// Create default user
		defaultUser := models.User{
			Username: "default_user",
			Password: "password123", // In a real application, make sure to hash the password
		}
		db.Create(&defaultUser)
	} else {
		db, err = gorm.Open(sqlite.Open(dbFileName), &gorm.Config{})
		if err != nil {
			log.Fatalf("Failed to connect to database: %v", err)
		}

		// Auto migrate the schema
		db.AutoMigrate(&models.User{}, &models.Chat{}, &models.Message{})
	}

	return db
}