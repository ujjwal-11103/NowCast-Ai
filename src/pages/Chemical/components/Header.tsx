import { Building2, Bell, User } from 'lucide-react';
import AppSwitcher from '../../../components/AppSwitcher';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AppSwitcher />
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Sales Analytics</h1>
              <p className="text-xs text-gray-500">Sales Feedback Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Sarah Williams</p>
                <p className="text-xs text-gray-500">Sales Manager</p>
              </div>
              <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-slate-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
