import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Eye, EyeOff } from 'lucide-react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    // Handle login logic here
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
        <Label htmlFor="username" className="text-slate-200 text-sm font-medium">
          Username
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
          placeholder="Enter your username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-200 text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 pr-10"
            placeholder="Enter your password"
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
        <LogIn size={18} className="mr-2" />
        Sign In
      </Button>

      <div className="text-center">
        <button
          type="button"
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          Forgot your password?
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
