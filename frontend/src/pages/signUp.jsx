import React from "react";
import toast from 'react-hot-toast';
import JiraImg from "./../assets/jiralogo.png";
import { signup, validate, login } from "./../utils/apiUtils"
import { useNavigate } from 'react-router-dom';
import Loading from "./../components/loadingState";

export default function SignUp() {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            const [response, status] = await validate();
            console.log("(signup page useEffect)", status, response);
            if (status === 200) {
                navigate('/projects');
            }
            setLoading(false);
        })(); // eslint-disable-next-line
    }, []);

    const [form, setForm] = React.useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (form.name.length > 10) {
            toast.error("Name must be less than 10 characters");
            return;
        }

        if (form.name.length < 3) {
            toast.error("Name must be more than 3 characters");
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(form.email)) {
            toast.error("Enter a valid email id");
            return;
        }

        try {
            const [response, status] = await signup(form.name, form.email, form.password);
            console.log("(signup page form submit)", status, response);

            if (status === 200) {
                toast.success("Account created successfully");

                try {
                    const [response, status] = await login(form.email, form.password);
                    console.log("(singup page nested login form submit)", status, response);

                    if (status === 200) {
                        toast.success("Successfully logged in");
                        navigate('/projects');
                    }

                    else
                        toast.error(response.message);


                } catch (error) {
                    toast.error("Failed to login");
                }
            }

            else
                toast.error("Account associated with this email was deleted recently");


        } catch (error) {
            toast.error("Account creation failed");
        }
    };

    return (
        loading ? <Loading /> :
            <div className="h-screen flex flex-col">
                <div className="flex justify-start my-5 mx-5 absolute">

                    <a href="/">
                        <img src={JiraImg} alt="logo" className="h-9 md:h-12" />
                    </a>

                </div>

                <div className="flex justify-center my-auto mx-5">
                    <div>
                        <div className="font-bold my-5 mx-5">
                            Create Account<br /> <span className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl">Task Manager</span>
                        </div>

                        <div >
                            <form className="flex flex-col justify-evenly gap-6 mx-5 my-5" onSubmit={handleSubmit}>
                                <input type="text" placeholder="Display Name" className="border-2 border-gray-300 rounded-md sm:w-80 w-full h-10 px-2" value={form.name} onChange={handleChange} name="name" required />

                                <input type="text" placeholder="Organisation Email" className="border-2 border-gray-300 rounded-md sm:w-80 w-full h-10 px-2" value={form.email} onChange={handleChange} name="email" required />

                                <input type="password" placeholder="Password" className="border-2 border-gray-300 rounded-md sm:w-80 w-full h-10 px-2" value={form.password} onChange={handleChange} name="password" required />

                                <input type="password" placeholder="Confirm Password" className="border-2 border-gray-300 rounded-md sm:w-80 w-full h-10 px-2" value={form.confirmPassword} onChange={handleChange} name="confirmPassword" required />

                                <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">Register</button>

                            </form>

                            <div className="flex justify-center my-5 mx-5">

                                <p className="text-slate-400">Already Registered? <a href="/login" className="text-blue-500 hover:text-blue-700">Login here</a></p>

                            </div>
                        </div>
                    </div>

                </div>

            </div>
    );
}
