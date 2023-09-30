import React from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { fetchProject, validate, uploadTaskCSV, downloadTaskCSV } from "./../../utils/apiUtils";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loading from "./../../components/loadingState";
import TaskCard from "../../components/taskCard";

export default function ListTasks() {
    const navigate = useNavigate();
    const { pid } = useParams();

    const [adminview, setAdminView] = React.useState(false);
    const [projectData, setProjectData] = React.useState(null);
    const [loggedInUserID, setLoggedInUserID] = React.useState(null);
    const [tasks, setTasks] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const fileSave = async () => {
        try {
            const [response, status] = await downloadTaskCSV(pid);
            console.log("(list tasks page file save) status", status, response);

            if (status === 200) {
                // Create a Blob from the response data
                const blob = new Blob([response], { type: 'text/csv' });

                // Create a URL for the Blob
                const url = window.URL.createObjectURL(blob);

                // Create an <a> element to trigger the download
                const link = document.createElement("a");
                link.href = url;
                link.download = 'tasks.csv'; // Set the desired filename for the download
                link.style.display = 'none';

                // Append the link to the document and trigger the download
                document.body.appendChild(link);
                link.click();

                // Clean up by removing the created URL and link element
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            } else {
                toast.error("Error downloading tasks");
            }
        } catch (error) {
            console.log("(list tasks page file save) error", error);
            toast.error("Error downloading tasks");
        }
    }


    const fileSubmit = async (e) => {
        e.preventDefault();
        const file = e.target[0].files[0];
        console.log("(list tasks page file submit) file", file);

        if (file) {

            try {
                const [response, status] = await uploadTaskCSV(pid, file);
                console.log("(list tasks page file submit) status", status, response);

                if (status === 200) {
                    toast.success("Tasks uploaded successfully");
                    window.location.reload();
                }

                else {
                    toast.error("Error uploading tasks");
                }
            }

            catch (error) {
                console.log("(list tasks page file submit) error", error);
                toast.error(error);
            }
        }
    }


    React.useEffect(() => {
        (async () => {
            try {
                const [response, status] = await fetchProject(pid);
                console.log("(list tasks page useEffect to fetch project)", status, response);

                if (status === 200) {
                    setProjectData(response.message);
                    setTasks(response.message.Tasks);
                    setLoading(false);
                }

                else {
                    toast.error("Project does not exist");
                    navigate("/projects");
                }
            }

            catch (error) {
                console.log("(list tasks page useEffect to fetch project) error", error);
                toast.error(error);
                toast.error("Error loading project details");
            }
        })(); // eslint-disable-next-line
    }, [pid]);

    React.useEffect(() => {
        (async () => {
            const [response, status] = await validate();
            console.log("(list tasks page useEffect to validate) status", status, response);

            setLoggedInUserID(response.message.ID);
        })(); // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        (async () => {
            if (projectData && loggedInUserID) {
                console.log("(list tasks page useEffect to check admin) projectData", loggedInUserID, projectData.OwningUserID);
                if (loggedInUserID === projectData.OwningUserID) {
                    setAdminView(true);
                }
            }
        })(); // eslint-disable-next-line
    }, [projectData, loggedInUserID]);


    return (loading ? < Loading /> :
        <div className="h-screen w-full p-14">
            <div className="md:flex justify-between">
                <div>
                    <p className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-600 md:text-5xl lg:text-4xl">
                        Tasks
                    </p>
                </div>

                <div className="md:flex">
                    <button onClick={fileSave} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold h-fit py-2.5 px-4 w-full md:w-fit rounded-full inline-flex items-center my-auto mr-2">
                        <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                    </button>

                    {adminview &&
                        <NavLink to={`/addtask/${pid}`} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 h-fit md:my-auto w-full md:w-fit my-2">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" className="h-5 w-5 mr-2"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12H20M12 4V20" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path> </g>
                            </svg>
                            Add Task
                        </NavLink>
                    }

                    <NavLink to="/projects" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 w-full md:w-fit my-auto h-fit">
                        <svg className="w-3.5 h-3.5 mr-2 scale-x-[-1]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                        Projects

                    </NavLink>
                </div>

            </div>

            {adminview &&
                <div className="my-5 p-5 bg-slate-100 rounded-3xl overflow-hidden">
                    <p className="text-lg font-bold text-gray-800">Upload CSV</p>
                    <p className="text-sm text-gray-600">The CSV must have the following columns: Name, Description, Priority, AssignedUsers</p>
                    <form className="my-5" onSubmit={fileSubmit}>
                        <input type="file" className="bg-slate-200 p-2 mr-2 my-2 rounded" />
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2" type="submit">
                            Upload
                        </button>
                    </form>
                </div>
            }

            <div className="lg:flex h-full justify-between">
                <div className="lg:w-1/2 my-5 h-fit p-5 bg-slate-100 rounded-lg lg:mx-5">
                    <p className="text-xl font-bold text-gray-600">
                        In Progress {tasks.filter(task => task.Completed === false).length}
                    </p>

                    <div className="mt-5">
                        {tasks
                            .filter(task => task.Completed === false)
                            .sort((a, b) => a.Priority - b.Priority) // Sort tasks by priority in descending order
                            .map(task => (
                                <TaskCard
                                    key={task.ID}
                                    ID={task.ID}
                                    projectID={task.ProjectID}
                                    name={task.Name}
                                    description={task.Description}
                                    priority={task.Priority}
                                    assigneduser={task.AssignedUsers}
                                    completed={task.Completed}
                                    adminview={adminview}
                                />
                            ))}
                    </div>

                </div>

                <div className="lg:w-1/2 my-5 h-fit p-5 bg-slate-100 rounded-lg lg:mx-5">
                    <p className="text-xl font-bold text-gray-600">
                        Completed {tasks.filter(task => task.Completed === true).length}
                    </p>

                    <div className="mt-5">
                        {tasks
                            .filter(task => task.Completed === true)
                            .sort((a, b) => a.Priority - b.Priority) // Sort tasks by priority in descending order
                            .map(task => (
                                <TaskCard
                                    key={task.ID}
                                    ID={task.ID}
                                    projectID={task.ProjectID}
                                    name={task.Name}
                                    description={task.Description}
                                    priority={task.Priority}
                                    assigneduser={task.AssignedUsers}
                                    completed={task.Completed}
                                    adminview={adminview}
                                />
                            ))}
                    </div>

                </div>
            </div>
        </div>
    )
}