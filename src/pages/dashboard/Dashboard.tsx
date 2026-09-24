import React, { useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { MapView } from './MapView';
import { Charts } from './Charts';
import { GIAOptimiser } from './GIAOptimiser';
import { LayoutDashboard, Map, PieChart, Sparkles, LogOut } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuth = localStorage.getItem('jeevanpath_admin_auth');
    if (!isAuth) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jeevanpath_admin_auth');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { path: '/dashboard/map', icon: <Map size={20} />, label: 'Demand Map' },
    { path: '/dashboard/charts', icon: <PieChart size={20} />, label: 'Analytics' },
    { path: '/dashboard/optimiser', icon: <Sparkles size={20} />, label: 'AI Optimiser' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="p-6 border-b border-indigo-800">
          <h1 className="text-2xl font-bold text-white tracking-tight">JeevanPath</h1>
          <p className="text-indigo-300 text-xs mt-1">Govt. Planner Dashboard</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-indigo-800 text-white font-semibold' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-indigo-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-indigo-200 hover:text-white transition w-full"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              AD
            </div>
            <span className="text-sm font-medium text-slate-600">Admin User</span>
          </div>
        </header>
        
        <main className="p-8">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/optimiser" element={<GIAOptimiser />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Simple Overview component
const Overview = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-slate-500 text-sm font-semibold mb-1">Total Beneficiaries (Coimbatore)</h3>
        <p className="text-3xl font-bold text-slate-800">12,450</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-slate-500 text-sm font-semibold mb-1">Top Requested Job</h3>
        <p className="text-3xl font-bold text-slate-800">Electrician</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-slate-500 text-sm font-semibold mb-1">Pending Training Seats</h3>
        <p className="text-3xl font-bold text-amber-600">3,240</p>
      </div>
    </div>
    
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Welcome to JeevanPath Planner</h3>
      <p className="text-slate-600">
        Use the sidebar navigation to view the geographical demand map, analyze skill gaps via analytics charts, 
        and run the AI GIA Optimiser for smart training fund allocation.
      </p>
    </div>
  </div>
);
