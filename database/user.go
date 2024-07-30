package database

import (
	"errors"

	"gochat/models"

	"gorm.io/gorm"
)

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

func hashPassword(password string) string {
	return password + "hashed"
}

func checkPassword(password, hashedPassword string) bool {
	return hashPassword(password) == hashedPassword
}