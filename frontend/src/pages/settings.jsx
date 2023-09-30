import React, { useState } from "react";
import toast from 'react-hot-toast';
import { deleteMe } from './../utils/apiUtils';
import { useNavigate } from 'react-router-dom';

export default function Group() {
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    const handleDelete = async () => {
        let confirm = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

        if (confirm) {
            try {
                const [response, status] = await deleteMe();
                console.log("(settings page handle delete)", status, response);
                if (status === 200) {
                    navigate('/login');
                    toast.success('Account deleted successfully');
                }
            } catch (error) {
                toast.error('Something went wrong while deleting your account');
            }
        }


    }

    return (

        <div className="h-screen w-full p-14">
            <p className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-600 md:text-5xl lg:text-4xl">
                Settings
            </p>

            <p className="text-xl font-bold">Delete Account</p>

            <button type="button" onClick={handleDelete} disabled={!isChecked} className={`text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 my-5 ${isChecked ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} `}>
                Delete Account
            </button>

            <p className="text-slate-400 my-2">Your account will be soft deleted from our database. Note that this will completely prevent you from using your deleted mail id to create a new accounts in the future. You can recover it only by contacting support.</p>

            <div className="flex gap-4">
                <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange}></input>
                <p className="my-2">I understand the consequences of my action</p>
            </div>

            <hr className="my-5" />

            <p className="text-slate-400 my-2 py-5 text-sm">
                Note that if the deleted user belongs to any assigned task, the mail id is removed from that task. <br />
                If the deleted user owns a project with no tasks, then the project is deleted.
                If the deleted user owns a project with tasks, a different user is fetched from the project's tasks and is made as the new owner, if not available then the project is deleted.
            </p>
        </div >
    )
}