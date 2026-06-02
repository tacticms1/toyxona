import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, LogIn, UserPlus, LogOut, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (user.role === 'admin') return '/admin';
    if (user.role === 'owner') return '/owner';
    return '/customer';
  };

  return (
    <nav className="bg-slate-950/95 backdrop-blur-3xl sticky top-0 z-50 border-b border-slate-800 shadow-lg shadow-slate-900/20">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group hover:scale-105 transition-transform duration-300">
          <div className="p-2.5 bg-slate-900 rounded-[1.2rem] group-hover:shadow-xl group-hover:shadow-amber-200/20 transition-all duration-300">
            <svg className="w-6 h-6 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-100 tracking-tight">ShadiHub</span>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest -mt-1">TO'Y XONALARI</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          <Link to="/" className="relative text-slate-200 font-semibold hover:text-amber-300 transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-amber-300 after:rounded-full hover:after:w-full after:transition-all after:duration-300">
            To'yxonalar
          </Link>
          <Link to="/about" className="relative text-slate-200 font-semibold hover:text-amber-300 transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-amber-300 after:rounded-full hover:after:w-full after:transition-all after:duration-300">
            Biz haqimizda
          </Link>
          <Link to="/contact" className="relative text-slate-200 font-semibold hover:text-amber-300 transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-amber-300 after:rounded-full hover:after:w-full after:transition-all after:duration-300">
            Bog'lanish
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-5">
              <Link 
                to={getDashboardPath()} 
                className="flex items-center gap-2 px-4 py-2.5 text-slate-200 hover:text-amber-300 font-bold transition-all duration-300 hover:bg-slate-900 rounded-xl"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="hidden sm:inline">Kabinet</span>
              </Link>
              
              <div className="h-8 w-[1px] bg-slate-700"></div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-amber-300 font-bold shadow-sm border border-slate-700">
                  {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                </div>
                <button onClick={handleLogout} title="Chiqish" className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-all duration-300">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-5 py-2.5 font-bold text-slate-200 hover:text-amber-300 hover:bg-slate-900 rounded-lg transition-all duration-300">
                Kirish
              </Link>
              <Link to="/register" className="bg-gradient-to-r from-slate-800 to-amber-500 hover:from-slate-700 hover:to-amber-400 text-white font-bold px-7 py-2.5 rounded-xl transition-all duration-300 active:scale-95 shadow-lg shadow-slate-900/40">
                Ro'yxatdan o'tish
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
