import React from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-hot-toast";
import { addProject } from "./../../utils/apiUtils";
import { useNavigate } from "react-router-dom";

export default function AddProject() {
    const navigate = useNavigate();
    const [form, setForm] = React.useState({
        name: "",
        description: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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

        try {
            const [response, status] = await addProject(form.name, form.description);
            console.log("(add project page form submit)", status, response);
            if (status === 200) {
                toast.success("Project added successfully");
                setForm({
                    name: "",
                    description: "",
                });
                navigate('/projects');
            }
        } catch (error) {
            console.log("(add project page form submit)", error);
            toast.error(error.message);
        }

    };

    return (
        <div className="h-screen w-full p-14">
            <p className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-600 md:text-5xl lg:text-4xl">
                Add New Project
            </p>

            <form className="mt-14 w-full" onSubmit={handleSubmit}>
                <input type="text" placeholder="Project Name"
                    className="border-2 border-gray-300 rounded-md h-10 px-2 w-full my-2"
                    value={form.name} onChange={handleChange} name="name" required />

                <input type="text" placeholder="Project Description"
                    className="border-2 border-gray-300 rounded-md h-10 px-2 w-full my-2"
                    value={form.description} onChange={handleChange} name="description" required />

                <div className="my-3">
                    <NavLink to="/projects" className="my-3 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 sm:px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
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