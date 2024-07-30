package database

import (
	"errors"

	"gochat/models"

	"gorm.io/gorm"
)

/*
RegisterUser registers a new user in the database.

Takes a pointer to a User struct with the user information.
Checks if the user already exists, hashes the password, and saves the user to the database.
Returns an error if the user already exists or if there is an error saving the user.
*/
func RegisterUser(db *gorm.DB, user *models.User) error {
	var existingUser models.User
	if err := db.Where("username = ?", user.Username).First(&existingUser).Error; err == nil {
		return errors.New("user already exists")
	}

	// Hash the password before saving (simplified for demonstration)
	// In a real application, use a proper hashing algorithm like bcrypt
	user.Password = hashPassword(user.Password)

	if err := db.Create(user).Error; err != nil {
		return errors.New("failed to register user")
	}

	return nil
}

/*
LoginUser verifies user credentials for login.

Takes a pointer to a User struct with the user information.
Checks if the user exists, then compares the password.
Returns an error if the user does not exist or if the password is incorrect.
*/
func LoginUser(db *gorm.DB, user *models.User) error {
	var existingUser models.User
	if err := db.Where("username = ?", user.Username).First(&existingUser).Error; err != nil {
		return errors.New("invalid credentials")
	}

	// Check the password (simplified for demonstration)
	// In a real application, use a proper hashing algorithm like bcrypt
	if !checkPassword(user.Password, existingUser.Password) {
		return errors.New("invalid credentials")
	}

	return nil
}

/*
GetUserByID retrieves a user by ID from the database.

Takes a user ID and returns the user information.
Returns an error if the user does not exist.
*/
func hashPassword(password string) string {
	// Use a proper hashing algorithm like bcrypt in a real application
	return password + "hashed"
}

/*
checkPassword compares a plain text password with a hashed password.

Takes a plain text password and a hashed password and returns true if they match.
*/
func checkPassword(password, hashedPassword string) bool {
	// Use a proper hashing algorithm like bcrypt in a real application
	return hashPassword(password) == hashedPassword
}