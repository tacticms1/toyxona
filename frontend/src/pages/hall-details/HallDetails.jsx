import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { API_URL } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Users, MapPin, Phone, CheckCircle2, Loader2, Calendar as CalendarIcon, Music, Car, Utensils, Info, X } from 'lucide-react';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const HallDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [seatsCount, setSeatsCount] = useState('');
  const [customerInfo, setCustomerInfo] = useState({ firstName: '', lastName: '', phone: '' });
  const [selectedSinger, setSelectedSinger] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState('');
  const [karnayRequested, setKarnayRequested] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hoveredBooking, setHoveredBooking] = useState(null);
  const [recommendedHalls, setRecommendedHalls] = useState([]);
  const [recommendLoading, setRecommendLoading] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 Fetching hall:', id);
        const hallRes = await api.get(`/halls/${id}`);
        console.log('✅ Hall fetched:', hallRes.data);
        setHall(hallRes.data);
        
        try {
          const bookingsRes = await api.get(`/bookings/hall/${id}`);
          setBookings(bookingsRes.data);
        } catch (err) {
          console.warn('⚠️ Bookings fetch failed (non-critical):', err.message);
          setBookings([]);
        }
        
        if (user) {
          setCustomerInfo({ 
            firstName: user.firstName || '', 
            lastName: user.lastName || '', 
            phone: user.phone || '' 
          });
        }
      } catch (err) {
        console.error('❌ Error fetching hall:', err);
        setError(err.response?.data?.message || err.message || 'Xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleDateClick = async (info) => {
    const today = new Date().toISOString().split('T')[0];
    if (info.dateStr < today) {
      alert('O\'tgan sanalarni tanlab bo\'lmaydi');
      return;
    }
    const isBooked = bookings.find(b => b.date.split('T')[0] === info.dateStr);
    if (isBooked) {
      // Fetch recommendations
      setRecommendLoading(true);
      try {
        const res = await api.get(`/halls/available?date=${info.dateStr}&excludeId=${id}`);
        setRecommendedHalls(res.data);
        setSelectedDate(null);
      } catch (err) {
        console.error('Recommendations error:', err);
      } finally {
        setRecommendLoading(false);
      }
      return;
    }
    setSelectedDate(info.dateStr);
    setRecommendedHalls([]);
    
    // Scroll to booking form
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const calculateTotal = () => {
    if (!hall || !seatsCount) return 0;
    let total = Number(seatsCount) * hall.price;
    if (selectedSinger) total += selectedSinger.price;
    if (selectedCar) total += selectedCar.price;
    if (karnayRequested && hall.karnaySurnay) total += hall.karnaySurnay.price || 0;
    return total;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.includes('hall_') && imagePath.endsWith('.jfif')) {
      return imagePath;
    }
    return `${API_URL}${imagePath}`;
  };

  const handleBooking = async () => {
    if (!selectedDate) return alert('Iltimos, sanani tanlang');
    if (!seatsCount || seatsCount < 1) return alert('Iltimos, odam sonini kiriting');
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.phone) return alert('Iltimos, mijoz ma\'lumotlarini to\'ldiring');
    setShowPaymentModal(true);
  };

  const confirmBooking = async () => {
    setBookingLoading(true);
    try {
      const selectedServices = {
        singers: selectedSinger ? [{ name: selectedSinger.name, price: selectedSinger.price }] : [],
        karnaySurnay: { available: karnayRequested, price: karnayRequested ? (hall.karnaySurnay?.price || 0) : 0 },
        menu: selectedMenu,
        car: selectedCar ? { brand: selectedCar.brand || selectedCar.name, price: selectedCar.price } : null
      };

      await api.post('/bookings', {
        hallId: id,
        date: selectedDate,
        seatsCount,
        customerFirstName: customerInfo.firstName,
        customerLastName: customerInfo.lastName,
        customerPhone: customerInfo.phone,
        selectedServices,
        totalPrice: calculateTotal()
      });
      alert('Muvaffaqiyatli to\'landi!');
      navigate(user ? '/customer' : '/');
    } catch (err) {
      alert(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setBookingLoading(false);
      setShowPaymentModal(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  
  if (error) return (
    <div className="max-w-2xl mx-auto py-20 text-center">
      <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8">
        <p className="text-red-600 text-lg font-bold mb-2">❌ Xatolik</p>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-6 px-6 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors"
        >
          Bosh sahifaga qaytish
        </button>
      </div>
    </div>
  );
  
  if (!hall) return (
    <div className="max-w-2xl mx-auto py-20 text-center">
      <p className="text-gray-500 text-lg font-bold">To'yxona topilmadi</p>
    </div>
  );

  const events = [
    ...bookings.map(b => ({
      start: b.date.split('T')[0],
      display: 'background',
      backgroundColor: '#ef4444', // Qizil - band
      extendedProps: { booking: b }
    })),
    // Selected date highlight
    ...(selectedDate ? [{
      start: selectedDate,
      display: 'background',
      backgroundColor: '#f59e0b', // Tillarang - tanlangan
    }] : []),
    // Past dates
    {
      start: '2000-01-01',
      end: new Date().toISOString().split('T')[0],
      display: 'background',
      backgroundColor: '#1e293b', // To'q ko'k - o'tgan
    }
  ];

  return (
    <motion.div className="max-w-6xl mx-auto space-y-8 pb-20 text-slate-100" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: 'easeOut' }}>
      <style>{`
        .fc { --fc-border-color: #334155; --fc-button-bg-color: #0f172a; --fc-button-border-color: #334155; --fc-button-hover-bg-color: #1e293b; --fc-page-bg-color: transparent; }
        .fc .fc-toolbar-title { color: #f1f5f9; font-weight: 800; font-size: 1.25rem; }
        .fc .fc-col-header-cell-cushion { color: #94a3b8; font-size: 0.75rem; text-transform: uppercase; font-weight: 800; padding: 12px 0; }
        .fc .fc-daygrid-day-number { color: #f1f5f9; font-weight: 600; padding: 8px; }
        .fc .fc-day-other .fc-daygrid-day-number { opacity: 0.3; }
        .fc .fc-daygrid-day.fc-day-today { background: rgba(245, 158, 11, 0.05) !important; }
        .fc-theme-standard td, .fc-theme-standard th { border-color: #1e293b !important; }
        .fc .fc-button-primary:disabled { background-color: #0f172a; border-color: #1e293b; opacity: 0.5; }
        .fc .fc-button-primary:not(:disabled):active, .fc .fc-button-primary:not(:disabled).fc-button-active { background-color: #f59e0b; border-color: #f59e0b; color: #000; }
        .fc .fc-daygrid-day { cursor: pointer; transition: all 0.2s; position: relative; z-index: 2; }
        .fc .fc-daygrid-day:hover { background: rgba(245, 158, 11, 0.15) !important; }
        .fc .fc-bg-event { pointer-events: none !important; z-index: 1; }
        .fc .fc-highlight { background: rgba(245, 158, 11, 0.3) !important; }
        .fc .fc-daygrid-day-frame { position: relative; z-index: 3; pointer-events: auto; }
        .fc-theme-standard td, .fc-theme-standard th { border-color: #1e293b !important; }
      `}</style>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl relative group border border-slate-800">
            <img 
              src={getImageUrl(hall.images[0])} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt={hall.name}
            />
            <div className="absolute top-6 left-6 bg-slate-900/90 backdrop-blur-md px-5 py-2.5 rounded-2xl font-black shadow-xl text-amber-400 uppercase tracking-widest text-xs border border-amber-400/20">
              {hall.district}
            </div>
          </div>
          
          <div className="bg-slate-950/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-800/50 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{hall.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-400">
                  <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-800">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold">{hall.address}</span>
                  </div>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hall.name + ' ' + hall.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-black text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-[0.15em] flex items-center gap-1.5"
                  >
                    Xaritada ko'rish
                  </a>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-[2px] rounded-3xl shadow-lg shadow-amber-900/20">
                <div className="bg-slate-950 px-6 py-4 rounded-[calc(1.5rem-2px)] text-right">
                  <p className="text-[10px] text-amber-400/70 uppercase font-black tracking-[0.2em] mb-1">1 o'rindiq</p>
                  <p className="text-3xl font-black text-white">{hall.price.toLocaleString()} <span className="text-sm font-bold text-slate-400">so'm</span></p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-800/50 flex items-center gap-4 group hover:border-amber-400/30 transition-all">
                <div className="p-3 bg-slate-950 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">SIG'IM</p>
                  <p className="text-lg font-black text-slate-100">{hall.capacity} kishi</p>
                </div>
              </div>
              <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-800/50 flex items-center gap-4 group hover:border-amber-400/30 transition-all">
                <div className="p-3 bg-slate-950 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">ALOQA</p>
                  <p className="text-lg font-black text-slate-100">{hall.phone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] ml-1">Tavsif</p>
              <p className="text-slate-300 leading-relaxed text-lg font-medium">{hall.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black flex items-center gap-3 px-2 text-white uppercase tracking-tight">
              <Info className="w-6 h-6 text-amber-400" />
              Qo'shimcha Xizmatlar
            </h3>
            
            <div className="bg-slate-950/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800/50 shadow-2xl space-y-8">
              <div className="space-y-6">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Music className="w-5 h-5 text-amber-400" /> Honandalar
                </h4>
                {hall.singers && hall.singers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {hall.singers.map((singer, i) => (
                      <div 
                        key={i} 
                        onClick={() => setSelectedSinger(selectedSinger?.name === singer.name ? null : singer)}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${selectedSinger?.name === singer.name ? 'border-amber-400 bg-amber-400/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-600'}`}
                      >
                        <span className="font-bold text-slate-100">{singer.name}</span>
                        <span className="text-sm text-amber-400 font-black">{singer.price.toLocaleString()} so'm</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm font-medium italic">Honandalar mavjud emas</p>
                )}
              </div>

              <div className="h-[1px] bg-slate-800/50 w-full"></div>

              <div className="space-y-6">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Car className="w-5 h-5 text-amber-400" /> Mashinalar
                </h4>
                {hall.cars && hall.cars.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {hall.cars.map((car, i) => (
                      <div 
                        key={i} 
                        onClick={() => setSelectedCar(selectedCar?.brand === car.brand ? null : car)}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${selectedCar?.brand === car.brand ? 'border-amber-400 bg-amber-400/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-600'}`}
                      >
                        <span className="font-bold text-slate-100">{car.brand || car.name}</span>
                        <span className="text-sm text-amber-400 font-black">{car.price.toLocaleString()} so'm</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm font-medium italic">Mashinalar mavjud emas</p>
                )}
              </div>

              <div className="h-[1px] bg-slate-800/50 w-full"></div>

              <div className="space-y-6">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Utensils className="w-5 h-5 text-amber-400" /> Taomnomalar
                </h4>
                {hall.menus && hall.menus.length > 0 ? (
                  <select className="w-full px-5 py-4 bg-slate-900 border-2 border-slate-800 rounded-2xl text-slate-100 font-bold focus:outline-none focus:border-amber-400 transition-all appearance-none" value={selectedMenu} onChange={e => setSelectedMenu(e.target.value)}>
                    <option value="" className="bg-slate-900">Taomnomani tanlang</option>
                    {hall.menus.map((menu, i) => (
                      <option key={i} value={menu.name} className="bg-slate-900">{menu.name} ({menu.price?.toLocaleString()} so'm)</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-slate-500 text-sm font-medium italic">Taomnomalar mavjud emas</p>
                )}
              </div>

              {hall.karnaySurnay?.available && (
                <>
                  <div className="h-[1px] bg-slate-800/50 w-full"></div>
                  <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 flex items-center justify-between group hover:border-amber-400/30 transition-all">
                    <div className="flex items-center gap-4">
                      <input 
                        type="checkbox" 
                        id="karnay"
                        className="w-6 h-6 rounded-lg accent-amber-500 cursor-pointer" 
                        checked={karnayRequested} 
                        onChange={e => setKarnayRequested(e.target.checked)} 
                      />
                      <label htmlFor="karnay" className="font-bold text-slate-100 cursor-pointer">Karnay-Surnay xizmati</label>
                    </div>
                    <p className="font-black text-amber-400">{hall.karnaySurnay.price.toLocaleString()} so'm</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          <div className="bg-slate-950/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-800/50 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <CalendarIcon className="w-6 h-6 text-amber-400" /> Sana Tanlang
              </h3>
              {hoveredBooking && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-8 right-8 z-50 bg-amber-500 text-black px-4 py-2 rounded-xl text-xs font-bold shadow-2xl border border-amber-400"
                >
                  <p>Band qilgan: {hoveredBooking.customerFirstName}</p>
                  <p>Telefon: {hoveredBooking.customerPhone}</p>
                </motion.div>
              )}
            </div>
            
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale="uz"
              firstDay={1}
              headerToolbar={{ left: 'prev', center: 'title', right: 'next' }}
              events={events}
              dateClick={handleDateClick}
              height="auto"
              eventMouseEnter={(info) => {
                if (info.event.extendedProps.booking) {
                  setHoveredBooking(info.event.extendedProps.booking);
                }
              }}
              eventMouseLeave={() => setHoveredBooking(null)}
            />

            <div className="mt-8 flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> Band
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 text-slate-400 rounded-xl border border-slate-700">
                <div className="w-2 h-2 rounded-full bg-slate-600"></div> O'tgan
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-400/20">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div> Erkin
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          {recommendedHalls.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-amber-500/30 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-amber-400 uppercase tracking-tight">Shu kunga bo'sh to'yxonalar</h3>
                <button onClick={() => setRecommendedHalls([])} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendedHalls.map(h => (
                    <Link key={h.id} to={`/halls/${h.id}`} className="group bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all flex gap-4">
                      <img 
                        src={getImageUrl(h.images[0])} 
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                    <div className="flex-1">
                      <p className="font-bold text-white group-hover:text-amber-400 transition-colors">{h.name}</p>
                      <p className="text-xs text-slate-500 mb-2">{h.district}</p>
                      <p className="text-sm font-black text-amber-500">{h.price.toLocaleString()} so'm</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {selectedDate && (
            <div className="bg-slate-950 p-8 md:p-10 rounded-[2.5rem] shadow-2xl border-2 border-amber-400/30 space-y-8 animate-in slide-in-from-bottom-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Band qilish</h3>
                  <div className="bg-amber-400 text-black px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">{selectedDate}</div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">O'RINDIQLAR SONI</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-amber-400 transition-all"
                      placeholder="Odam sonini kiriting..."
                      value={seatsCount}
                      onChange={e => setSeatsCount(e.target.value)}
                    />
                  </div>

                  {!user && (
                    <div className="space-y-4 pt-2">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-1 text-center">Mijoz Ma'lumotlari</p>
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          placeholder="Ism" 
                          className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-amber-400 transition-all"
                          value={customerInfo.firstName}
                          onChange={e => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                        />
                        <input 
                          type="text" 
                          placeholder="Familiya" 
                          className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-amber-400 transition-all"
                          value={customerInfo.lastName}
                          onChange={e => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                        />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Telefon raqam" 
                        className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-amber-400 transition-all"
                        value={customerInfo.phone}
                        onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      />
                    </div>
                  )}
                </div>

                <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
                    <span>Jami summa:</span>
                    <span className="text-2xl text-white font-black">{calculateTotal().toLocaleString()} so'm</span>
                  </div>
                  <button 
                    onClick={handleBooking}
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-black py-5 rounded-2xl transition-all shadow-xl shadow-amber-900/20 uppercase tracking-widest text-sm active:scale-[0.98]"
                  >
                    Band qilish va To'lash
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowPaymentModal(false)} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative z-10 max-w-md w-full text-center space-y-8">
            <div className="w-24 h-24 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-amber-400" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-white uppercase tracking-tight">To'lovni Tasdiqlang</h3>
              <p className="text-slate-400 font-medium">Siz <span className="text-white font-bold">{calculateTotal().toLocaleString()} so'm</span> miqdorida to'lovni amalga oshirmoqchisiz.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowPaymentModal(false)} className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs">Bekor qilish</button>
              <button onClick={confirmBooking} disabled={bookingLoading} className="px-6 py-4 bg-amber-400 hover:bg-amber-300 text-black font-black rounded-2xl transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                {bookingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tasdiqlash'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default HallDetails;
