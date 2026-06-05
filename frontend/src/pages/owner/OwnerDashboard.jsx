import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import api, { API_URL } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  CalendarCheck, 
  PlusCircle,
  Loader2,
  Trash2,
  Edit,
  Music,
  Car,
  Utensils,
  Check,
  X
} from 'lucide-react';

const OwnerDashboard = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Asosiy', path: '/owner', icon: LayoutDashboard },
    { label: 'To\'yxonalarim', path: '/owner/halls', icon: Building2 },
    { label: 'Yangi To\'yxona', path: '/owner/register-hall', icon: PlusCircle },
    { label: 'Bronlar', path: '/owner/bookings', icon: CalendarCheck },
  ];

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
                isActive ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-pink-50'
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
          <Route path="/" element={<OwnerOverview />} />
          <Route path="/halls" element={<MyHalls />} />
          <Route path="/register-hall" element={<RegisterHall />} />
          <Route path="/edit-hall/:id" element={<RegisterHall isEdit={true} />} />
          <Route path="/bookings" element={<OwnerBookings />} />
        </Routes>
      </main>
    </div>
  );
};

const OwnerOverview = () => {
  const [halls, setHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/halls/owner'),
      api.get('/bookings/owner')
    ]).then(([hRes, bRes]) => {
      setHalls(hRes.data);
      setBookings(bRes.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader2 className="animate-spin text-primary" />;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Xush Kelibsiz!</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 bg-pink-50 rounded-2xl border border-pink-100">
          <p className="text-pink-600 font-medium">To'yxonalar</p>
          <p className="text-3xl font-bold">{halls.length}</p>
        </div>
        <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
          <p className="text-green-600 font-medium">Faol Bronlar</p>
          <p className="text-3xl font-bold">{bookings.filter(b => b.status === 'upcoming').length}</p>
        </div>
      </div>
    </div>
  );
};

const MyHalls = () => {
  const [halls, setHalls] = useState([]);
  const navigate = useNavigate();

  const fetchHalls = () => api.get('/halls/owner').then(res => setHalls(res.data));
  useEffect(() => { fetchHalls(); }, []);

  const deleteHall = async (id) => {
    if (!window.confirm('Haqiqatdan ham o\'chirmoqchimisiz?')) return;
    await api.delete(`/halls/${id}`);
    fetchHalls();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mening To'yxonalarim</h2>
      <div className="grid grid-cols-1 gap-4">
        {halls.map(hall => (
          <div key={hall.id} className="p-4 border rounded-xl flex justify-between items-center bg-gray-50">
            <div>
              <p className="font-bold text-lg">{hall.name}</p>
              <p className="text-sm text-gray-500">{hall.address}</p>
              <p className={`text-xs font-bold mt-1 uppercase ${
                hall.status === 'tasdiqlangan' ? 'text-green-600' : 'text-yellow-600'
              }`}>Holat: {hall.status}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate(`/owner/edit-hall/${hall.id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-5 h-5" /></button>
              <button onClick={() => deleteHall(hall.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RegisterHall = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '', description: '', address: '', district: '', capacity: '', price: '', phone: '',
    singers: [], karnaySurnay: { available: false, price: 0 }, menus: [], cars: [], ownerId: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState([]);

  // New item states
  const [newSinger, setNewSinger] = useState({ name: '', price: '' });
  const [newCar, setNewCar] = useState({ brand: '', price: '' });
  const [newMenu, setNewMenu] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/admin/owners').then(res => setOwners(res.data));
    }
    if (isEdit && id) {
      api.get(`/halls/${id}`).then(res => {
        setFormData({ ...res.data, ownerId: res.data.owner?.id || res.data.ownerId || '' });
      });
    }
  }, [isEdit, id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (['singers', 'karnaySurnay', 'menus', 'cars', 'images'].includes(key)) {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });
    images.forEach(img => data.append('images', img));

    try {
      if (isEdit) await api.put(`/halls/${id}`, data);
      else await api.post('/halls', data);
      alert(isEdit ? 'Yangilandi!' : 'Ro\'yxatdan o\'tkazildi! Tasdiqlashni kuting.');
      navigate(user.role === 'admin' ? '/admin/halls' : '/owner/halls');
    } catch (err) { alert('Xatolik'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <h2 className="text-3xl font-black">{isEdit ? 'To\'yxonani Tahrirlash' : 'Yangi To\'yxona Qo\'shish'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <input className="input-field" placeholder="To'yxona Nomi" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <select className="input-field" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} required>
              <option value="">Tumanni tanlang</option>
              {['Yunusobod', 'Chilonzor', 'Mirzo Ulugbek', 'Mirobod', 'Yakkasaroy', 'Shayxontohur', 'Olmazor', 'Sergeli', 'Uchtepa', 'Bektemir', 'Yashnobod', 'Yangihayot'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <input className="input-field" placeholder="Manzil" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
            <input className="input-field" placeholder="Telefon" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
          </div>
          <div className="space-y-4">
            <input className="input-field" type="number" placeholder="Sig'im (kishi)" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required />
            <input className="input-field" type="number" placeholder="Narx (1 o'rindiq uchun)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            <textarea className="input-field" placeholder="Tavsif" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="p-6 bg-gray-50 rounded-3xl">
            <label className="block text-xs font-bold mb-2">EGA BIRIKTIRISH</label>
            <select className="input-field" value={formData.ownerId} onChange={e => setFormData({...formData, ownerId: e.target.value})} required>
              <option value="">Egani tanlang</option>
              {owners.map(o => <option key={o.id} value={o.id}>{o.firstName} {o.lastName} ({o.username})</option>)}
            </select>
          </div>
        )}

        {/* Singers Section */}
        <div className="p-6 border rounded-3xl space-y-4">
          <h4 className="font-bold flex items-center gap-2"><Music className="w-5 h-5" /> Honandalar</h4>
          <div className="flex gap-2">
            <input className="input-field flex-1" placeholder="Ismi" value={newSinger.name} onChange={e => setNewSinger({...newSinger, name: e.target.value})} />
            <input className="input-field w-32" type="number" placeholder="Narxi" value={newSinger.price} onChange={e => setNewSinger({...newSinger, price: e.target.value})} />
            <button type="button" onClick={() => {
              if (newSinger.name && newSinger.price) {
                setFormData({...formData, singers: [...formData.singers, {...newSinger, price: Number(newSinger.price)}]});
                setNewSinger({name: '', price: ''});
              }
            }} className="btn btn-primary">Qo'shish</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.singers.map((s, i) => (
              <div key={i} className="bg-pink-50 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {s.name} ({s.price.toLocaleString()})
                <X className="w-4 h-4 cursor-pointer" onClick={() => setFormData({...formData, singers: formData.singers.filter((_, idx) => idx !== i)})} />
              </div>
            ))}
          </div>
        </div>

        {/* Cars Section */}
        <div className="p-6 border rounded-3xl space-y-4">
          <h4 className="font-bold flex items-center gap-2"><Car className="w-5 h-5" /> Mashinalar</h4>
          <div className="flex gap-2">
            <input className="input-field flex-1" placeholder="Brandi" value={newCar.brand} onChange={e => setNewCar({...newCar, brand: e.target.value})} />
            <input className="input-field w-32" type="number" placeholder="Narxi" value={newCar.price} onChange={e => setNewCar({...newCar, price: e.target.value})} />
            <button type="button" onClick={() => {
              if (newCar.brand && newCar.price) {
                setFormData({...formData, cars: [...formData.cars, {...newCar, price: Number(newCar.price)}]});
                setNewCar({brand: '', price: ''});
              }
            }} className="btn btn-primary">Qo'shish</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.cars.map((c, i) => (
              <div key={i} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {c.brand} ({c.price.toLocaleString()})
                <X className="w-4 h-4 cursor-pointer" onClick={() => setFormData({...formData, cars: formData.cars.filter((_, idx) => idx !== i)})} />
              </div>
            ))}
          </div>
        </div>

        {/* Menus Section */}
        <div className="p-6 border rounded-3xl space-y-4">
          <h4 className="font-bold flex items-center gap-2"><Utensils className="w-5 h-5" /> Taomnomalar</h4>
          <div className="flex gap-2">
            <input className="input-field flex-1" placeholder="Taom varianti nomi" value={newMenu} onChange={e => setNewMenu(e.target.value)} />
            <button type="button" onClick={() => {
              if (newMenu) {
                setFormData({...formData, menus: [...formData.menus, {name: newMenu}]});
                setNewMenu('');
              }
            }} className="btn btn-primary">Qo'shish</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.menus.map((m, i) => (
              <div key={i} className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {m.name}
                <X className="w-4 h-4 cursor-pointer" onClick={() => setFormData({...formData, menus: formData.menus.filter((_, idx) => idx !== i)})} />
              </div>
            ))}
          </div>
        </div>

        {/* Karnay Surnay */}
        <div className="p-6 border rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input type="checkbox" id="karnay-owner" className="w-5 h-5 accent-primary" checked={formData.karnaySurnay.available} onChange={e => setFormData({...formData, karnaySurnay: {...formData.karnaySurnay, available: e.target.checked}})} />
            <label htmlFor="karnay-owner" className="font-bold">Karnay-Surnay mavjud</label>
          </div>
          {formData.karnaySurnay.available && (
            <input className="input-field w-40" type="number" placeholder="Xizmat narxi" value={formData.karnaySurnay.price} onChange={e => setFormData({...formData, karnaySurnay: {...formData.karnaySurnay, price: Number(e.target.value)}})} />
          )}
        </div>

        <div className="p-6 border rounded-3xl space-y-4">
          <label className="block text-xs font-bold mb-2 uppercase flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-primary" /> Suratlar
          </label>
          
          {isEdit && formData.images && formData.images.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mb-4">
              {formData.images.map((img, i) => (
                <div key={i} className="relative group aspect-square">
                  <img 
                    src={img.startsWith('http') ? img : `${API_URL}${img}`} 
                    className="w-full h-full object-cover rounded-xl border border-gray-200" 
                  />
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, images: formData.images.filter((_, idx) => idx !== i)})}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative group">
            <input 
              type="file" 
              multiple 
              onChange={e => setImages(Array.from(e.target.files))} 
              className="hidden" 
              id="file-upload"
            />
            <label 
              htmlFor="file-upload" 
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-3xl cursor-pointer bg-gray-50 hover:bg-pink-50 hover:border-primary transition-all"
            >
              <PlusCircle className="w-8 h-8 text-gray-400 group-hover:text-primary mb-2" />
              <p className="text-sm text-gray-500 font-bold">{images.length > 0 ? `${images.length} ta rasm tanlandi` : 'Yangi rasmlar yuklash'}</p>
              <p className="text-[10px] text-gray-400 uppercase mt-1">PNG, JPG yoki WebP</p>
            </label>
          </div>
        </div>

        <button className="w-full bg-primary hover:bg-pink-800 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50" disabled={loading}>
          {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (isEdit ? 'SAQLASH' : 'RO\'YXATDAN O\'TKAZISH')}
        </button>
      </form>
    </div>
  );
};

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [sortDate, setSortDate] = useState('date_asc');
  const [filterStatus, setFilterStatus] = useState('');
  
  const fetchBookings = () => {
    const params = new URLSearchParams({ sort: sortDate, status: filterStatus });
    api.get(`/bookings/owner?${params.toString()}`).then(res => setBookings(res.data));
  };
  
  useEffect(() => { fetchBookings(); }, [sortDate, filterStatus]);

  const cancelBooking = async (id) => {
    if (!window.confirm('Bronni bekor qilmoqchimisiz?')) return;
    await api.put(`/bookings/${id}/cancel`);
    fetchBookings();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mening Bronlarim</h2>
      <div className="flex gap-4 bg-gray-50 p-4 rounded-xl">
        <select className="input-field w-48" value={sortDate} onChange={e => setSortDate(e.target.value)}>
          <option value="date_asc">Sana bo'yicha</option>
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
              <th className="px-4 py-3">To'yxona</th>
              <th className="px-4 py-3">Sana</th>
              <th className="px-4 py-3">Sig'im</th>
              <th className="px-4 py-3">Mijoz</th>
              <th className="px-4 py-3">Holat</th>
              <th className="px-4 py-3 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {bookings.map(booking => (
              <tr key={booking.id} className="hover:bg-gray-50">
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

export default OwnerDashboard;
