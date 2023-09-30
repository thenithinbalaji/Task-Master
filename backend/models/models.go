package models

import "gorm.io/gorm"

// 4 models: User, Project, Task, and the join table "user_tasks".

// The "user_tasks" table is automatically created by GORM.
// The "user_tasks" table is used to represent the many-to-many relationship between Users and Tasks.

// User represents the "users" table.
type User struct {
	gorm.Model
    Name       string
    Email      string `gorm:"unique"`
    OrgDomain  string 
    Password   string
    Projects   []Project `gorm:"foreignKey:OwningUserID"`
    AssignedTasks []Task `gorm:"many2many:user_tasks;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// Project represents the "projects" table.
type Project struct {
	gorm.Model
    OrgDomain   string
    Name        string
    Description string
    OwningUserID uint
    OwningUser  User `gorm:"foreignKey:OwningUserID"`
    Tasks       []Task
}

// Task represents the "tasks" table.
type Task struct {
	gorm.Model
    Name        string
    Description string
    ProjectID   uint
    Project     Project 
    Priority    int
    Completed   bool
    AssignedUsers []User `gorm:"many2many:user_tasks;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}