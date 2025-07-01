import { useState } from 'react';
import { Card } from "@/components/ui/card";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left Side - Company Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
            NowCast
          </h1>
          <p className="text-xl text-slate-300 font-light tracking-wide">
            forecasting made easy
          </p>
          <div className="mt-12 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/5 rounded-full blur-xl"></div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-900">
        <div className="w-full max-w-md">
          {/* Mobile Company Header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">NowCast</h1>
            <p className="text-slate-400">forecasting made easy</p>
          </div>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </h2>
              <p className="text-slate-400">
                {isLogin 
                  ? 'Sign in to your account to continue' 
                  : 'Create your account to start forecasting'
                }
              </p>
            </div>

            {/* Form Toggle Buttons */}
            <div className="flex mb-3 bg-slate-700/50 p-1 rounded-lg">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  isLogin
                    ? 'bg-slate-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  !isLogin
                    ? 'bg-slate-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Forms with smooth transition */}
            <div className="relative overflow-hidden">
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute inset-0'
                }`}
              >
                {isLogin && <LoginForm />}
              </div>
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  !isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0'
                }`}
              >
                {!isLogin && <RegisterForm />}
              </div>
            </div>

            {/* Bottom Link */}
            <div className="mt-4 text-center">
              <p className="text-slate-400 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
