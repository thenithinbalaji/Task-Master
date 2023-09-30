package initializers

import (
	"log"

	"github.com/joho/godotenv"
)

// LoadEnvVariables loads the environment variables from the .env file.
func LoadEnvVariables() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error loading .env file. \nCreate .env file in root directory. \nCheck the backend README for more information.")
	}

}