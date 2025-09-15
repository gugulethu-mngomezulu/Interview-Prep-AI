import React from "react";
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="h-16 bg-white border-b border-gray-200/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between gap-5 px-4 h-full max-w-7xl">
                <Link 
                    to="/dashboard"
                    className="hover:opacity-80 transition-opacity duration-200"
                >
                    <h2 className="text-lg md:text-xl font-medium text-black leading-5 whitespace-nowrap">
                        Interview Prep AI
                    </h2>
                </Link>

                <ProfileInfoCard />
            </div>
        </nav>
    );
}

export default Navbar;