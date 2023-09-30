package controllers

import (
	"backend/initializers"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)


func FetchProjects(c *gin.Context){

	var projects []models.Project

	// fetch all projects that match the user's org domain
	user, _ := getUserFromContext(c)
	result := initializers.DB.Where("org_domain = ?", user.OrgDomain).Preload("OwningUser").Find(&projects)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching projects"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": projects})
}

func CreateProject(c *gin.Context){

	var body struct {
		Name string `json:"name" binding:"required"`
		Description string `json:"description" binding:"required"`
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid body"})
		return
	}

	user, _ := getUserFromContext(c)
	project := models.Project{Name: body.Name, Description: body.Description, OwningUserID: user.ID, OrgDomain: user.OrgDomain}

	if err := initializers.DB.Create(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error creating project"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project created successfully"})

}

func DeleteProject(c *gin.Context){

	var project models.Project
	projectID := c.Param("pid")
	user, _ := getUserFromContext(c)
	result := initializers.DB.Where("id = ?", projectID).First(&project)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching project"})
		return
	}

	// only the owner of the project can delete it
	if project.OwningUserID != user.ID {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	if err := initializers.DB.Delete(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error deleting project"})
		return
	}

	// delete all tasks associated with the project
	if err := initializers.DB.Where("project_id = ?", projectID).Unscoped().Delete(&models.Task{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error deleting tasks associated with project"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project deleted successfully"})
}

func FetchProject(c *gin.Context){
	
	var project models.Project

	projectID := c.Param("pid")
	user, _ := getUserFromContext(c)
	result := initializers.DB.Where("id = ? AND org_domain = ?", projectID, user.OrgDomain).Preload("OwningUser").Preload("Tasks").Preload("Tasks.AssignedUsers").First(&project)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching project"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": project})
}

func UpdateProject(c *gin.Context){

	var project models.Project

	projectID := c.Param("pid")
	user, _ := getUserFromContext(c)
	result := initializers.DB.Where("id = ? AND org_domain = ?", projectID, user.OrgDomain).First(&project)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching project"})
		return
	}

	// only the owner of the project can update it
	if project.OwningUserID != user.ID {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var body struct {
		Name string `json:"name" binding:"required"`
		Description string `json:"description" binding:"required"`
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid body"})
		return
	}

	project.Name = body.Name
	project.Description = body.Description

	if err := initializers.DB.Save(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error updating project"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project updated successfully"})
}