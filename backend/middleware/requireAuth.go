package middleware

import (
	"backend/initializers"
	"backend/models"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

// RequireAuth is a middleware function that checks if the user is authenticated.
// It checks if the user has a valid JWT cookie.
// If the user is authenticated, the user is set in the context.
// If the user is not authenticated, the request is aborted with a 401 status code.

func RequireAuth(c *gin.Context) {

	// Get the JWT string from the cookie.
	tokenString, err := c.Cookie("Authorization")
	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	// Parse the JWT string and store the result in `token`.
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	if !token.Valid {
		fmt.Println("Invalid JWT")
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	// Check if the token has expired.
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		// Get the user from the database.
		user, err := getUserByEmail(claims["email"].(string))
		if err != nil || user.ID == 0 {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		// Set the user in the context.
		c.Set("user", user)
	
	} else {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusUnauthorized)
	}

	c.Next()
}

// getUserByEmail is a helper function that returns the user with the given email.
func getUserByEmail(email string) (*models.User, error) {
	var user models.User
	err := initializers.DB.Preload("Projects").Preload("AssignedTasks").Preload("AssignedTasks.Project").Where("email = ?", email).First(&user).Error
	return &user, err
}
