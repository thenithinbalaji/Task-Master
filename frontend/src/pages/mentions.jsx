import React from "react";
import MentionsTaskCard from "./../components/mentionsTaskCard";
import { validate } from "./../utils/apiUtils";
import Loading from "./../components/loadingState";

export default function ListProjects() {
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [completed, setCompleted] = React.useState(false);

    function handleCompletedChange() {
        setCompleted(!completed);
    }

    function handleChange(e) {
        setSearch(e.target.value);
    }

    React.useEffect(() => {
        (async () => {
            const [response, status] = await validate();
            console.log("(mentions page useEffect)", status, response);

            //loop through all the response.message.AssignedTasks and add them to an array only if the task's completed is false
            //then set the data to the array
            var processedTasks = [];


            for (let i = 0; i < response.message.AssignedTasks.length; i++) {
                if (!completed) {
                    if (response.message.AssignedTasks[i].Completed === false) {
                        processedTasks.push(response.message.AssignedTasks[i]);
                    }
                }
                else
                    processedTasks.push(response.message.AssignedTasks[i]);
            }

            setData(processedTasks.reverse());
            setLoading(false);

        })(); // eslint-disable-next-line   
    }, [completed]);

    return (loading ? <Loading /> :
        <div className="h-screen w-full p-14">
            <div className="lg:flex justify-between">
                <p className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-600 md:text-3xl lg:text-4xl">
                    Mentioned Tasks <span className="font-bold text-slate-300">{data.length}</span>
                </p>

                <div className="my-auto">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value={completed} className="sr-only peer" onClick={handleCompletedChange} />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Completed</span>
                    </label>
                </div>

            </div>
            <div className="pt-2 relative mx-auto text-gray-600">
                <input className="border-2 border-gray-300 bg-white h-8 sm:h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none w-full"
                    type="text" name="search" placeholder="Search" value={search} onChange={handleChange} />
            </div>

            <div>
                {data
                    .filter((task) => task && task.Name && task.Name.toLowerCase().includes(search.toLowerCase()))
                    .map((task, index) => {
                        return (
                            <MentionsTaskCard
                                key={index}
                                id={task.ID}
                                name={task.Name}
                                description={task.Description}
                                projectID={task.ProjectID}
                                priority={task.Priority}
                                assignedOn={task.UpdatedAt}
                                completed={task.Completed}
                                projectName={task.Project.Name}
                            />
                        );
                    }
                    )}
            </div>

        </div>
    )
}