package main

import (
	"backend/controllers"
	"backend/initializers"
	"backend/middleware"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init(){
	initializers.LoadEnvVariables()	// Load the environment variables
	initializers.ConnecttoDB()		// Connect to the database
	initializers.SyncDatabase()		// Sync the models to the database
}

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE"},
		AllowHeaders:     []string{"Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost:3000"
		},
		MaxAge: 12 * time.Hour,
	}))

	// Define a middleware for routes that require authentication
	authMiddleware := middleware.RequireAuth

	// Routes without authentication
	// User routes
	userRoutes := r.Group("")
	{
		userRoutes.POST("/signup", controllers.SignUp)
		userRoutes.POST("/login", controllers.Login)
	}

	// Routes with authentication
	authenticatedRoutes := r.Group("")
	authenticatedRoutes.Use(authMiddleware)
	{
		// User routes
		authenticatedRoutes.GET("/validate", controllers.Validate)
		authenticatedRoutes.POST("/logout", controllers.Logout)
		authenticatedRoutes.POST("/deleteme", controllers.DeleteMe)

		// Project routes
		projectRoutes := authenticatedRoutes.Group("/projects")
		{
			projectRoutes.GET("", controllers.FetchProjects)
			projectRoutes.GET("/:pid", controllers.FetchProject)
			projectRoutes.PATCH("/:pid", controllers.UpdateProject)
			projectRoutes.POST("", controllers.CreateProject)
			projectRoutes.DELETE("/:pid", controllers.DeleteProject)

			// Task routes
			taskRoutes := projectRoutes.Group("/:pid/tasks")
			{
				taskRoutes.GET("", controllers.FetchTasks)
				taskRoutes.POST("", controllers.CreateTask)
				taskRoutes.GET("/:tid", controllers.FetchTask)
				taskRoutes.PATCH("/:tid", controllers.UpdateTask)
				taskRoutes.DELETE("/:tid", controllers.DeleteTask)
				taskRoutes.PATCH("/:tid/complete", controllers.CompleteTask)
				taskRoutes.PATCH("/:tid/uncomplete", controllers.UncompleteTask)
				taskRoutes.POST("/csv", controllers.CSVUploadTasks)
				taskRoutes.GET("/csv", controllers.CSVDownloadTasks)
			}
		}

		// Information routes
		authenticatedRoutes.GET("/users", controllers.FetchColleagues)
		authenticatedRoutes.GET("/groupinfo", controllers.FetchGroupInfo)
	}

	// Run the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	r.Run(":" + port)
}
