import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';
import axiosnew from '@/utils/axiosnew'; // 🔁 API LOGIN (kept for later)


// 🔁 AUTH MODE TOGGLE
const USE_DUMMY_AUTH = true; // 👉 change to false to enable API login

// 🔐 Dummy credentials
const DUMMY_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { username, password } = formData;

    try {
      /* =====================================================
         🟦 DUMMY LOGIN (CURRENT)
         ===================================================== */
      if (USE_DUMMY_AUTH) {
        if (
          username === DUMMY_CREDENTIALS.username &&
          password === DUMMY_CREDENTIALS.password
        ) {
          login("dummy-auth-token");
          toast.success("Login successful");
          navigate("/overall");
        } else {
          toast.error("Invalid username or password");
        }
        return;
      }

      /* =====================================================
         🟩 REAL API LOGIN (ORIGINAL — COMMENTED)
         ===================================================== */
      /*
      const response = await axiosnew.post(
        'https://nowcast-ai-backend.onrender.com/api/v1/auth/login',
        formData
      );

      login(response.data.data.token);
      toast.success("Login successful");
      navigate('/overall');
      */

    } catch (error) {
      toast.error("Login failed", {
        description: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
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
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="animate-pulse">Signing in...</span>
        ) : (
          <>
            <LogIn size={18} className="mr-2" />
            Sign In
          </>
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
