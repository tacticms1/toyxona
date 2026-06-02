import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Users, MapPin, Phone, CheckCircle2, Loader2, Calendar as CalendarIcon, Music, Car, Utensils, Info } from 'lucide-react';
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

  const handleDateClick = (info) => {
    const today = new Date().toISOString().split('T')[0];
    if (info.dateStr < today) return;
    const isBooked = bookings.find(b => b.date.split('T')[0] === info.dateStr);
    if (isBooked) return;
    setSelectedDate(info.dateStr);
  };

  const calculateTotal = () => {
    if (!hall || !seatsCount) return 0;
    let total = Number(seatsCount) * hall.price;
    if (selectedSinger) total += selectedSinger.price;
    if (selectedCar) total += selectedCar.price;
    if (karnayRequested && hall.karnaySurnay) total += hall.karnaySurnay.price || 0;
    return total;
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
      backgroundColor: '#fee2e2', // Red for booked
      extendedProps: { booking: b }
    })),
    // Past dates
    {
      start: '2000-01-01',
      end: new Date().toISOString().split('T')[0],
      display: 'background',
      backgroundColor: '#f3f4f6', // Gray for past
    }
  ];

  return (
    <motion.div className="max-w-6xl mx-auto space-y-8 pb-20" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: 'easeOut' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="h-[400px] rounded-3xl overflow-hidden shadow-2xl relative group">
            <img 
              src={hall.images[0] ? `http://localhost:5000${hall.images[0]}` : 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt={hall.name}
            />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl font-bold shadow-lg text-primary uppercase tracking-wider text-xs">
              {hall.district}
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-black text-gray-900 mb-2">{hall.name}</h1>
                <div className="flex items-center gap-4 text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{hall.address}</span>
                  </div>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hall.name + ' ' + hall.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-primary hover:underline uppercase tracking-widest flex items-center gap-1"
                  >
                    Xaritada ko'rish
                  </a>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 uppercase font-bold tracking-widest">1 o'rindiq</p>
                <p className="text-3xl font-black text-primary">{hall.price.toLocaleString()} so'm</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-xs text-gray-400 font-bold">SIG'IM</p>
                  <p className="font-bold">{hall.capacity} kishi</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                <Phone className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-xs text-gray-400 font-bold">ALOQA</p>
                  <p className="font-bold">{hall.phone}</p>
                </div>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed text-lg">{hall.description}</p>
          </div>

          {/* Services Selection */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2 px-2">
              <Info className="w-6 h-6 text-primary" />
              Qo'shimcha Xizmatlar
            </h3>
            
            {/* Singers */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="font-bold mb-4 flex items-center gap-2"><Music className="w-5 h-5 text-primary" /> Honandalar</h4>
              {hall.singers && hall.singers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hall.singers.map((singer, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedSinger(selectedSinger?.name === singer.name ? null : singer)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedSinger?.name === singer.name ? 'border-primary bg-pink-50' : 'border-gray-50 hover:border-pink-200'}`}
                    >
                      <p className="font-bold">{singer.name}</p>
                      <p className="text-sm text-primary font-black">{singer.price.toLocaleString()} so'm</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Honandalar mavjud emas</p>
              )}
            </div>

            {/* Cars */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="font-bold mb-4 flex items-center gap-2"><Car className="w-5 h-5 text-primary" /> Mashinalar</h4>
              {hall.cars && hall.cars.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hall.cars.map((car, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedCar(selectedCar?.brand === car.brand ? null : car)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedCar?.brand === car.brand ? 'border-primary bg-pink-50' : 'border-gray-50 hover:border-pink-200'}`}
                    >
                      <p className="font-bold">{car.brand || car.name}</p>
                      <p className="text-sm text-primary font-black">{car.price.toLocaleString()} so'm</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Mashinalar mavjud emas</p>
              )}
            </div>

            {/* Menu */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="font-bold mb-4 flex items-center gap-2"><Utensils className="w-5 h-5 text-primary" /> Taomnomalar</h4>
              {hall.menus && hall.menus.length > 0 ? (
                <select className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-primary transition-colors" value={selectedMenu} onChange={e => setSelectedMenu(e.target.value)}>
                  <option value="">Taomnomani tanlang</option>
                  {hall.menus.map((menu, i) => (
                    <option key={i} value={menu.name}>{menu.name} ({menu.price?.toLocaleString()}so'm)</option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-400 text-sm">Taomnomalar mavjud emas</p>
              )}
            </div>

            {/* Karnay Surnay */}
            {hall.karnaySurnay?.available && (
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="karnay"
                    className="w-5 h-5 accent-primary" 
                    checked={karnayRequested} 
                    onChange={e => setKarnayRequested(e.target.checked)} 
                  />
                  <label htmlFor="karnay" className="font-bold">Karnay-Surnay xizmati</label>
                </div>
                <p className="font-black text-primary">{hall.karnaySurnay.price.toLocaleString()} so'm</p>
              </div>
            )}
          </div>
        </div>

        {/* Booking & Calendar */}
        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-primary" />
              Sana Tanlang
            </h3>
            <div className="calendar-container relative">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale="uz"
                dateClick={handleDateClick}
                events={events}
                eventMouseEnter={(info) => {
                  if (info.event.extendedProps.booking) {
                    setHoveredBooking(info.event.extendedProps.booking);
                  }
                }}
                eventMouseLeave={() => setHoveredBooking(null)}
                headerToolbar={{ left: 'prev', center: 'title', right: 'next' }}
                height="auto"
              />
              {hoveredBooking && (
                <div className="absolute top-0 right-0 z-50 bg-gray-900 text-white p-4 rounded-2xl shadow-2xl w-64 animate-in fade-in zoom-in-95">
                  <p className="font-bold mb-1">{hoveredBooking.customerFirstName} {hoveredBooking.customerLastName}</p>
                  <p className="text-xs opacity-70 mb-2">{hoveredBooking.customerPhone}</p>
                  <div className="h-[1px] bg-white/20 mb-2"></div>
                  <p className="text-sm">Sig'im: <span className="font-bold">{hoveredBooking.seatsCount} kishi</span></p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div> Band</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div> O'tgan</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white border-2 border-primary rounded"></div> Erkin</div>
            </div>
          </div>

          {selectedDate && (
            <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-2xl space-y-6 animate-in slide-in-from-bottom-6">
              <h3 className="text-2xl font-bold">Band qilish</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">O'RINDIQLAR SONI</label>
                  <input 
                    type="number" 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    placeholder="Masalan: 200"
                    value={seatsCount}
                    onChange={e => setSeatsCount(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">ISM</label>
                    <input 
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      value={customerInfo.firstName}
                      onChange={e => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">FAMILIYA</label>
                    <input 
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      value={customerInfo.lastName}
                      onChange={e => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">TELEFON</label>
                  <input 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    placeholder="+998 90 123 45 67"
                    value={customerInfo.phone}
                    onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-3">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Asosiy summa:</span>
                  <span>{((Number(seatsCount) || 0) * hall.price).toLocaleString()} so'm</span>
                </div>
                {(selectedSinger || selectedCar || karnayRequested) && (
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Xizmatlar uchun:</span>
                    <span>{(calculateTotal() - (Number(seatsCount) || 0) * hall.price).toLocaleString()} so'm</span>
                  </div>
                )}
                <div className="flex justify-between text-2xl font-black text-primary pt-2">
                  <span>Jami:</span>
                  <span>{calculateTotal().toLocaleString()} so'm</span>
                </div>
              </div>

              <button 
                onClick={handleBooking}
                className="w-full bg-primary hover:bg-pink-800 text-white py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-primary/20"
              >
                Bron Qilish
              </button>
            </div>
          )}
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-10 shadow-2xl">
            <h2 className="text-3xl font-black mb-4">Tasdiqlash</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              <span className="font-bold text-gray-900">{selectedDate}</span> sanasiga band qilishni tasdiqlash uchun jami summaning <span className="text-primary font-bold">20% (beh)</span> miqdorida oldindan to'lov talab qilinadi.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-3xl mb-8 space-y-3 border border-gray-100">
              <div className="flex justify-between text-gray-500"><span>Jami summa:</span> <span className="font-bold text-gray-900">{calculateTotal().toLocaleString()} so'm</span></div>
              <div className="flex justify-between text-primary text-xl font-black pt-2 border-t border-gray-200">
                <span>Avans (20%):</span> <span>{(calculateTotal() * 0.2).toLocaleString()} so'm</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Bekor qilish
              </button>
              <button 
                onClick={confirmBooking}
                disabled={bookingLoading}
                className="bg-primary hover:bg-pink-800 text-white py-4 rounded-2xl font-bold transition-all active:scale-95 flex justify-center items-center gap-2"
              >
                {bookingLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "To'lov qilish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HallDetails;
