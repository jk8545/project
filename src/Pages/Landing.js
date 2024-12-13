// src/Landing.js
import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <div className="flex flex-col h-[100vh] overflow-hidden">
            {/* Navbar */}
            <div className="h-[4rem] w-full flex justify-between px-5 items-center">
                <div className="uppercase">Project_name</div>
                <div className="flex space-x-10">
                    <div>About</div>
                    <div>Paraphraser</div>
                    <div>Contact</div>
                </div>
                <div className="flex space-x-5 [&>*]:bg-neutral-800 text-white [&>*]:px-4 [&>*]:py-0.5 [&>*]:rounded-full">
                    <Link to="/signup">Signup</Link>
                    <Link to="/login">Login</Link>
                </div>
            </div>

            {/* Body */}
            <div className="flex h-full">
                <div className="w-[60%] flex flex-col pl-[5rem] justify-center">
                    <div>
                        <div>lets talk</div>
                        <div className="w-[30rem] capitalize text-[4rem] tracking-widest font-bold -mt-3">
                            Raise your 🖐️ and <span className="text-green-700">say</span> Hello 😉
                        </div>
                        <div className="w-[40rem] text-sm mt-8">
                            Breaking barriers with technology, translating hand signs into text and speech.
                            Empowering communication for a more inclusive world. 🌍🤝
                        </div>
                        {/* Updated Button */}
                        <Link
                            to="/gui"
                            className="bg-green-700 text-white w-fit px-6 py-1 text-lg rounded-full mt-5 cursor-pointer"
                        >
                            Try Paraphraser
                        </Link>
                        <div className="[&>*]:px-4 [&>*]:py-1 [&>*]:rounded-full [&>*]:border [&>*]:border-neutral-700 [&>*]:w-fit flex w-[35rem] flex-wrap gap-3 mt-7">
                            <div>Real-Time Gesture Recognition</div>
                            <div>Text and Speech Conversion</div>
                            <div>Sign Language Interpretation</div>
                            <div>Inclusive Communication Tools</div>
                            <div>Personalized Accessibility Solutions</div>
                        </div>
                    </div>
                </div>
                <div className="w-[60%] flex items-center justify-center relative overflow-hidden">
                    <img
                        src="https://res.cloudinary.com/de2rges3m/image/upload/v1700552629/Chat%20App/Home%20Page/blob_2_ssifxb.svg"
                        className="absolute translate-y-16 h-[30rem] w-[22rem] scale-[2] z-0"
                        alt="background blob"
                    />
                    <img
                        src="image.png"
                        className="z-10 scale-110 h-[30rem] w-[22rem] object-cover"
                         alt="..."

                    />
                </div>
            </div>
        </div>
    );
};

export default Landing;