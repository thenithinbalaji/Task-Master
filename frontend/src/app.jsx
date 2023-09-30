import React from "react";
import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider, Navigate } from "react-router-dom";

import Home from "./pages/home";

// Auth
import Login from "./pages/login";
import SignUp from "./pages/signUp";

// Misc
import Group from "./pages/group";
import Settings from "./pages/settings";
import Mentions from "./pages/mentions";

// Projects
import ListProjects from "./pages/projects/listProjects";
import AddProject from "./pages/projects/addProject";
import EditProject from "./pages/projects/editProject";

// Tasks
import ListTasks from "./pages/tasks/listTasks";
import AddTask from "./pages/tasks/addTask";
import EditTask from "./pages/tasks/editTask";

// Layout
import MainLayout from "./layouts/mainLayout";

const BrowserRouter = createBrowserRouter(
    createRoutesFromElements(
        <Route>

            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route element={<MainLayout />}>
                <Route path="/mentions" element={<Mentions />} />

                <Route path="/projects" element={<ListProjects />} />
                <Route path="/addproject" element={<AddProject />} />
                <Route path="/editproject/:pid" element={<EditProject />} />
                <Route path="/projects/:pid" element={<ListTasks />} />

                <Route path="/addtask/:pid" element={<AddTask />} />
                <Route path="/edittask/:pid/:tid" element={<EditTask />} />

                <Route path="/group" element={<Group />} />
                <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Route>


    )
)

export default function App() {
    return (
        <RouterProvider router={BrowserRouter} />
    )
}
