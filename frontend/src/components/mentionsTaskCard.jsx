import React from "react";
import { NavLink } from "react-router-dom";
export default function MentionsTaskCard(props) {
    return (
        <NavLink to={`/projects/${props.projectID}`}>
            <div className={`my-5 p-5 rounded-xl lg:flex justify-between ${props.completed ? 'bg-green-200 hover:bg-green-300' : 'bg-blue-100 hover:bg-blue-200'} `}>

                <div className="md:mx-5 my-auto w-full lg:w-1/3">
                    <p className="text-xl font-bold">{props.name}</p>
                    <p>{props.description}</p>
                    <p className="font-bold">in {props.projectName}</p>
                </div>

                <div className="md:mx-5 lg:my-auto my-5">
                    {props.completed ? <p className="font-bold text-green-500">Completed</p> : <p className="font-bold text-blue-500">In Progress</p>}
                </div>

                <div className="md:mx-5 my-auto">
                    <p className="hidden sm:block">📅{new Date(props.assignedOn).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: '2-digit', year: 'numeric' })}</p>
                    <p className="block sm:hidden">📅{new Date(props.assignedOn).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
                    <p>🕔{new Date(props.assignedOn).toLocaleTimeString()}</p>
                </div>

            </div>
        </NavLink>
    )
}
