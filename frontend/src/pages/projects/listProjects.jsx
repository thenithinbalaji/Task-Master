import React from "react";
import ProjectCard from "../../components/projectCard";
import { NavLink } from "react-router-dom";
import { fetchProjects, validate } from "./../../utils/apiUtils";
import Loading from "./../../components/loadingState";
import { toast } from "react-hot-toast";

export default function ListProjects() {
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [loggedinuser, setLoggedinuser] = React.useState({});
    const [search, setSearch] = React.useState("");

    function handleChange(e) {
        setSearch(e.target.value);
    }

    React.useEffect(() => {
        (async () => {
            var [response, status] = await fetchProjects();
            console.log("(projects page useEffect)", status, response);

            if (status === 200) {
                setData(response.message.reverse());
                setLoading(false);
            }

            else {
                setLoading(false);
                toast.error("Error loading projects");
            }

            [response, status] = await validate();
            console.log("(projects page useEffect)", status, response);

            setLoggedinuser(response.message);

        })(); // eslint-disable-next-line   
    }, []);


    return (loading ? <Loading /> :
        <div className="h-screen w-full p-14">

            <div className="md:flex justify-between">
                <p className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-600 md:text-5xl lg:text-4xl">
                    Projects <span className="font-bold text-slate-300">{data.length}</span>
                </p>

                <NavLink to="/addproject" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 h-fit my-auto w-full md:w-fit">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" className="h-5 w-5 mr-2"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12H20M12 4V20" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path> </g>
                    </svg>
                    Add Project
                </NavLink>

            </div>
            <div className="pt-2 relative mx-auto text-gray-600">
                <input className="border-2 border-gray-300 bg-white h-8 sm:h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none w-full"
                    type="text" name="search" placeholder="Search" value={search} onChange={handleChange} />
            </div>

            <div>
                {data
                    .filter((project) => project && project.Name && project.Name.toLowerCase().includes(search.toLowerCase()))
                    .map((project, index) => {
                        return (
                            <ProjectCard
                                key={index}
                                id={project.ID}
                                name={project.Name}
                                description={project.Description}
                                ownerid={project.OwningUserID}
                                ownermail={project.OwningUser.Email}
                                loggedinuserid={loggedinuser.ID}
                            />
                        );
                    }
                    )}
            </div>

        </div>
    )
}