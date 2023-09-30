package initializers

import (
	"backend/models"
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// ConnecttoDB opens a connection to the postgres database.
func ConnecttoDB() {

	var err error

	// connect to postgres db
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"), os.Getenv("DB_PORT"))

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect database")
		log.Fatal(err)
	}
}

// SyncDatabase creates the tables in the database.
func SyncDatabase() {
	DB.AutoMigrate(&models.User{}, &models.Project{}, &models.Task{})
}