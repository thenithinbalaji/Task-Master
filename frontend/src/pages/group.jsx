import React from "react";
import toast from 'react-hot-toast';
import { groupInfo } from "../utils/apiUtils";
import Loading from "./../components/loadingState";
import GroupSVG from "./../assets/group.svg";

export default function Group() {
    const [loading, setLoading] = React.useState(true);
    const [group, setGroup] = React.useState({
        org_domain: "",
        count: 0,
    });

    React.useEffect(() => {
        (async () => {
            const [response, status] = await groupInfo();
            console.log("(group page useEffect)", status, response);
            if (status === 200) {
                setGroup((prevState) => {
                    return {
                        ...prevState,
                        org_domain: response.message.org_domain,
                        count: response.message.count,
                    };
                });

                setLoading(false);
            }

            else
                toast.error("Failed to get group info");

        })(); // eslint-disable-next-line
    }, []);

    return (loading ? <Loading /> :

        <div className="h-screen w-full py-14 px-5 md:p-14">
            <p className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-600 md:text-5xl lg:text-4xl">
                Group Information
            </p>

            <div className="bg-slate-100 w-fit p-10 rounded-2xl">
                <p className="my-2 font-bold text-black">Group Name
                    <span className="p-2 bg-slate-200 rounded-3xl mx-2 font-normal text-black">
                        <img src={GroupSVG} alt="group" className="w-6 h-6 mx-2 hidden md:inline-block" />
                        {group.org_domain}
                    </span>
                </p>
                <p className="font-bold text-black">Number of Users <span className="font-normal text-black">{group.count}</span></p>
            </div>

            <hr className="my-10" />

            <p className="text-slate-400 my-5">Users of the same organisation belong to a group. Sign up with your different work mail id to find your group.</p>
        </div>
    )
}