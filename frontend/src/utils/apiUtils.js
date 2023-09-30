export const BACKEND_URL = 'http://localhost:8080/';

// This function is used to make API calls to the backend
export const apiCall = async (method, endpoint, body = {}) => {
    var response

    console.log('apiCall', method, endpoint, body);

    if (method === 'GET')
        response = await fetch(`${BACKEND_URL}${endpoint}`, {
            method,
            credentials: 'include',
        }
        );

    else
        response = await fetch(`${BACKEND_URL}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            credentials: 'include',
        });


    try {
        const json = await response.json();
        console.log('apiCall response', response.status, json);
        return [json, response.status];
    } catch (error) {
        console.log('apiCall error', error);
        return [null, response.status];
    }

};

// This function is used to make API calls to the backend
export const csvapiCall = async (method, endpoint, file) => {
    var response;

    console.log('apiCall', method, endpoint, file);

    if (method === 'GET') {
        response = await fetch(`${BACKEND_URL}${endpoint}`, {
            method,
            credentials: 'include',
        });

        try {
            const json = await response.blob();
            console.log('apiCall response', response.status, json);
            return [json, response.status];
        } catch (error) {
            console.log('apiCall error', error);
            return [null, response.status];
        }
    } else {
        const formData = new FormData();
        formData.append('file', file);

        console.log('formData', formData);

        response = await fetch(`${BACKEND_URL}${endpoint}`, {
            method,
            body: formData,
            credentials: 'include',
        });

        try {
            const json = await response.json();
            console.log('apiCall response', response.status, json);
            return [json, response.status];
        } catch (error) {
            console.log('apiCall error', error);
            return [null, response.status];
        }
    }
};


// validate function
export const validate = () => {
    return apiCall('GET', 'validate');
};

// login function
export const login = (email, password) => {
    return apiCall('POST', 'login', { email: email, password: password });
};

// signup function
export const signup = (name, email, password) => {
    return apiCall('POST', 'signup', { name: name, email: email, password: password });
};

// logout function
export const logout = () => {
    return apiCall('POST', 'logout');
};

// group info function
export const groupInfo = () => {
    return apiCall('GET', 'groupinfo');
};

// delete my account function
export const deleteMe = () => {
    return apiCall('POST', 'deleteme');
};

// fetch projects function
export const fetchProjects = () => {
    return apiCall('GET', 'projects');
};

// fetch project function
export const fetchProject = (id) => {
    return apiCall('GET', `projects/${id}`);
};

// fetch users function
export const fetchUsers = () => {
    return apiCall('GET', 'users');
};

// add project function
export const addProject = (name, description) => {
    return apiCall('POST', 'projects', { name: name, description: description });
};

// delete project function
export const deleteProject = (id) => {
    return apiCall('DELETE', `projects/${id}`);
};

// update project function
export const updateProject = (id, name, description) => {
    return apiCall('PATCH', `projects/${id}`, { name: name, description: description });
};

// fetch tasks function
export const fetchTasks = (id) => {
    return apiCall('GET', `projects/${id}/tasks`);
};

// fetch task function
export const fetchTask = (pid, tid) => {
    return apiCall('GET', `projects/${pid}/tasks/${tid}`);
};

// add task function
export const addTask = (pid, name, description, priority, assignedusers) => {
    return apiCall('POST', `projects/${pid}/tasks`, { name: name, description: description, priority: parseInt(priority), assigned_users: assignedusers });
};

// update task function
export const updateTask = (pid, tid, name, description, priority, assignedusers) => {
    return apiCall('PATCH', `projects/${pid}/tasks/${tid}`, { name: name, description: description, priority: parseInt(priority), assigned_users: assignedusers });
};

// delete task function
export const deleteTask = (pid, tid) => {
    return apiCall('DELETE', `projects/${pid}/tasks/${tid}`);
};

// complete task function
export const completeTask = (pid, tid) => {
    return apiCall('PATCH', `projects/${pid}/tasks/${tid}/complete`);
}

// uncomplete task function
export const uncompleteTask = (pid, tid) => {
    return apiCall('PATCH', `projects/${pid}/tasks/${tid}/uncomplete`);
}

// upload task csv function
export const uploadTaskCSV = (pid, file) => {
    return csvapiCall('POST', `projects/${pid}/tasks/csv`, file);
}

// download task csv function
export const downloadTaskCSV = (pid) => {
    return csvapiCall('GET', `projects/${pid}/tasks/csv`);
}
