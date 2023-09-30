import React from "react";
import toast from 'react-hot-toast';
import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { logout, validate } from "./../utils/apiUtils"
import JiraImg from "./../assets/jiralogo.png";
import MentionSVG from "./../assets/mention.svg";
import ProjectSVG from "./../assets/projects.svg";
import GroupSVG from "./../assets/group.svg";
import SettingsSVG from "./../assets/settings.svg";
import LogoutSVG from "./../assets/logout.svg";
import Loading from "./../components/loadingState";

export default function MainLayout() {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            const [response, status] = await validate();
            console.log("(mainlayout page useEffect)", status, response);
            if (status !== 200) {
                navigate('/login');
                toast.error("Please login to continue");
            }
            setLoading(false);
        })(); // eslint-disable-next-line
    }, []);

    const onLogout = async () => {
        let confirm = window.confirm("Are you sure you want to logout?");

        if (!confirm) return;

        else {
            const [response, status] = await logout();

            console.log("(mainlayout page onLogout)", status, response);

            if (status === 200) {
                navigate('/login');
                toast.success("Logged out successfully");
            }
        }

    }

    return (
        loading ? <Loading /> :
            <div className="h-screen w-full flex">
                <div id="sidemenu" className="sm:w-96 w-fit bg-slate-700 flex flex-col justify-between py-5 px-1 sm:px-5">

                    <div className="w-fit">
                        <a href="/projects">
                            <img src={JiraImg} alt="logo" className="h-9 md:h-12" />
                        </a>
                    </div>

                    <div>
                        <div className="flex flex-col">

                            <NavLink to="/mentions" className={({ isActive, isPending }) =>
                                isPending ? "" : isActive ? "bg-slate-600 rounded-xl" : "hover:bg-slate-600 rounded-xl"
                            }>
                                <div className="flex gap-2 p-2 mx-2">
                                    <img src={MentionSVG} alt="logo" className="h-5 md:h-6" />

                                    <span className="my-auto text-white hidden sm:block">Mentions</span>
                                </div>
                            </NavLink>

                            <NavLink to="/projects" className={({ isActive, isPending }) =>
                                isPending ? "" : isActive ? "bg-slate-600 rounded-xl" : "hover:bg-slate-600 rounded-xl"
                            }>
                                <div className="flex gap-2 p-2 mx-2">
                                    <img src={ProjectSVG} alt="logo" className="h-5 md:h-6" />

                                    <span className="my-auto text-white hidden sm:block">Projects</span>
                                </div>
                            </NavLink>

                            <NavLink to="/group" className={({ isActive, isPending }) =>
                                isPending ? "" : isActive ? "bg-slate-600 rounded-xl" : "hover:bg-slate-600 rounded-xl"
                            }>
                                <div className="flex gap-2 p-2 mx-2">
                                    <img src={GroupSVG} alt="logo" className="h-5 md:h-6" />

                                    <span className="my-auto text-white hidden sm:block">Group</span>
                                </div>
                            </NavLink>

                        </div>
                    </div>

                    <div className="flex flex-col">
                        <NavLink to="/settings" className={({ isActive, isPending }) =>
                            isPending ? "" : isActive ? "bg-slate-600 rounded-xl" : "hover:bg-slate-600 rounded-xl"
                        }>
                            <div className="flex gap-2 p-2 mx-2">
                                <img src={SettingsSVG} alt="logo" className="h-5 md:h-6" />

                                <span className="my-auto text-white hidden sm:block">Settings</span>
                            </div>
                        </NavLink>

                        <button className="rounded-xl hover:bg-slate-600" onClick={onLogout}>
                            <div className="flex gap-2 p-2 mx-2">
                                <img src={LogoutSVG} alt="logo" className="h-5 md:h-6" />

                                <span className="my-auto text-white hidden sm:block">Logout</span>
                            </div>
                        </button>
                    </div>

                </div>

                <div className="h-screen w-full overflow-y-scroll">
                    <Outlet />
                </div>
            </div>
    )
}