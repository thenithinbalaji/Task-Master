import React from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-hot-toast";
import { addTask, fetchProject, validate, fetchUsers } from "./../../utils/apiUtils";
import { useNavigate, useParams } from "react-router-dom";
import UserSVG from "./../../assets/user.svg";
import Loading from "./../../components/loadingState";

export default function AddTask() {
    const { pid } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = React.useState(true);
    const [projectData, setProjectData] = React.useState(null);
    const [loggedInUserID, setLoggedInUserID] = React.useState(null);
    const [fetchedusers, setFetchedUsers] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            try {
                const [response, status] = await fetchProject(pid);
                console.log("(add task page useEffect to fetch project)", status, response);

                if (status === 200) {
                    setProjectData(response.message);
                }

                else {
                    toast.error("Project you are trying to fetch does not exist");
                    navigate("/projects");
                }
            }

            catch (error) {
                console.log("(add task page useEffect to fetch project) error", error);
                toast.error(error);
                toast.error("Error loading project details");
            }
        })(); // eslint-disable-next-line
    }, [pid]);

    React.useEffect(() => {
        (async () => {
            const [response, status] = await validate();
            console.log("(add task page useEffect to validate)", status, response);

            setLoggedInUserID(response.message.ID);
        })(); // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        (async () => {
            if (projectData && loggedInUserID) {
                console.log("(add tasks page useEffect to check admin) projectData", loggedInUserID, projectData.OwningUserID);
                if (loggedInUserID === projectData.OwningUserID) {
                    setLoading(false);
                }

                else {
                    toast.error("You are not authorized to add tasks to this project");
                    navigate("/projects");
                }

            }
        })(); // eslint-disable-next-line
    }, [projectData, loggedInUserID]);

    React.useEffect(() => {
        (async () => {
            try {
                const [response, status] = await fetchUsers();
                console.log("(add task page useEffect to fetch users)", status, response);

                if (status === 200) {
                    setFetchedUsers(response.message);
                }
            }

            catch (error) {
                console.log("(add task page useEffect to fetch users) error", error);
                toast.error(error);
                toast.error("Error loading users");
            }
        })(); // eslint-disable-next-line
    }, []);

    const [form, setForm] = React.useState({
        name: "",
        description: "",
        priority: "",
        assignedusers: [],
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("(add task page form submit)", pid, form.name, form.description, form.priority, form.assignedusers);


        if (form.name.length > 15) {
            toast.error("Name must be less than 15 characters");
            return;
        }

        if (form.name.length < 3) {
            toast.error("Name must be more than 3 characters");
            return;
        }

        if (form.description.length > 50) {
            toast.error("Description must be less than 50 characters");
            return;
        }

        if (form.description.length < 3) {
            toast.error("Description must be more than 3 characters");
            return;
        }

        if (form.priority < 1) {
            toast.error("Priority must be more than zero");
            return;
        }

        if (form.assignedusers.length < 1) {
            toast.error("Must assign at least one user");
            return;
        }

        try {
            console.log("(add task page form submit)", pid, form.name, form.description, form.priority, form.assignedusers);

            const [response, status] = await addTask(pid, form.name, form.description, form.priority, form.assignedusers);
            console.log("(add task page form submit)", status, response);
            if (status === 200) {
                toast.success("Task created successfully");
                navigate(`/projects/${pid}`);

            } else {
                toast.error(response.message);
            }

        } catch (error) {
            console.log("(add task page form submit)", error);
            toast.error(error.message);
        }

    };

    return (loading ? <Loading /> :
        <div className="h-screen w-full p-14">
            <p className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-600 md:text-5xl lg:text-4xl">
                Add New Task to Project {pid}
            </p>

            <form className="mt-14 w-full" onSubmit={handleSubmit}>
                <input type="text" placeholder="Task Name"
                    className="border-2 border-gray-300 rounded-md h-10 px-2 w-full my-2"
                    value={form.name} onChange={handleChange} name="name" required />

                <input type="text" placeholder="Task Description"
                    className="border-2 border-gray-300 rounded-md h-10 px-2 w-full my-2"
                    value={form.description} onChange={handleChange} name="description" required />

                <input type="number" placeholder="Priority"
                    className="border-2 border-gray-300 rounded-md h-10 px-2 w-full sm:w-fit my-2"
                    value={form.priority} onChange={handleChange} name="priority" required min={1} />
                <br />

                <div className="w-full">
                    <p className="text-gray-500 text-sm">Users Assigned to the Task</p>
                    <div className="flex flex-wrap">

                        {form.assignedusers.map((email) => (
                            <div key={email} className="bg-gray-200 rounded-full px-2 py-1 m-1">
                                <img src={UserSVG} alt="group" className="w-5 h-5 mx-1 hidden sm:inline-block" />
                                {email}
                            </div>
                        ))}
                    </div>
                </div>

                <select className="border-2 border-gray-300 rounded-md h-10 px-2 w-full my-2 text-gray-500"
                    onChange={
                        (e) => {
                            if (form.assignedusers.includes(e.target.value)) {
                                setForm({ ...form, assignedusers: form.assignedusers.filter((email) => email !== e.target.value) });
                            }

                            else {
                                setForm({ ...form, assignedusers: [...form.assignedusers, e.target.value] });
                            }

                            //reset the select value to default
                            e.target.value = "";
                        }
                    }>

                    <option value="" disabled selected>Assign/Remove Users</option>
                    {fetchedusers.map((user) => (
                        <option key={user.ID} value={user.Email}>
                            {user.Name} - {user.Email}
                        </option>
                    ))}
                </select>

                <div className="my-3">
                    <NavLink to={`/projects/${pid}`} className="my-3 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 sm:px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                        Cancel
                    </NavLink>

                    <button type="submit" className="my-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 sm:px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Submit
                    </button>
                </div>

            </form>


        </div >
    )
}