import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
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
  SlidersHorizontal
} from 'lucide-react';

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
  ];

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-pink-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </aside>

      <main className="flex-1 bg-white p-8 rounded-2xl shadow-sm min-h-[600px]">
        <Routes>
          <Route path="/" element={<Overview stats={stats} />} />
          <Route path="/halls" element={<ManageHalls />} />
          <Route path="/owners" element={<ManageOwners />} />
          <Route path="/add-owner" element={<AddOwner />} />
          <Route path="/bookings" element={<ManageBookings />} />
        </Routes>
      </main>
    </div>
  );
};

const Overview = ({ stats }) => {
  const [seeding, setSeeding] = useState(false);
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tizim Statistikasi</h2>
        <button 
          onClick={handleSeed} 
          disabled={seeding}
          className="btn btn-secondary text-sm flex items-center gap-2"
        >
          {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Namuna ma\'lumotlarni qo\'shish'}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label="Jami To'yxonalar" value={stats.totalHalls} icon={Building2} color="bg-blue-500" />
        <StatCard label="Jami Bronlar" value={stats.totalBookings} icon={CalendarCheck} color="bg-green-500" />
        <StatCard label="To'yxona Egalari" value={stats.totalOwners} icon={Users} color="bg-purple-500" />
        <StatCard label="Mijozlar" value={stats.totalCustomers} icon={TrendingUp} color="bg-pink-500" />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-xl text-white ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
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
      const params = new URLSearchParams({ search, district: filterDistrict, status: filterStatus, sort: sortOption });
      const res = await api.get(`/halls?${params.toString()}`);
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
      await api.put(`/halls/${id}`, { status });
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">To'yxonalarni Boshqarish</h2>
        <button onClick={() => navigate('/owner/register-hall')} className="btn btn-primary">Yangi Qo'shish</button>
      </div>

      <div className="flex flex-wrap gap-4 bg-gray-50 p-4 rounded-xl">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input 
            className="input-field pl-10" 
            placeholder="Nomi bo'yicha qidirish..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchHalls()}
          />
        </div>
        <select className="input-field w-40" value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)}>
          <option value="">Barcha tumanlar</option>
          <option value="Yunusobod">Yunusobod</option>
          <option value="Chilonzor">Chilonzor</option>
          <option value="Mirzo Ulugbek">Mirzo Ulugbek</option>
          <option value="Mirobod">Mirobod</option>
          <option value="Yakkasaroy">Yakkasaroy</option>
          <option value="Shayxontohur">Shayxontohur</option>
          <option value="Olmazor">Olmazor</option>
          <option value="Sergeli">Sergeli</option>
          <option value="Uchtepa">Uchtepa</option>
          <option value="Bektemir">Bektemir</option>
          <option value="Yashnobod">Yashnobod</option>
          <option value="Yangihayot">Yangihayot</option>
        </select>
        <select className="input-field w-40" value={sortOption} onChange={e => setSortOption(e.target.value)}>
          <option value="">Sortlash</option>
          <option value="price_asc">Narx bo'yicha (O'sish)</option>
          <option value="price_desc">Narx bo'yicha (Kamayish)</option>
          <option value="capacity_asc">Sig'im bo'yicha (O'sish)</option>
          <option value="capacity_desc">Sig'im bo'yicha (Kamayish)</option>
          <option value="district_asc">Tuman bo'yicha (A-Z)</option>
          <option value="status_asc">Holat bo'yicha</option>
        </select>
        <select className="input-field w-40" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Barcha holatlar</option>
          <option value="tasdiqlangan">Tasdiqlangan</option>
          <option value="tasdiqlanmagan">Tasdiqlanmagan</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-4 py-3">Nomi</th>
              <th className="px-4 py-3">Ega</th>
              <th className="px-4 py-3">Tuman</th>
              <th className="px-4 py-3">Sig'im</th>
              <th className="px-4 py-3">Holat</th>
              <th className="px-4 py-3 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {halls.map(hall => (
              <tr key={hall.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 font-medium cursor-pointer text-blue-600 hover:underline" onClick={() => viewDetails(hall)}>{hall.name}</td>
                <td className="px-4 py-4 text-sm">{hall.owner?.firstName} {hall.owner?.lastName}</td>
                <td className="px-4 py-4 text-sm">{hall.district}</td>
                <td className="px-4 py-4 text-sm">{hall.capacity}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    hall.status === 'tasdiqlangan' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {hall.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right space-x-2">
                  <button onClick={() => navigate(`/owner/edit-hall/${hall.id}`)} className="text-blue-600 hover:text-blue-800"><Edit className="w-5 h-5" /></button>
                  {hall.status === 'tasdiqlanmagan' && (
                    <button onClick={() => updateStatus(hall.id, 'tasdiqlangan')} className="text-green-600 hover:text-green-800"><CheckCircle className="w-5 h-5" /></button>
                  )}
                  <button onClick={() => deleteHall(hall.id)} className="text-gray-400 hover:text-red-600">O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedHall && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{selectedHall.name}</h2>
                <p className="text-gray-500">{selectedHall.district}, {selectedHall.address}</p>
              </div>
              <button onClick={() => setSelectedHall(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-2xl">
                <p className="text-xs text-blue-600 font-bold">SIG'IM</p>
                <p className="text-2xl font-bold">{selectedHall.capacity} kishi</p>
              </div>
              <div className="p-4 bg-green-50 rounded-2xl">
                <p className="text-xs text-green-600 font-bold">NARX</p>
                <p className="text-2xl font-bold">{selectedHall.price.toLocaleString()} so'm</p>
              </div>
            </div>

            <h3 className="font-bold text-lg mb-4">Bo'sh va Band Qilingan Kunlar</h3>
            <div className="grid grid-cols-7 gap-2 mb-6">
              {['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'].map(day => (
                <div key={day} className="text-center font-bold text-gray-600 text-xs">{day}</div>
              ))}
              {Array.from({length: 35}, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - date.getDay() + 1 + i - 6);
                const dateStr = date.toISOString().split('T')[0];
                const today = new Date().toISOString().split('T')[0];
                const isBooked = hallBookings.find(b => b.date.split('T')[0] === dateStr);
                const isPast = dateStr < today;
                
                return (
                  <div 
                    key={i}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer relative group ${
                      isPast ? 'bg-gray-200 text-gray-500' :
                      isBooked ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'
                    }`}
                  >
                    {date.getDate()}
                    {isBooked && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                        {isBooked.customerFirstName} {isBooked.customerLastName} ({isBooked.seatsCount} kishi)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <h3 className="font-bold text-lg mb-4">Band Qilingan Bronlar</h3>
            {hallBookings.length > 0 ? (
              <div className="space-y-3">
                {hallBookings.map(booking => (
                  <div key={booking.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{new Date(booking.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">{booking.customerFirstName} {booking.customerLastName}</p>
                        <p className="text-xs text-gray-500">{booking.customerPhone}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{booking.seatsCount} o'rindiq</p>
                        <p className={`text-xs font-bold uppercase ${
                          booking.status === 'upcoming' ? 'text-blue-600' : 'text-green-600'
                        }`}>{booking.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Hali bronlar yo'q</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ManageOwners = () => {
  const [owners, setOwners] = useState([]);
  useEffect(() => {
    api.get('/admin/owners').then(res => setOwners(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">To'yxona Egalari</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {owners.map(owner => (
          <div key={owner.id} className="p-4 border rounded-xl flex items-center gap-4 bg-gray-50">
            <div className="p-3 bg-white rounded-full"><Users className="w-6 h-6 text-primary" /></div>
            <div>
              <p className="font-bold">{owner.firstName} {owner.lastName}</p>
              <p className="text-sm text-gray-500">{owner.username} | {owner.email}</p>
              <p className="text-xs text-gray-400">Tuman: {owner.district}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
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
    <div className="max-w-md space-y-6">
      <h2 className="text-2xl font-bold">Yangi Ega Ro'yxatdan O'tkazish</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input className="input-field" placeholder="Ism" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
          <input className="input-field" placeholder="Familiya" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
        </div>
        <input className="input-field" placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
        <input className="input-field" type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
        <input className="input-field" type="password" placeholder="Parol" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
        <select className="input-field" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} required>
          <option value="">Tumanni tanlang</option>
          <option value="Yunusobod">Yunusobod</option>
          <option value="Chilonzor">Chilonzor</option>
          <option value="Mirzo Ulugbek">Mirzo Ulugbek</option>
          <option value="Mirobod">Mirobod</option>
          <option value="Yakkasaroy">Yakkasaroy</option>
          <option value="Shayxontohur">Shayxontohur</option>
          <option value="Olmazor">Olmazor</option>
          <option value="Sergeli">Sergeli</option>
          <option value="Uchtepa">Uchtepa</option>
          <option value="Bektemir">Bektemir</option>
          <option value="Yashnobod">Yashnobod</option>
          <option value="Yangihayot">Yangihayot</option>
        </select>
        <button className="btn btn-primary w-full py-3" disabled={loading}>
          {loading ? 'Qo\'shilmoqda...' : 'Egani Qo\'shish'}
        </button>
      </form>
    </div>
  );
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [sortOption, setSortOption] = useState('date_asc');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchBookings = () => {
    const params = new URLSearchParams({ sort: sortOption, status: filterStatus });
    api.get(`/bookings/all?${params.toString()}`).then(res => setBookings(res.data));
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Barcha Bronlar</h2>
      
      <div className="flex gap-4 bg-gray-50 p-4 rounded-xl">
        <select className="input-field w-48" value={sortOption} onChange={e => setSortOption(e.target.value)}>
          <option value="date_asc">Sana bo'yicha (O'sish)</option>
          <option value="date_desc">Sana bo'yicha (Kamayish)</option>
          <option value="hall_asc">To'yxona bo'yicha (A-Z)</option>
          <option value="hall_desc">To'yxona bo'yicha (Z-A)</option>
          <option value="rayon_asc">Tuman bo'yicha (A-Z)</option>
          <option value="rayon_desc">Tuman bo'yicha (Z-A)</option>
          <option value="status_asc">Holat bo'yicha</option>
        </select>
        <select className="input-field w-48" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Barcha holatlar</option>
          <option value="upcoming">Endi bo'ladigan</option>
          <option value="completed">Bo'lib o'tgan</option>
          <option value="cancelled">Bekor qilingan</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">To'yxona</th>
              <th className="px-4 py-3">Sana</th>
              <th className="px-4 py-3">O'rindiq</th>
              <th className="px-4 py-3">Mijoz</th>
              <th className="px-4 py-3">Holat</th>
              <th className="px-4 py-3 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {bookings.map(booking => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 font-mono text-xs">{booking.id.slice(-6)}</td>
                <td className="px-4 py-4 font-medium">{booking.hall?.name}</td>
                <td className="px-4 py-4">{new Date(booking.date).toLocaleDateString()}</td>
                <td className="px-4 py-4">{booking.seatsCount}</td>
                <td className="px-4 py-4">
                  {booking.customerFirstName} {booking.customerLastName}<br/>
                  <span className="text-xs text-gray-400">{booking.customerPhone}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    booking.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                    booking.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  {booking.status === 'upcoming' && (
                    <button onClick={() => cancelBooking(booking.id)} className="text-red-600 hover:underline">Bekor qilish</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
