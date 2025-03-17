import React, { useState, useEffect, useRef } from "react";
import { BarChart3, Bell, ChevronDown, Download, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import logoPolestar from "../../assets/img/intellimark.png";
import parikshit from "../../assets/users/parikshit.png";
import umesh from "../../assets/users/umesh.png";
import rahul from "../../assets/users/rahul.png";
import mahesh from "../../assets/users/mahesh1.png";

const users = {
    Ravi: { name: "James", position: "CMO", img: rahul, headerText: "Market Mix Modeling" },
    mahesh: { name: "Daniel", position: "CSCO", img: mahesh, headerText: "Supply Chain Management" },
    Ramesh: { name: "Michael", position: "CEO", img: parikshit, headerText: "CEO Dashboard" },
    umesh: { name: "Henry", position: "National Sales Head", img: umesh, headerText: "Sales Performance" },
    Suresh: { name: "David", position: "Supply Chain Tower", img: mahesh, headerText: "Supply Chain Tower" },
    sandesh: { name: "John", position: "Pricing Analytics", img: parikshit, headerText: "Pricing Analytics" },
};

const NavBar = () => {
    const [selectedUser, setSelectedUser] = useState(users.mahesh);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const lastPart = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);

    useEffect(() => {
        const userMap = {
            neptune: "Ravi",
            alfred: "umesh",
            "ceo-cockpit": "Ramesh",
            supplychaintower: "Suresh",
            pricingpage: "sandesh",
        };
        setSelectedUser(users[userMap[lastPart]] || users.mahesh);
    }, [lastPart]);

    const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);

    // const handleUserClick = (userKey) => {
    //     setSelectedUser(users[userKey]);
    //     setIsDropdownVisible(false);
    //     const userRoutes = {
    //         Ravi: "/neptune",
    //         umesh: "/alfred",
    //         mahesh: "/teresa",
    //         Ramesh: "/ceo-cockpit",
    //         Suresh: "/supplychaintower",
    //         sandesh: "/pricingpage",
    //     };
    //     navigate(userRoutes[userKey]);
    // };

    const handleUserClick = (userKey) => {
        setSelectedUser(users[userKey]);
        setIsDropdownVisible(false);
        window.location.href = "http://52.172.42.245:8080/";
    };


    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="bg-[#0a2472] text-white p-4 flex justify-between items-center">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
                <img src="Intellimark_AI.png" alt="Logo" className="me-2" style={{ height: "35px" }} />
                <h1 className="text-xl font-bold">Intellimark AI</h1>
                <span className="px-3 py-1 bg-[#1e3799] rounded-md text-sm font-medium">{selectedUser.headerText}</span>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-6">
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <div className="flex items-center space-x-2 cursor-pointer group" onClick={toggleDropdown}>
                        <img src={selectedUser.img} alt="Profile" className="w-9 h-9 rounded-full" />
                        <div>
                            <p className="text-sm font-medium">{selectedUser.name}</p>
                            <p className="text-xs text-blue-200">{selectedUser.position}</p>
                        </div>
                        <ChevronDown size={16} className="text-blue-200 group-hover:text-white transition-colors" />
                    </div>

                    {/* Dropdown Menu */}
                    {isDropdownVisible && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50">
                            {Object.keys(users).map(
                                (userKey) =>
                                    userKey !== Object.keys(users).find((key) => users[key].name === selectedUser.name) && (
                                        <button
                                            key={userKey}
                                            className="w-full flex items-center px-4 py-2 hover:bg-gray-200"
                                            onClick={() => handleUserClick(userKey)}
                                        >
                                            <img src={users[userKey].img} alt="User" className="w-6 h-6 rounded-full mr-3" />
                                            <div className="flex-1 text-left">
                                                <div className="font-semibold">{users[userKey].name}</div>
                                                <small className="text-gray-500">{users[userKey].position}</small>
                                            </div>
                                        </button>
                                    )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default NavBar;
