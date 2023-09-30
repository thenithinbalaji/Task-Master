package controllers

import (
	"backend/initializers"
	"backend/models"
	"encoding/csv"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func FetchTasks(c *gin.Context) {

	var project models.Project

	projectID := c.Param("pid")
	user, _ := getUserFromContext(c)
	result := initializers.DB.Where("id = ? AND org_domain = ?", projectID, user.OrgDomain).Preload("OwningUser").First(&project)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching project"})
		return
	}

	var task []models.Task
	result = initializers.DB.Where("project_id = ?", projectID).Preload("Project").Find(&task)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching tasks"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": task})
}

func CreateTask(c *gin.Context) {

	user, _ := getUserFromContext(c)
	projectID := c.Param("pid")

	var project models.Project
	result := initializers.DB.Where("id = ? AND org_domain = ?", projectID, user.OrgDomain).Preload("OwningUser").First(&project)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching project"})
		return
	}

	// only the owner of the project can create tasks
	if project.OwningUserID != user.ID {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var body struct {
		Name string `json:"name" binding:"required"`
		Description string `json:"description" binding:"required"`
		Priority int `json:"priority" binding:"required"`
		AssignedUsers []string `json:"assigned_users" binding:"required"`
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid body"})
		return
	}

	task := models.Task{Name: body.Name, Description: body.Description, ProjectID: project.ID, Priority: body.Priority, Completed: false}

	result = initializers.DB.Create(&task)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error creating task"})
		return
	}

	for _, email := range body.AssignedUsers {
		var user models.User
		result := initializers.DB.Where("email = ?", email).Find(&user)
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching user"})
			return
		}
		if user.OrgDomain != project.OrgDomain {
			c.JSON(http.StatusBadRequest, gin.H{"message": "User does not belong to the same org"})
			return
		}
		assigning := initializers.DB.Model(&task).Association("AssignedUsers").Append(&user)
		if assigning != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Error assigning user"})
			return
		}
	}

}

func UpdateTask(c *gin.Context) {

	user, _ := getUserFromContext(c)
	projectID := c.Param("pid")
	taskID := c.Param("tid")

	var project models.Project
	result := initializers.DB.Where("id = ? AND org_domain = ?", projectID, user.OrgDomain).Preload("OwningUser").First(&project)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching project"})
		return
	}

	if project.OwningUserID != user.ID {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var task models.Task
	result = initializers.DB.Where("id = ?", taskID).Preload("AssignedUsers").First(&task)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching task"})
		return
	}

	var body struct {
		Name string `json:"name" binding:"required"`
		Description string `json:"description" binding:"required"`
		Priority int `json:"priority" binding:"required"`
		AssignedUsers []string `json:"assigned_users" binding:"required"`
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid body"})
		return
	}

	task.Name = body.Name
	task.Description = body.Description
	task.Priority = body.Priority

	result = initializers.DB.Save(&task)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error updating task"})
		return
	}

	//remove all assigned users
	assigned := initializers.DB.Model(&task).Association("AssignedUsers").Clear()
	if assigned != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error updating task"})
		return
	}

	//add new assigned users
	for _, email := range body.AssignedUsers {
		var user models.User
		result := initializers.DB.Where("email = ?", email).Find(&user)
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching user"})
			return
		}
		if user.OrgDomain != project.OrgDomain {
			c.JSON(http.StatusBadRequest, gin.H{"message": "User does not belong to the same org"})
			return
		}
		assigning := initializers.DB.Model(&task).Association("AssignedUsers").Append(&user)
		if assigning != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Error assigning user"})
			return
		}
	}

}

func DeleteTask(c *gin.Context) {

	user, _ := getUserFromContext(c)
	projectID := c.Param("pid")
	taskID := c.Param("tid")

	var project models.Project
	result := initializers.DB.Where("id = ? AND org_domain = ?", projectID, user.OrgDomain).Preload("OwningUser").First(&project)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching project"})
		return
	}

	if project.OwningUserID != user.ID {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var task models.Task
	result = initializers.DB.Where("id = ?", taskID).First(&task)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching task"})
		return
	}

	result = initializers.DB.Unscoped().Delete(&task)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error deleting task"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}

func CompleteTask(c *gin.Context) {

	user, _ := getUserFromContext(c)
	projectID := c.Param("pid")
	taskID := c.Param("tid")

	var project models.Project
	result := initializers.DB.Where("id = ? AND org_domain = ?", projectID, user.OrgDomain).Preload("OwningUser").First(&project)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching project"})
		return
	}

	if project.OwningUserID != user.ID {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var task models.Task
	result = initializers.DB.Where("id = ?", taskID).First(&task)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching task"})
		return
	}

	task.Completed = true

	result = initializers.DB.Save(&task)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error updating task"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task completed successfully"})
}

func UncompleteTask(c *gin.Context) {

	user, _ := getUserFromContext(c)
	projectID := c.Param("pid")
	taskID := c.Param("tid")

	var project models.Project
	result := initializers.DB.Where("id = ? AND org_domain = ?", projectID, user.OrgDomain).Preload("OwningUser").First(&project)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching project"})
		return
	}

	if project.OwningUserID != user.ID {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var task models.Task
	result = initializers.DB.Where("id = ?", taskID).First(&task)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching task"})
		return
	}

	task.Completed = false

	result = initializers.DB.Save(&task)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error updating task"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task uncompleted successfully"})
}

func FetchTask(c *gin.Context){

	user, _ := getUserFromContext(c)
	projectID := c.Param("pid")
	taskID := c.Param("tid")

	var project models.Project
	result := initializers.DB.Where("id = ? AND org_domain = ?", projectID, user.OrgDomain).Preload("OwningUser").First(&project)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching project"})
		return
	}

	var task models.Task
	result = initializers.DB.Where("id = ? AND project_id = ?", taskID, projectID).Preload("AssignedUsers").First(&task)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching task"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": task})
}

func CSVUploadTasks(c *gin.Context){
	
	user, _ := getUserFromContext(c)	
	projectID := c.Param("pid")

	var project models.Project
	result := initializers.DB.Where("id = ? AND org_domain = ?", projectID, user.OrgDomain).Preload("OwningUser").First(&project)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching project"})
		return
	}

	if project.OwningUserID != user.ID {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	if file.Header["Content-Type"][0] != "text/csv" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid file type"})
		return
	}

	csvFile, err := file.Open()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	defer csvFile.Close()

	//parse csv file
    reader := csv.NewReader(csvFile)
    records, err := reader.ReadAll()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"message": "Error parsing CSV"})
        return
    }

	//create tasks
	for i, record := range records {
		if i == 0 {continue} 

		if len(record) < 4 {
            c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid CSV format"})
            return
        }
		
		priority, err := strconv.Atoi(record[2])

        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
            return
        }

		task := models.Task{Name: record[0], Description: record[1], ProjectID: project.ID, Priority: priority, Completed: false}
		result = initializers.DB.Create(&task)
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Error creating task"})
			return
		}
		
		emails := strings.Split(record[3], ",")
		for _, email := range emails {
			email = strings.TrimSpace(email)
			var user models.User
			result := initializers.DB.Where("email = ?", email).Find(&user)
			if result.Error != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching user"})
				return
			}
			if user.OrgDomain != project.OrgDomain {
				c.JSON(http.StatusBadRequest, gin.H{"message": "User does not belong to the same org"})
				return
			}
			assigning := initializers.DB.Model(&task).Association("AssignedUsers").Append(&user)
			if assigning != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Error assigning user"})
				return
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tasks created successfully"})
	
}

func CSVDownloadTasks(c *gin.Context) {
	// Get the user from the context
	user, _ := getUserFromContext(c)
	projectID := c.Param("pid")

	// Retrieve the project
	var project models.Project
	result := initializers.DB.Where("id = ? AND org_domain = ?", projectID, user.OrgDomain).Preload("OwningUser").First(&project)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching project"})
		return
	}

	// Retrieve tasks for the project
	var tasks []models.Task
	result = initializers.DB.Where("project_id = ?", projectID).Preload("AssignedUsers").Find(&tasks)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching tasks"})
		return
	}

	// Prepare the CSV data
	csvData := [][]string{{"Name", "Description", "Priority", "Assigned Users"}}
	for _, task := range tasks {
		var assignedUsers []string
		for _, user := range task.AssignedUsers {
			assignedUsers = append(assignedUsers, user.Email)
		}
		csvData = append(csvData, []string{task.Name, task.Description, strconv.Itoa(task.Priority), strings.Join(assignedUsers, ", ")})
	}

	// Set response headers
	c.Header("Content-Type", "text/csv")
	c.Header("Content-Disposition", "attachment;filename=Tasks.csv")
	c.Writer.Write([]byte("\xEF\xBB\xBF"))

	// Create a CSV writer
	csvFile := csv.NewWriter(c.Writer)
	defer csvFile.Flush() // Ensure we flush and close the CSV writer

	// Write the CSV data
	if err := csvFile.WriteAll(csvData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error writing CSV data"})
		return
	}
}
