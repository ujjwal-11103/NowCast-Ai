import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Eye, EyeOff } from 'lucide-react';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Registration attempt:', formData);
        // Handle registration logic here
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200 text-sm font-medium">
                    Full Name
                </Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                    placeholder="Enter your full name"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="reg-username" className="text-slate-200 text-sm font-medium">
                    Username
                </Label>
                <Input
                    id="reg-username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                    placeholder="Choose a username"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="reg-password" className="text-slate-200 text-sm font-medium">
                    Password
                </Label>
                <div className="relative">
                    <Input
                        id="reg-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 pr-10"
                        placeholder="Create a strong password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
                <UserPlus size={18} className="mr-2" />
                Create Account
            </Button>

            <div className="text-center">
                <p className="text-xs text-slate-400">
                    By signing up, you agree to our{' '}
                    <button className="text-blue-400 hover:text-blue-300 transition-colors">
                        Terms of Service
                    </button>{' '}
                    and{' '}
                    <button className="text-blue-400 hover:text-blue-300 transition-colors">
                        Privacy Policy
                    </button>
                </p>
            </div>
        </form>
    );
};

export default RegisterForm;
