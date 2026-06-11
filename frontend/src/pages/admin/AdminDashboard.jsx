import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import api, { API_URL } from '../../api/axios';
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarCheck,
  UserPlus,
  Loader2,
  TrendingUp,
  CheckCircle,
  XCircle,
  Edit,
  Search,
  SlidersHorizontal,
  Trash2,
  ShieldCheck,
  ChevronRight,
  Database,
  RefreshCw,
  X,
  PlusCircle,
  BadgeCheck,
  ShieldAlert,
  ShieldX,
  Eye,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const navItems = [
    { label: 'Umumiy', path: '/admin', icon: LayoutDashboard },
    { label: 'To\'yxonalar', path: '/admin/halls', icon: Building2 },
    { label: 'Egalar', path: '/admin/owners', icon: Users },
    { label: 'Ega Qo\'shish', path: '/admin/add-owner', icon: UserPlus },
    { label: 'Barcha Bronlar', path: '/admin/bookings', icon: CalendarCheck },
    { label: 'Verifikatsiya', path: '/admin/verifications', icon: BadgeCheck },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-amber-400" />
      <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Admin Panel Yuklanmoqda...</p>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-10 min-h-screen text-slate-100 pb-20">
      {/* Modern Sidebar */}
      <aside className="w-full lg:w-72 space-y-4">
        <div className="bg-slate-950/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl sticky top-24">
          <div className="flex items-center gap-3 px-4 mb-10">
            <div className="p-2.5 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="font-black text-white leading-tight uppercase tracking-tight">Admin</h2>
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.2em]">Boshqaruv Paneli</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between group px-5 py-4 rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-xl shadow-amber-500/20' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'group-hover:text-amber-400'}`} />
                    <span className="font-black text-sm uppercase tracking-wide">{item.label}</span>
                  </div>
                  {isActive && <motion.div layoutId="activeNav" className="w-1.5 h-1.5 bg-black rounded-full" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-8">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Overview stats={stats} />} />
            <Route path="/halls" element={<ManageHalls />} />
            <Route path="/owners" element={<ManageOwners />} />
            <Route path="/add-owner" element={<AddOwner />} />
            <Route path="/bookings" element={<ManageBookings />} />
            <Route path="/verifications" element={<ManageVerifications />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

const Overview = ({ stats }) => {
  const [seeding, setSeeding] = useState(false);
  const [reseting, setReseting] = useState(false);

  const handleSeed = async () => {
    if (!window.confirm('Namuna ma\'lumotlarni qo\'shmoqchimisiz?')) return;
    setSeeding(true);
    try {
      await api.post('/admin/seed');
      alert('Ma\'lumotlar qo\'shildi! Sahifani yangilang.');
      window.location.reload();
    } catch (err) { alert('Xatolik yuz berdi'); }
    finally { setSeeding(false); }
  };

  const handleReset = async () => {
    if (!window.confirm('DIQQAT! Barcha bronlar o\'chiriladi. Bu amalni qaytarib bo\'lmaydi. Rozimisiz?')) return;
    setReseting(true);
    try {
      await api.post('/admin/reset-bookings');
      alert('Barcha bronlar o\'chirildi!');
      window.location.reload();
    } catch (err) { alert('Xatolik yuz berdi'); }
    finally { setReseting(false); }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Dashboard</h1>
          <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-[10px]">Tizimning umumiy holati</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset} 
            disabled={reseting}
            className="flex items-center gap-2 px-6 py-3.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/5"
          >
            {reseting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Bronlarni Tozalash
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSeed} 
            disabled={seeding}
            className="flex items-center gap-2 px-6 py-3.5 bg-amber-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20"
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            Namuna Ma'lumotlar
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="To'yxonalar" value={stats.totalHalls} icon={Building2} gradient="from-blue-500/20 to-indigo-500/20" iconColor="text-blue-400" />
        <StatCard label="Jami Bronlar" value={stats.totalBookings} icon={CalendarCheck} gradient="from-emerald-500/20 to-teal-500/20" iconColor="text-emerald-400" />
        <StatCard label="Egalar" value={stats.totalOwners} icon={Users} gradient="from-purple-500/20 to-pink-500/20" iconColor="text-purple-400" />
        <StatCard label="Mijozlar" value={stats.totalCustomers} icon={TrendingUp} gradient="from-amber-500/20 to-orange-500/20" iconColor="text-amber-400" />
      </div>

      {/* Recent Activity placeholder or visual chart area */}
      <div className="bg-slate-950/80 backdrop-blur-xl p-10 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <h3 className="text-xl font-black text-white mb-8 uppercase tracking-tight flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-amber-500" /> O'sish Ko'rsatkichlari
        </h3>
        <div className="h-64 flex items-end gap-4 px-4">
          {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 100].map((h, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, duration: 0.8, ease: "easeOut" }}
              className="flex-1 bg-gradient-to-t from-amber-500/10 to-amber-500/40 rounded-t-lg border-x border-t border-amber-500/20"
            />
          ))}
        </div>
        <div className="flex justify-between mt-6 px-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <span>Yan</span><span>Fev</span><span>Mar</span><span>Apr</span><span>May</span><span>Iyun</span><span>Iyul</span><span>Avg</span><span>Sen</span><span>Okt</span><span>Noy</span><span>Dek</span>
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ label, value, icon: Icon, gradient, iconColor }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`p-8 rounded-[2.5rem] bg-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden group`}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
    <div className="relative z-10 flex flex-col justify-between h-full">
      <div className={`p-4 rounded-2xl bg-slate-900 w-fit mb-6 shadow-inner border border-slate-800 ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-4xl font-black text-white tracking-tighter">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  </motion.div>
);

const ManageHalls = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [selectedHall, setSelectedHall] = useState(null);
  const [hallBookings, setHallBookings] = useState([]);
  const navigate = useNavigate();

  const fetchHalls = async () => {
    try {
      const params = new URLSearchParams({ search, district: filterDistrict, status: filterStatus });
      const res = await api.get(`/admin/halls?${params.toString()}`);
      setHalls(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchHalls(); }, [search, filterDistrict, filterStatus, sortOption]);

  const viewDetails = async (hall) => {
    setSelectedHall(hall);
    try {
      const res = await api.get(`/bookings/hall/${hall.id}`);
      setHallBookings(res.data);
    } catch (err) {
      setHallBookings([]);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/halls/${id}/status`, { status });
      fetchHalls();
    } catch (err) { alert('Holatni yangilab bo\'lmadi'); }
  };

  const deleteHall = async (id) => {
    if (!window.confirm('Haqiqatdan ham o\'chirmoqchimisiz?')) return;
    try {
      await api.delete(`/halls/${id}`);
      fetchHalls();
    } catch (err) { alert('O\'chirishda xatolik'); }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">To'yxonalar</h1>
          <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-[10px]">Barcha ro'yxatdan o'tgan maskanlar</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/owner/register-hall')} 
          className="flex items-center gap-2 px-8 py-4 bg-amber-500 text-black rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-amber-500/20"
        >
          <PlusCircle className="w-5 h-5" /> Yangi Qo'shish
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950/50 p-4 rounded-3xl border border-slate-800">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
          <input 
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold text-white placeholder-slate-600 outline-none focus:border-amber-500/50 transition-all" 
            placeholder="Qidirish..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-xs font-black text-slate-400 uppercase tracking-widest outline-none focus:border-amber-500/50 appearance-none" value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)}>
          <option value="">Barcha tumanlar</option>
          {['Yunusobod', 'Chilonzor', 'Mirzo Ulugbek', 'Mirobod', 'Yakkasaroy', 'Shayxontohur', 'Olmazor', 'Sergeli', 'Uchtepa', 'Bektemir', 'Yashnobod', 'Yangihayot'].map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-xs font-black text-slate-400 uppercase tracking-widest outline-none focus:border-amber-500/50 appearance-none" value={sortOption} onChange={e => setSortOption(e.target.value)}>
          <option value="">Sortlash</option>
          <option value="price_asc">Narx (Arzon)</option>
          <option value="price_desc">Narx (Qimmat)</option>
          <option value="capacity_asc">Sig'im (Kam)</option>
          <option value="capacity_desc">Sig'im (Ko'p)</option>
        </select>
        <select className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-xs font-black text-slate-400 uppercase tracking-widest outline-none focus:border-amber-500/50 appearance-none" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Barcha holatlar</option>
          <option value="tasdiqlangan">Tasdiqlangan</option>
          <option value="tasdiqlanmagan">Kutilmoqda</option>
        </select>
      </div>

      <div className="bg-slate-950/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">To'yxona</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Joylashuv</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Sig'im</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Holat</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {halls.map((hall, idx) => (
                <motion.tr 
                  key={hall.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-900/30 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <img 
                          src={hall.images[0]?.startsWith('http') ? hall.images[0] : `${api.defaults.baseURL.replace('/api', '')}${hall.images[0]}`} 
                          className="w-full h-full object-cover" 
                          onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80'}
                        />
                      </div>
                      <div>
                        <p className="font-black text-white group-hover:text-amber-400 transition-colors cursor-pointer" onClick={() => viewDetails(hall)}>{hall.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{hall.owner?.firstName} {hall.owner?.lastName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{hall.district}</p>
                  </td>
                  <td className="px-8 py-6 font-mono text-xs text-amber-500/80 font-black">{hall.capacity} KISHI</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      hall.status === 'tasdiqlangan' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {hall.status === 'tasdiqlangan' ? 'TASDIQLANDI' : 'KUTILMOQDA'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => navigate(`/owner/edit-hall/${hall.id}`)} className="p-2 hover:bg-blue-500/20 hover:text-blue-400 rounded-xl transition-all"><Edit className="w-4 h-4" /></button>
                      {hall.status === 'tasdiqlanmagan' && (
                        <button onClick={() => updateStatus(hall.id, 'tasdiqlangan')} className="p-2 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-xl transition-all"><CheckCircle className="w-4 h-4" /></button>
                      )}
                      <button onClick={() => deleteHall(hall.id)} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Modal for Details */}
      <AnimatePresence>
        {selectedHall && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setSelectedHall(null)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl relative z-10 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-10 overflow-y-auto space-y-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-4xl font-black text-white tracking-tight uppercase">{selectedHall.name}</h2>
                    <p className="text-amber-500 font-bold mt-1 uppercase tracking-[0.2em] text-xs">{selectedHall.district} • {selectedHall.address}</p>
                  </div>
                  <button onClick={() => setSelectedHall(null)} className="p-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all shadow-xl"><X className="w-6 h-6" /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">SIG'IM</p>
                    <p className="text-2xl font-black text-white">{selectedHall.capacity} kishi</p>
                  </div>
                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">NARX</p>
                    <p className="text-2xl font-black text-white">{selectedHall.price.toLocaleString()} so'm</p>
                  </div>
                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">ALOQA</p>
                    <p className="text-2xl font-black text-white">{selectedHall.phone}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                    <CalendarCheck className="w-6 h-6 text-amber-500" /> Band Qilingan Bronlar
                  </h3>
                  {hallBookings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {hallBookings.map(booking => (
                        <div key={booking.id} className="p-6 bg-slate-950 border border-slate-800 rounded-[2rem] flex justify-between items-center group hover:border-amber-500/30 transition-all">
                          <div>
                            <p className="text-lg font-black text-white">{new Date(booking.date).toLocaleDateString('uz-UZ', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{booking.customerFirstName} {booking.customerLastName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-amber-500">{booking.seatsCount} o'rindiq</p>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{booking.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center bg-slate-950/50 rounded-[2rem] border border-dashed border-slate-800">
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Ushbu to'yxonada hali bronlar mavjud emas</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ManageOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/owners').then(res => {
      setOwners(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">To'yxona Egalari</h1>
          <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-[10px]">Tizimda ro'yxatdan o'tgan hamkorlar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {owners.map((owner, idx) => (
          <motion.div 
            key={owner.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 bg-slate-950 border border-slate-800 rounded-[2.5rem] shadow-2xl flex items-center gap-6 group hover:border-amber-500/30 transition-all"
          >
            <div className="p-5 bg-slate-900 rounded-3xl group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xl font-black text-white truncate uppercase">{owner.firstName} {owner.lastName}</p>
              <p className="text-slate-500 font-bold text-xs truncate mt-1">{owner.email}</p>
              <div className="flex items-center gap-2 mt-4">
                <span className="px-3 py-1 bg-slate-900 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-800">{owner.district || "Hudud noma'lum"}</span>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-500/20">Hamkor</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-amber-500 transition-colors" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const AddOwner = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', username: '', email: '', password: '', district: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/add-owner', formData);
      alert('Ega muvaffaqiyatli qo\'shildi!');
      setFormData({ firstName: '', lastName: '', username: '', email: '', password: '', district: '' });
    } catch (err) { alert(err.response?.data?.message || 'Xatolik'); }
    finally { setLoading(false); }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="max-w-2xl mx-auto"
    >
      <div className="bg-slate-950 border border-slate-800 p-12 rounded-[3rem] shadow-2xl space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="text-center space-y-2 relative z-10">
          <h2 className="text-4xl font-black text-white tracking-tight uppercase">Ega Qo'shish</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Yangi hamkorni ro'yxatdan o'tkazish</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ism</label>
              <input className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-amber-500 transition-all" placeholder="Masalan: Aziz" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Familiya</label>
              <input className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-amber-500 transition-all" placeholder="Masalan: Rahimov" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Foydalanuvchi Nomi</label>
            <input className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-amber-500 transition-all" placeholder="Username tanlang" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Manzil</label>
            <input className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-amber-500 transition-all" type="email" placeholder="example@gmail.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Parol</label>
            <input className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-amber-500 transition-all" type="password" placeholder="********" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hudud</label>
            <select className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-black text-slate-400 uppercase tracking-widest outline-none focus:border-amber-500 appearance-none" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} required>
              <option value="">Tumanni tanlang</option>
              {['Yunusobod', 'Chilonzor', 'Mirzo Ulugbek', 'Mirobod', 'Yakkasaroy', 'Shayxontohur', 'Olmazor', 'Sergeli', 'Uchtepa', 'Bektemir', 'Yashnobod', 'Yangihayot'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-amber-500 text-black py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-xl shadow-amber-500/20 mt-4 disabled:opacity-50" 
            disabled={loading}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Hamkorni Ro\'yxatdan O\'tkazish'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [sortOption, setSortOption] = useState('date_asc');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    const params = new URLSearchParams({ sort: sortOption, status: filterStatus });
    try {
      const res = await api.get(`/bookings/all?${params.toString()}`);
      setBookings(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, [sortOption, filterStatus]);

  const cancelBooking = async (id) => {
    if (!window.confirm('Bronni bekor qilmoqchimisiz?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) { alert('Xatolik'); }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Bronlar</h1>
          <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-[10px]">Tizimdagi barcha faol va o'tgan bronlar</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-3xl border border-slate-800">
        <select className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest outline-none focus:border-amber-500 appearance-none" value={sortOption} onChange={e => setSortOption(e.target.value)}>
          <option value="date_asc">Sana bo'yicha (Yaqin)</option>
          <option value="date_desc">Sana bo'yicha (Uzoq)</option>
          <option value="hall_asc">To'yxona (A-Z)</option>
          <option value="rayon_asc">Tuman (A-Z)</option>
        </select>
        <select className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest outline-none focus:border-amber-500 appearance-none" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Barcha holatlar</option>
          <option value="upcoming">Kelgusida</option>
          <option value="completed">Yakunlangan</option>
          <option value="cancelled">Bekor qilingan</option>
        </select>
      </div>

      <div className="bg-slate-950/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">ID</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">To'yxona</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Sana</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Mijoz</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Holat</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {bookings.map((booking, idx) => (
                <motion.tr 
                  key={booking.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="hover:bg-slate-900/30 transition-colors group"
                >
                  <td className="px-8 py-6 font-mono text-[10px] text-slate-600">#{booking.id.slice(-6).toUpperCase()}</td>
                  <td className="px-8 py-6">
                    <p className="font-black text-white uppercase text-xs">{booking.hall?.name}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-widest">{booking.hall?.district}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-amber-500/80">{new Date(booking.date).toLocaleDateString('uz-UZ')}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-white">{booking.customerFirstName} {booking.customerLastName}</p>
                    <p className="text-[9px] text-slate-500 font-bold mt-1 tracking-tighter">{booking.customerPhone}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      booking.status === 'upcoming' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      booking.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {booking.status === 'upcoming' && (
                      <button onClick={() => cancelBooking(booking.id)} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all opacity-40 group-hover:opacity-100"><XCircle className="w-4 h-4" /></button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const ManageVerifications = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchVerifications = () => {
    setLoading(true);
    api.get('/admin/verifications').then(r => setVerifications(r.data)).finally(() => setLoading(false));
  };
  useEffect(fetchVerifications, []);

  const approve = async (id) => {
    setActionLoading(true);
    try {
      await api.put(`/admin/verifications/${id}/approve`);
      fetchVerifications();
      setSelected(null);
    } catch (e) { alert('Xatolik'); }
    finally { setActionLoading(false); }
  };

  const reject = async (id) => {
    if (!rejectNote.trim()) { alert("Rad etish sababini kiriting"); return; }
    setActionLoading(true);
    try {
      await api.put(`/admin/verifications/${id}/reject`, { note: rejectNote });
      setShowRejectModal(null);
      setRejectNote('');
      fetchVerifications();
      setSelected(null);
    } catch (e) { alert('Xatolik'); }
    finally { setActionLoading(false); }
  };

  const statusBadge = (status) => {
    if (status === 'approved') return { cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Tasdiqlangan', icon: <BadgeCheck className="w-3 h-3" /> };
    if (status === 'submitted') return { cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Kutilmoqda', icon: <ShieldAlert className="w-3 h-3 animate-pulse" /> };
    return { cls: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Rad etildi', icon: <ShieldX className="w-3 h-3" /> };
  };

  const pending = verifications.filter(v => v.status === 'submitted');
  const others = verifications.filter(v => v.status !== 'submitted');

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-amber-400" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Yuklanmoqda...</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Verifikatsiyalar</h1>
        <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-[10px]">
          {pending.length} ta kutilmoqda • {verifications.length} ta jami
        </p>
      </div>

      {verifications.length === 0 ? (
        <div className="bg-slate-950/80 rounded-[2.5rem] border border-dashed border-slate-700 p-20 text-center">
          <BadgeCheck className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Hali hujjat yuborilmagan</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Ko'rib chiqish kutilmoqda ({pending.length})
              </p>
              {pending.map((v, i) => <VerificationRow key={v.id} v={v} onView={() => setSelected(v)} statusBadge={statusBadge} delay={i * 0.06} />)}
            </div>
          )}
          {others.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ko'rib chiqilganlar ({others.length})</p>
              {others.map((v, i) => <VerificationRow key={v.id} v={v} onView={() => setSelected(v)} statusBadge={statusBadge} delay={i * 0.04} />)}
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setSelected(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl relative z-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                      {selected.owner?.firstName} {selected.owner?.lastName}
                    </h2>
                    <p className="text-slate-500 font-bold text-xs mt-1 uppercase tracking-widest">
                      {selected.owner?.email} • {selected.owner?.district}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {(() => { const b = statusBadge(selected.status); return (
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${b.cls}`}>
                        {b.icon} {b.label}
                      </span>
                    ); })()}
                    <button onClick={() => setSelected(null)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white transition-all">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">JSHSHIR (PINFL)</p>
                    <p className="text-lg font-black text-white font-mono">{selected.pinfl}</p>
                  </div>
                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">TELEFON</p>
                    <p className="text-lg font-black text-white">{selected.phone}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Yuborilgan hujjatlar</p>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Passport', src: selected.passportPhoto },
                      { label: "To'yxona hujjati", src: selected.hallDoc },
                      { label: 'Passport bilan selfie', src: selected.selfieWithPassport },
                    ].map(doc => (
                      <div key={doc.label} className="space-y-2">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{doc.label}</p>
                        <a href={doc.src?.startsWith('http') ? doc.src : `${API_URL}${doc.src}`} target="_blank" rel="noreferrer"
                          className="block relative aspect-square rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/40 transition-all group"
                        >
                          <img src={doc.src?.startsWith('http') ? doc.src : `${API_URL}${doc.src}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={e => e.target.src='https://via.placeholder.com/200x200?text=Rasm'} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-6 h-6 text-white" />
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {selected.adminNote && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Admin izohi</p>
                    <p className="text-sm text-slate-300 font-bold">{selected.adminNote}</p>
                  </div>
                )}

                {selected.status !== 'approved' && (
                  <div className="flex gap-4 pt-2">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => approve(selected.id)} disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50"
                    >
                      {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle className="w-5 h-5" /> Tasdiqlash</>}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => { setShowRejectModal(selected.id); }}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                    >
                      <ShieldX className="w-5 h-5" /> Rad etish
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reject note modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setShowRejectModal(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-red-500/30 rounded-[2.5rem] shadow-2xl relative z-10 w-full max-w-md p-8 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/10 rounded-2xl">
                  <MessageSquare className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="font-black text-white uppercase tracking-tight">Rad etish sababi</h3>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">Owner ko'radi</p>
                </div>
              </div>
              <textarea
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder-slate-600 outline-none focus:border-red-500/60 transition-all resize-none"
                placeholder="Masalan: Passport rasmi noaniq, qayta yuboring..."
                rows={4}
                value={rejectNote}
                onChange={e => setRejectNote(e.target.value)}
                autoFocus
              />
              <div className="flex gap-3">
                <button onClick={() => setShowRejectModal(null)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                  Bekor
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => reject(showRejectModal)} disabled={actionLoading}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Rad Etish'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const VerificationRow = ({ v, onView, statusBadge, delay }) => {
  const b = statusBadge(v.status);
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="flex items-center justify-between p-6 bg-slate-950 border border-slate-800 rounded-[2rem] hover:border-amber-500/20 transition-all group cursor-pointer"
      onClick={onView}
    >
      <div className="flex items-center gap-5">
        <div className={`p-3 rounded-2xl border ${b.cls}`}>{b.icon && <BadgeCheck className="w-5 h-5" />}</div>
        <div>
          <p className="font-black text-white uppercase text-sm">{v.owner?.firstName} {v.owner?.lastName}</p>
          <p className="text-xs text-slate-500 font-bold mt-0.5">{v.owner?.email} • PINFL: {v.pinfl}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
            {new Date(v.createdAt).toLocaleDateString('uz-UZ')}
          </p>
          {v.adminNote && <p className="text-[9px] text-red-400 font-bold mt-0.5 max-w-[120px] truncate">{v.adminNote}</p>}
        </div>
        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${b.cls}`}>
          {b.icon} {b.label}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
