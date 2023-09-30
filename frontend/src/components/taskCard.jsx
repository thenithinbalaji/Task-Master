import React from "react";
import UserSVG from "./../assets/user.svg";
import CheckmarkSVG from "./../assets/checkmark.svg";
import WrongmarkSVG from "./../assets/wrongmark.svg";
import { completeTask, uncompleteTask, deleteTask } from "./../utils/apiUtils";
import { toast } from "react-hot-toast";
import { NavLink } from "react-router-dom";

export default function TaskCard(props) {

    const completeClick = async (e) => {
        e.preventDefault();
        console.log("completeClicked for task", props.ID);

        try {
            const [response, status] = await completeTask(props.projectID, props.ID);
            console.log("(task card) completeClick", status, response);

            if (status === 200) {
                toast.success("Task marked as completed");
                setTimeout(function () {
                    window.location.reload();
                }, 500);
            }

            else {
                toast.error("Error marking task as completed");
            }
        }

        catch (error) {
            console.log("(task card) completeClick error", error);
            toast.error(error);
            toast.error("Error marking task as completed");
        }
    }

    const uncompleteClick = async (e) => {
        e.preventDefault();
        console.log("uncompleteClicked for task", props.ID);

        try {
            const [response, status] = await uncompleteTask(props.projectID, props.ID);
            console.log("(task card) uncompleteClick", status, response);

            if (status === 200) {
                toast.success("Task marked as incomplete");
                setTimeout(function () {
                    window.location.reload();
                }, 500);
            }

            else {
                toast.error("Error marking task as incomplete");
            }
        }

        catch (error) {
            console.log("(task card) uncompleteClick error", error);
            toast.error(error);
            toast.error("Error marking task as incomplete");
        }
    }

    const deleteClick = async (e) => {
        e.preventDefault();
        console.log("deleteClicked for task", props.ID);

        let confirm = window.confirm("Are you sure you want to delete this task?");

        if (confirm) {
            try {
                const [response, status] = await deleteTask(props.projectID, props.ID);
                console.log("(task card) deleteClick", status, response);

                if (status === 200) {
                    toast.success("Task deleted");
                    setTimeout(function () {
                        window.location.reload();
                    }, 500);
                }

                else {
                    toast.error("Error deleting task");
                }
            }

            catch (error) {
                console.log("(task card) deleteClick error", error);
                toast.error(error);
                toast.error("Error deleting task");
            }
        }

    }

    return (
        <div
            className={`text-center md:text-left w-full p-2 sm:p-5 rounded-xl my-2 overflow-x-scroll ${props.completed ? 'bg-green-200' : 'bg-blue-200'} `}>

            <div className="md:flex justify-between">
                <div className="my-auto">
                    <p className="text-xl font-bold">{props.name}</p>
                    <p className="">{props.description}</p>
                    <p className="text-sm font-bold text-gray-600">Priority {props.priority}</p>
                </div>

                {props.adminview &&
                    <div className="my-3 md:my-auto sm:flex-row justify-evenly flex flex-col xl:flex-row lg:flex-col">
                        {
                            props.completed ?
                                <button onClick={uncompleteClick} className="flex p-2.5 bg-red-500 rounded-xl hover:rounded-3xl hover:bg-red-600 transition-all duration-300 text-white cursor-default m-1">
                                    <img src={WrongmarkSVG} alt="checkmark" className="mid:w-6 h-6" />
                                </button>

                                :

                                <button onClick={completeClick} className="flex p-2.5 bg-green-500 rounded-xl hover:rounded-3xl hover:bg-green-600 transition-all duration-300 text-white cursor-default m-1">
                                    <img src={CheckmarkSVG} alt="checkmark" className="mid:w-6 h-6" />
                                </button>
                        }

                        <NavLink to={`/edittask/${props.projectID}/${props.ID}`} className="flex p-2.5 bg-yellow-500 rounded-xl hover:rounded-3xl hover:bg-yellow-600 transition-all duration-300 text-white cursor-default m-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </NavLink>

                        <button onClick={deleteClick} className="flex p-2.5 bg-red-500 rounded-xl hover:rounded-3xl hover:bg-red-600 transition-all duration-300 text-white cursor-default m-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z" />
                            </svg>
                        </button>
                    </div>
                }
            </div>

            <div className="flex gap-2">
                {props.assigneduser.map(user => (
                    <p key={user.ID} className="font-normal p-2 bg-yellow-200 rounded-lg my-2 text-slate-600 text-sm w-fit">
                        <img src={UserSVG} alt="group" className="w-5 h-5 mx-1 hidden sm:inline-block" />
                        {user.Name}
                    </p>
                ))}
            </div>

        </div>
    );
}