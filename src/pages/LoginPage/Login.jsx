import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Using Sonner for toast notifications
import logo from "../../assets/Login/Favicon.png"

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password === "1234") {
            navigate("/teresa");
            toast.success("Login Successfully");
        } else {
            toast.error("Invalid Password");
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left section with gradient and shapes */}
            <div className="relative hidden w-1/2 bg-gradient-to-br from-[#0A2472] to-[#1E3A8A] lg:block">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute left-0 top-1/4 h-64 w-96 -rotate-45 transform bg-gradient-to-r from-blue-300/20 to-cyan-400/20 blur-3xl"></div>
                    <div className="absolute right-0 top-1/3 h-64 w-96 -rotate-45 transform bg-gradient-to-r from-blue-300/20 to-cyan-400/20 blur-3xl"></div>
                </div>
                <div className="relative z-10 flex h-full items-center justify-center px-12">
                    <img src={logo} alt="favicon" className="w-10 h-10 mr-2" />
                    <h1 className="text-3xl font-bold text-white">ProfitPulse AI</h1>
                </div>
            </div>


            {/* Right section with login form */}
            <div className="flex w-full items-center justify-center bg-white px-6 lg:w-1/2">
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-bold tracking-tight">Welcome to Website</h2>
                        <p className="text-sm text-muted-foreground">Enter your credentials below to access your account</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Input
                                id="email"
                                placeholder="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                id="password"
                                placeholder="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <Button
                            className="w-full bg-gradient-to-r from-[#0A2472] to-[#1E3A8A] hover:from-[#1E3A8A] hover:to-[#2563EB] transition-all duration-300 ease-in-out shadow-md hover:shadow-lg active:scale-95 text-white font-semibold py-2"
                            type="submit"
                        >
                            Login
                        </Button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
