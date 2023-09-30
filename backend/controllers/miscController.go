package controllers

import (
	"backend/initializers"
	"backend/models"
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func FetchColleagues(c *gin.Context) {
	user, _ := getUserFromContext(c)

	// fetch all users with the same org_domain as the logged in user (also includes logged in user) exclude deleted users
	var collegues []models.User
	result := initializers.DB.Where("org_domain = ? AND deleted_at IS NULL", user.OrgDomain).Find(&collegues)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching collegues"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": collegues})
}

func FetchGroupInfo(c *gin.Context) {
	user, _ := getUserFromContext(c)

	var group struct {
		OrgDomain string `json:"org_domain"`
		Count	 int    `json:"count"`
	}

	// fetch the domain name and count of users with the same domain name as the logged in user
	result := initializers.DB.Table("users").Select("org_domain, count(*)").Where("org_domain = ? AND deleted_at IS NULL", user.OrgDomain).Group("org_domain").Scan(&group)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching group info"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": group})
	
}

// DeleteMe deletes the logged in user after checking if the user has logged in. 
// if the user owns a project with no tasks, then the project is deleted
// if the user owns a project with tasks, the mail id of the assigned user of some task inside the project becomes the new project owner
// if the user is the only assigned user of the tasks, then the project is deleted
// if the user belongs to any assigned tasks, the mail id is removed from those tasks

func DeleteMe(c *gin.Context){
	user, _ := getUserFromContext(c)

	// fetch all projects owned by the user
	var projects []models.Project
	result := initializers.DB.Where("owning_user_id = ?", user.ID).Find(&projects)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching projects"})
		return
	}

	// loop through all projects owned by the user
	for _, project := range projects {

		// fetch all tasks inside a project
		var tasks []models.Task
		result := initializers.DB.Where("project_id = ?", project.ID).Find(&tasks)
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching tasks"})
			return
		}

		fmt.Println("length of tasks")
		fmt.Println(len(tasks));

		fmt.Println("project id")
		fmt.Println(project.ID);

		// if the project has no tasks, delete the project
		if len(tasks) == 0 {
			fmt.Println("project has no tasks")
			result := initializers.DB.Delete(&project)
			if result.Error != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Error deleting the empty project"})
				return
			}
		
		// if the project has tasks
		} else {
				selectedmail := ""

				// loop through all tasks inside a project
				for _, task := range tasks {
					fmt.Println("task id")
					fmt.Println(task.ID);
					// loop through all assigned users of a task
					for _, assigneduser := range task.AssignedUsers {
						fmt.Println(assigneduser.ID);
						fmt.Println("assigned user mail = " + assigneduser.Email);
						// select a mail id that is not the logged in user
						if assigneduser.Email != user.Email {
							selectedmail = assigneduser.Email
							break
						}
					}

					//Exit the outer loop if a non-matching email is found
					if selectedmail != "" {
						break
					}
				}	
				
				fmt.Println("selected mail = " + selectedmail);

				// if the selected mail id is empty, it means that the logged in user is the only user assigned to the task, so delete the project
				if selectedmail == "" {
					
					//delete the project
					result := initializers.DB.Delete(&project)
					if result.Error != nil {
						c.JSON(http.StatusInternalServerError, gin.H{"message": "Error deleting the project that has only the logged in user assigned to all tasks"})
						return
					}

					//hard delete the tasks inside the project
					result = initializers.DB.Where("project_id = ?", project.ID).Unscoped().Delete(&tasks)
					if result.Error != nil {
						c.JSON(http.StatusInternalServerError, gin.H{"message": "Error deleting tasks for project that has only the logged in user assigned to all tasks"})
						return
					}

				} else {

					fmt.Println("selected mail is not empty. inside new user selection")
					// if the selected mail id is not empty, it means that the logged in user is not the only user assigned to the task, so make the selected mail id the owner of the project
					
					result := initializers.DB.Model(&project).Update("owning_user_id", selectedmail)
					if result.Error != nil {
						c.JSON(http.StatusInternalServerError, gin.H{"message": "Error updating project"})
						return
					}

				}
			}	
	}

	// loop through all tasks from database and remove the logged in user from the assigned users of all tasks
	var tasks []models.Task
	result = initializers.DB.Find(&tasks)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching tasks"})
		return
	}
	for _, task := range tasks {
		result := initializers.DB.Model(&task).Association("AssignedUsers").Delete(&user)
		if result != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Error deleting user from task"})
			return
		}
	}

	// delete the user
	result = initializers.DB.Delete(&user)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error deleting user"})
		return
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", "", -1, "", "", false, true) // setting max age to -1, so the cookie gets deleted automatically

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// getUserFromContext is a helper function to get the logged in user from the context
func getUserFromContext(c *gin.Context) (*models.User, error) {
	userInterface, _ := c.Get("user")
	user, ok := userInterface.(*models.User)

	if !ok {
		return nil, errors.New("user not found in context")
	}
	
	return user, nil
}