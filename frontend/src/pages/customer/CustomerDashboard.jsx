import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { API_URL } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  CalendarCheck, MapPin, Clock, XCircle, Loader2,
  Building2, CheckCircle, Ban, Sparkles, ChevronRight,
  Phone, CreditCard, Music, Car, Utensils
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm('Haqiqatdan ham ushbu bandni bekor qilmoqchimisiz?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      fetchBookings();
      setSelected(null);
    } catch {
      alert('Bekor qilishda xatolik yuz berdi');
    }
  };

  const upcoming = bookings.filter(b => b.status === 'upcoming');
  const past = bookings.filter(b => b.status !== 'upcoming');

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-amber-400" />
      <p className="text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Yuklanmoqda...</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-10 pb-20 text-slate-100"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-amber-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-3 h-3" /> Shaxsiy Kabinet
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Salom, {user?.firstName}!
          </h1>
          <p className="text-slate-500 font-bold mt-1 text-sm">Barcha buyurtmalaringiz</p>
        </div>
        <div className="flex gap-3">
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-center">
            <p className="text-2xl font-black text-amber-400">{upcoming.length}</p>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Kelgusi</p>
          </div>
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-center">
            <p className="text-2xl font-black text-emerald-400">{past.filter(b=>b.status==='completed').length}</p>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Yakunlangan</p>
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-slate-950/80 rounded-[2.5rem] border border-dashed border-slate-700 p-20 text-center space-y-6">
          <CalendarCheck className="w-20 h-20 text-slate-800 mx-auto" />
          <div>
            <p className="text-xl font-black text-white uppercase tracking-tight">Hali buyurtma yo'q</p>
            <p className="text-slate-500 font-bold mt-2 text-sm">Birinchi buyurtmangizni qiling!</p>
          </div>
          <Link to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20"
          >
            <Building2 className="w-5 h-5" /> To'yxonalarni Ko'rish
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <Section title="Kelgusi Buyurtmalar" icon={<Clock className="w-5 h-5 text-blue-400" />} count={upcoming.length}>
              {upcoming.map((b, i) => (
                <BookingCard key={b.id} booking={b} index={i} onClick={() => setSelected(b)} />
              ))}
            </Section>
          )}
          {past.length > 0 && (
            <Section title="O'tgan Buyurtmalar" icon={<CheckCircle className="w-5 h-5 text-slate-500" />} count={past.length}>
              {past.map((b, i) => (
                <BookingCard key={b.id} booking={b} index={i} onClick={() => setSelected(b)} />
              ))}
            </Section>
          )}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setSelected(null)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl relative z-10 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selected.hall?.name}</h2>
                    <p className="text-xs text-slate-500 font-bold mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {selected.hall?.district} • {selected.hall?.address}
                    </p>
                  </div>
                  <button onClick={() => setSelected(null)}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white transition-all">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                {/* Hall image */}
                {selected.hall?.images?.[0] && (
                  <div className="h-40 rounded-2xl overflow-hidden">
                    <img
                      src={selected.hall.images[0].startsWith('http') ? selected.hall.images[0] : `${API_URL}${selected.hall.images[0]}`}
                      className="w-full h-full object-cover"
                      onError={e => e.target.src='https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80'}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <InfoCell label="Sana" value={new Date(selected.date).toLocaleDateString('uz-UZ', { year:'numeric', month:'long', day:'numeric' })} icon={<CalendarCheck className="w-4 h-4 text-amber-400" />} />
                  <InfoCell label="O'rindiqlar" value={`${selected.seatsCount} ta`} icon={<Building2 className="w-4 h-4 text-blue-400" />} />
                  <InfoCell label="Aloqa" value={selected.hall?.phone} icon={<Phone className="w-4 h-4 text-emerald-400" />} />
                  <InfoCell label="Jami summa" value={`${Number(selected.totalPrice).toLocaleString()} so'm`} icon={<CreditCard className="w-4 h-4 text-pink-400" />} />
                </div>

                {/* Selected services */}
                {selected.selectedServices && (
                  <div className="space-y-3">
                    {selected.selectedServices.singers?.length > 0 && (
                      <ServiceTag icon={<Music className="w-3.5 h-3.5" />} color="purple">
                        {selected.selectedServices.singers.map(s => s.name).join(', ')}
                      </ServiceTag>
                    )}
                    {selected.selectedServices.car && (
                      <ServiceTag icon={<Car className="w-3.5 h-3.5" />} color="blue">
                        {selected.selectedServices.car.brand}
                      </ServiceTag>
                    )}
                    {selected.selectedServices.menu && (
                      <ServiceTag icon={<Utensils className="w-3.5 h-3.5" />} color="emerald">
                        {selected.selectedServices.menu}
                      </ServiceTag>
                    )}
                    {selected.selectedServices.karnaySurnay?.available && (
                      <ServiceTag icon={<Sparkles className="w-3.5 h-3.5" />} color="amber">
                        Karnay-Surnay
                      </ServiceTag>
                    )}
                  </div>
                )}

                <StatusBadgeLarge status={selected.status} />

                {selected.status === 'upcoming' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => cancelBooking(selected.id)}
                    className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <Ban className="w-5 h-5" /> Bekor Qilish
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Booking Card ─── */
const BookingCard = ({ booking, index, onClick }) => {
  const getImageUrl = (img) => {
    if (!img) return null;
    return img.startsWith('http') ? img : `${API_URL}${img}`;
  };

  const statusConfig = {
    upcoming: { cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Kelgusida' },
    completed: { cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Yakunlangan' },
    cancelled: { cls: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Bekor' },
  };
  const sc = statusConfig[booking.status] || statusConfig.cancelled;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="flex items-center gap-5 p-5 bg-slate-950 border border-slate-800 rounded-[2rem] hover:border-amber-500/20 transition-all group cursor-pointer"
    >
      {/* Hall image */}
      <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-900 border border-slate-800">
        {booking.hall?.images?.[0] ? (
          <img
            src={getImageUrl(booking.hall.images[0])}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={e => e.target.src='https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&q=80'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-slate-700" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-black text-white uppercase text-sm truncate">{booking.hall?.name}</p>
        <p className="text-xs text-slate-500 font-bold mt-0.5 flex items-center gap-1 truncate">
          <MapPin className="w-3 h-3 flex-shrink-0" /> {booking.hall?.district}
        </p>
        <p className="text-xs text-amber-400 font-black mt-1.5">
          {new Date(booking.date).toLocaleDateString('uz-UZ')} • {booking.seatsCount} o'rindiq
        </p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border hidden sm:flex items-center ${sc.cls}`}>
          {sc.label}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
      </div>
    </motion.div>
  );
};

/* ─── Helpers ─── */
const Section = ({ title, icon, count, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 px-1">
      {icon}
      <h2 className="text-sm font-black text-white uppercase tracking-widest">{title}</h2>
      <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-black text-slate-500 uppercase">{count}</span>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

const InfoCell = ({ label, value, icon }) => (
  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">{icon} {label}</p>
    <p className="text-sm font-black text-white leading-tight">{value}</p>
  </div>
);

const ServiceTag = ({ icon, color, children }) => {
  const colors = {
    purple: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    blue: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  };
  return (
    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold ${colors[color]}`}>
      {icon} {children}
    </div>
  );
};

const StatusBadgeLarge = ({ status }) => {
  const cfg = {
    upcoming: { cls: 'bg-blue-500/10 border-blue-500/20 text-blue-400', label: 'Kelgusida', icon: <Clock className="w-5 h-5" /> },
    completed: { cls: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', label: 'Yakunlangan', icon: <CheckCircle className="w-5 h-5" /> },
    cancelled: { cls: 'bg-red-500/10 border-red-500/20 text-red-400', label: 'Bekor qilingan', icon: <Ban className="w-5 h-5" /> },
  };
  const c = cfg[status] || cfg.cancelled;
  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl border ${c.cls}`}>
      {c.icon}
      <span className="font-black text-sm uppercase tracking-wide">{c.label}</span>
    </div>
  );
};

export default CustomerDashboard;
