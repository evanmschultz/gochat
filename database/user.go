package database

import (
	"errors"

	"gochat/models"

	"gorm.io/gorm"
)

/*
AddChat adds a new chat to the database.

- Args:
	* `db` (*gorm.DB) The database connection.
	* `chat` (*models.Chat) The chat to add.

- Returns:
	(error) An error if the operation failed.
*/
func RegisterUser(db *gorm.DB, user *models.User) error {
	var existingUser models.User
	if err := db.Where("username = ?", user.Username).First(&existingUser).Error; err == nil {
		return errors.New("user already exists")
	}

	// Hash the password before saving (simplified for demonstration)
	user.Password = hashPassword(user.Password)

	if err := db.Create(user).Error; err != nil {
		return errors.New("failed to register user")
	}

	return nil
}

/*
LoginUser checks the user credentials and logs the user in.

- Args:
	* `db` (*gorm.DB) The database connection.
	* `user` (*models.User) The user to log in.

- Returns:
	(error) An error if the operation failed.
*/
func LoginUser(db *gorm.DB, user *models.User) error {
    var existingUser models.User
    if err := db.Where("username = ?", user.Username).First(&existingUser).Error; err != nil {
        return errors.New("invalid credentials")
    }

    if !checkPassword(user.Password, existingUser.Password) {
        return errors.New("invalid credentials")
    }

    user.ID = existingUser.ID
    user.Username = existingUser.Username

    return nil
}

/*
hashPassword hashes the given password.

This is a simplified implementation for demonstration purposes and will need to use a secure hashing algorithm in a 
real application.

- Args:
	* `password` (string) The password to hash.

- Returns:
	(string) The hashed password.
*/
func hashPassword(password string) string {
	return password + "hashed"
}

/*
checkPassword compares a password with a hashed password.

This is a simplified implementation for demonstration purposes and will need to use a secure hashing algorithm in a
real application.

- Args:
	* `password` (string) The password to check.
	* `hashedPassword` (string) The hashed password to compare against.

- Returns:
	(bool) True if the password matches the hashed password, false otherwise.
*/
func checkPassword(password, hashedPassword string) bool {
	return hashPassword(password) == hashedPassword
}