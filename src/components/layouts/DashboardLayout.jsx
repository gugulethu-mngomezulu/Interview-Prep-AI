import React from "react";
import { useUser } from "../../context/userContext"; // Import the hook
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
    const { user } = useUser(); // Use the hook correctly
    
    return (
        <div>
            <Navbar />
            {children} {/* Don't forget to render the children */}
        </div>
    );
};

export default DashboardLayout;