import React from "react";
import ProjectSVG from "./../assets/board.svg";
import UserSVG from "./../assets/user.svg";
import { NavLink } from "react-router-dom";
import { deleteProject } from "./../utils/apiUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function ProjectCard(props) {
    const navigate = useNavigate();
    const [actionmake, setActionmake] = React.useState(false);

    React.useEffect(() => {
        console.log("(project card useEffect)", props.loggedinuserid, props.ownerid);

        if (props.loggedinuserid === props.ownerid) {
            setActionmake(true);
        }
    }, [props.loggedinuserid, props.ownerid]);

    const editButton = async (e) => {
        e.preventDefault();
        navigate(`/editproject/${props.id}`);
    }

    const deleteButton = async (e) => {
        e.preventDefault();
        let confirm = window.confirm(`Are you sure you want to delete this project - ${props.name}? This action cannot be undone.`);

        if (confirm) {
            try {
                let [response, status] = await deleteProject(props.id);
                console.log("(project card delete project)", status, response);
                if (status === 200) {
                    navigate(0);
                    toast.success("Project deleted successfully.");
                }

                else {
                    toast.error(response.message);
                }
            }
            catch (err) {
                toast.error("Failed to delete project.");
            }
        }
    }

    return (
        <NavLink to={`/projects/${props.id}`}>

            <div className="my-5 hover:bg-slate-100 p-5 rounded-xl md:flex justify-between bg-slate-50 group">

                <div className="flex">
                    <img src={ProjectSVG} alt="project" className="h-9 md:h-12 my-auto hidden md:block group-hover:scale-x-[-1]" />
                    <div className="md:mx-5 my-auto">
                        <p className="text-xl font-bold">{props.name}</p>
                        <p className="hidden sm:block">{props.description}</p>
                        <p className="font-normal p-2 bg-slate-200 rounded-lg my-2 text-slate-600 text-sm w-fit">
                            <img src={UserSVG} alt="group" className="w-5 h-5 mx-1 hidden sm:inline-block" />
                            {props.ownermail}
                        </p>
                    </div>
                </div>

                {actionmake ?
                    <div className="flex md:block">

                        <div className='flex items-center justify-center mx-2'>
                            <div className="my-2">
                                <button onClick={editButton} className="flex p-2.5 bg-yellow-500 rounded-xl hover:rounded-3xl hover:bg-yellow-600 transition-all duration-300 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className='flex items-center justify-center'>
                            <div className="my-2">
                                <button onClick={deleteButton} className="flex p-2.5 bg-red-500 rounded-xl hover:rounded-3xl hover:bg-red-600 transition-all duration-300 text-white cursor-default">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                        <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                    </div> : <div className="flex md:block">

                        <div className='flex items-center justify-center mx-2'>
                            <div className="my-2">
                                <button onClick={(e) => e.preventDefault()} className="flex p-2.5 bg-gray-500 rounded-xl hover:bg-gray-600 transition-all duration-300 text-white cursor-not-allowed opacity-20">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className='flex items-center justify-center'>
                            <div className="my-2">
                                <button onClick={(e) => e.preventDefault()} className="flex p-2.5 bg-gray-500 rounded-xl hover:bg-gray-600 transition-all duration-300 text-white cursor-not-allowed opacity-20">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                        <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                    </div>
                }

            </div>
        </NavLink>
    )
}

