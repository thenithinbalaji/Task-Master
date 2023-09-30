import React from "react";
import toast from 'react-hot-toast';
import JiraImg from "./../assets/jiralogo.png";
import { login, validate } from "./../utils/apiUtils"
import { useNavigate } from 'react-router-dom';
import Loading from "./../components/loadingState";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            const [response, status] = await validate();
            console.log("(login page useEffect)", status, response);
            if (status === 200) {
                navigate('/projects');
            }
            setLoading(false);
        })(); // eslint-disable-next-line
    }, []);

    const [form, setForm] = React.useState({
        email: "",
        password: "",
    });

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        //check if its a valid email
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(form.email)) {
            toast.error("Enter a valid email id");
            return;
        }

        try {
            const [response, status] = await login(form.email, form.password);
            console.log("(login page form submit)", status, response);

            if (status === 200) {
                toast.success("Login Successful");
                navigate('/projects');
            }

            else
                toast.error(response.message);


        } catch (error) {
            toast.error("Login failed");
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
                            Login to <br /> <span className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl">Task Master</span>
                        </div>

                        <div >
                            <form className="flex flex-col justify-evenly gap-6 mx-5 my-5" onSubmit={handleSubmit}>

                                <input type="text" placeholder="Organisation Email" className="border-2 border-gray-300 rounded-md sm:w-80 w-full h-10 px-2" value={form.email} onChange={handleChange} name="email" required />

                                <input type="password" placeholder="Password" className="border-2 border-gray-300 rounded-md sm:w-80 w-full h-10 px-2" value={form.password} onChange={handleChange} name="password" required />

                                <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">Login</button>

                            </form>

                            <div className="flex justify-center my-5 mx-5">

                                <p className="text-slate-400">Don't have an account? <a href="/signup" className="text-blue-500 hover:text-blue-700">Register here</a></p>

                            </div>
                        </div>
                    </div>

                </div>

            </div>
    );
}
