import React from "react";

export default function LoadingState() {
    return (
        <div className="h-screen w-full flex flex-col justify-center items-center animate-pulse">
            <div>
                <h1 className="text-4xl font-bold text-gray-400">Loading</h1>
                <svg fill='none' className="w-32 h-32 animate-spin text-gray-300" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
                    <path clipRule='evenodd'
                        d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
                        fill='currentColor' fillRule='evenodd' />
                </svg>
            </div>
        </div>
    );
}