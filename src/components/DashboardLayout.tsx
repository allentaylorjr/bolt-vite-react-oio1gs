import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Video, Library, Mic2, Settings, Code, ChevronRight, LogOut, ExternalLink, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

const DashboardLayout = () => {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showChurchMenu, setShowChurchMenu] = useState(false);
  const [churchName, setChurchName] = useState<string>('');
  const [churchLogo, setChurchLogo] = useState<string>('');
  const [churchSlug, setChurchSlug] = useState<string>('');

  useEffect(() => {
    const fetchChurchDetails = async () => {
      if (!user?.user_metadata?.church_id) return;

      const { data, error } = await supabase
        .from('churches')
        .select('name, logo_url, slug')
        .eq('id', user.user_metadata.church_id)
        .single();

      if (!error && data) {
        setChurchName(data.name);
        setChurchLogo(data.logo_url || '');
        setChurchSlug(data.slug);
      }
    };

    fetchChurchDetails();
  }, [user?.user_metadata?.church_id]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handlePreview = () => {
    if (churchSlug) {
      navigate(`/${churchSlug}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm flex flex-col">
        {/* Church Profile Section - Moved to top */}
        <div className="h-[57px] flex items-center px-4 border-b border-gray-100">
          <div className="relative w-full">
            <button
              onClick={() => setShowChurchMenu(!showChurchMenu)}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {churchLogo ? (
                <img
                  src={churchLogo}
                  alt={churchName}
                  className="w-6 h-6 mr-3 rounded object-contain"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-6 h-6 mr-3 rounded bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold">
                    {churchName.charAt(0)}
                  </span>
                </div>
              )}
              <span className="flex-1 truncate">{churchName}</span>
              <ChevronUp
                className={`h-5 w-5 transition-transform ${
                  showChurchMenu ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showChurchMenu && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                <button
                  onClick={handlePreview}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Site
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {[
            { path: '/dashboard/sermons', icon: Video, label: 'Sermons' },
            { path: '/dashboard/series', icon: Library, label: 'Series' },
            { path: '/dashboard/speakers', icon: Mic2, label: 'Speakers' },
            { path: '/dashboard/embed', icon: Code, label: 'Embed' },
            { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
          ].map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="h-5 w-5 mr-3" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <span className="text-gray-500">Dashboard</span>
                </li>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <li>
                  <span className="text-gray-900 font-medium">
                    {location.pathname.split('/').pop()?.charAt(0).toUpperCase() + location.pathname.split('/').pop()?.slice(1)}
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;