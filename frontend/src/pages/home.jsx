import React from "react";
import JiraImg from "./../assets/jiralogo.png";
import { useNavigate } from 'react-router-dom';
import { validate } from "./../utils/apiUtils"
import Loading from "./../components/loadingState";

export default function Home() {
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

    return (
        loading ? <Loading /> :
            <div className="h-screen w-full flex flex-col justify-between">
                <div className="flex justify-between my-5 mx-5">
                    <img src={JiraImg} alt="logo" className="h-9 md:h-12" />

                    <a href="/login" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none">
                        Login
                    </a>
                </div>

                <div>
                    <div className="text-center">
                        <div className="mx-5">
                            <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl">
                                Welcome to <br /> <span className="text-7xl font-extrabold">Task Manager</span>
                            </h1>

                            <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48">
                                Task Manager is a project management tool for software teams. It has a lot of features that help teams to manage their projects efficiently.
                            </p>

                            <a href="/signup" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
                                Sign Up for Free
                                <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <footer className="flex justify-center bg-slate-900">
                    <p className="text-white font-semibold my-5 mx-5 text-center">Created with ❤️ by <a href="https://github.com/thenithinbalaji" target="_blank" rel="noreferrer">@thenithinbalaji</a> ©️ 2023</p>
                </footer>
            </div>
    );
}