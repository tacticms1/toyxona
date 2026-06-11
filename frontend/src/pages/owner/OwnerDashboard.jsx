import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import api, { API_URL } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Building2, CalendarCheck, PlusCircle, Loader2, Trash2, Edit,
  Music, Car, Utensils, X, Upload, ImagePlus, CheckCircle, Clock, ChevronRight,
  Star, XCircle, MapPin, FileText, ShieldCheck, ShieldAlert, ShieldX,
  BadgeCheck, AlertTriangle, Send, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DISTRICTS = [
  'Yunusobod','Chilonzor','Mirzo Ulugbek','Mirobod',
  'Yakkasaroy','Shayxontohur','Olmazor','Sergeli',
  'Uchtepa','Bektemir','Yashnobod','Yangihayot'
];

/* ─── Verification status helper ─── */
const useVerification = () => {
  const [verification, setVerification] = useState(undefined); // undefined = loading
  const refresh = () =>
    api.get('/owner/verification').then(r => setVerification(r.data)).catch(() => setVerification(null));
  useEffect(() => { refresh(); }, []);
  return { verification, refresh };
};

/* ─── Main Layout ─── */
const OwnerDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { verification } = useVerification();

  const navItems = [
    { label: 'Asosiy', path: '/owner', icon: LayoutDashboard },
    { label: "To'yxonalarim", path: '/owner/halls', icon: Building2 },
    { label: "Yangi Qo'shish", path: '/owner/register-hall', icon: PlusCircle },
    { label: 'Bronlar', path: '/owner/bookings', icon: CalendarCheck },
    { label: 'Tasdiqlanish', path: '/owner/verification', icon: BadgeCheck },
  ];

  const verBadge = !verification
    ? { color: 'text-slate-500', bg: 'bg-slate-800', label: 'Yuklanmagan' }
    : verification.status === 'approved'
    ? { color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Tasdiqlangan' }
    : verification.status === 'submitted'
    ? { color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Tekshirilmoqda' }
    : { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Rad etildi' };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-screen text-slate-100 pb-20">
      <aside className="w-full lg:w-72 space-y-4">
        <div className="bg-slate-950/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl sticky top-24">
          <div className="flex items-center gap-3 px-4 mb-6">
            <div className="p-2.5 bg-pink-500 rounded-2xl shadow-lg shadow-pink-500/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-black text-white leading-tight uppercase tracking-tight">
                {user?.firstName || 'Ega'}
              </h2>
              <p className="text-[10px] text-pink-400 font-bold uppercase tracking-[0.2em]">To'yxona Egasi</p>
            </div>
          </div>

          {/* Verification status chip */}
          <div className={`mx-4 mb-6 px-4 py-2.5 rounded-2xl ${verBadge.bg} border border-slate-800 flex items-center gap-2`}>
            {verification?.status === 'approved' ? <BadgeCheck className="w-4 h-4 text-emerald-400" /> :
             verification?.status === 'submitted' ? <Clock className="w-4 h-4 text-amber-400 animate-pulse" /> :
             verification?.status === 'rejected' ? <ShieldX className="w-4 h-4 text-red-400" /> :
             <ShieldAlert className="w-4 h-4 text-slate-500" />}
            <span className={`text-[10px] font-black uppercase tracking-widest ${verBadge.color}`}>
              {verBadge.label}
            </span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path ||
                (item.path !== '/owner' && location.pathname.startsWith(item.path));
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center justify-between group px-5 py-4 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xl shadow-pink-500/20'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-pink-400'}`} />
                    <span className="font-black text-sm uppercase tracking-wide">{item.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  {/* Dot if needs attention */}
                  {item.path === '/owner/verification' && !isActive && (!verification || verification.status === 'rejected') && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 space-y-8">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<OwnerOverview />} />
            <Route path="/halls" element={<MyHalls />} />
            <Route path="/register-hall" element={<RegisterHallGuarded />} />
            <Route path="/edit-hall/:id" element={<RegisterHallGuarded isEdit />} />
            <Route path="/bookings" element={<OwnerBookings />} />
            <Route path="/verification" element={<OwnerVerification />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

/* ─── Guarded hall form — redirect if not approved ─── */
const RegisterHallGuarded = ({ isEdit = false }) => {
  const { verification } = useVerification();
  const navigate = useNavigate();

  if (verification === undefined) return <PageLoader />;

  if (!verification || verification.status !== 'approved') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 text-center space-y-6"
      >
        <div className="p-6 bg-amber-500/10 rounded-full border border-amber-500/20">
          <ShieldAlert className="w-16 h-16 text-amber-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Ruxsat yo'q
          </h2>
          <p className="text-slate-400 font-bold mt-3 max-w-sm mx-auto leading-relaxed">
            {!verification
              ? "To'yxona qo'shish uchun avval hujjatlaringizni yuboring va admin tasdig'ini kuting."
              : verification.status === 'submitted'
              ? 'Hujjatlaringiz tekshirilmoqda. Admin tasdig\'idan keyin to\'yxona qo\'sha olasiz.'
              : `Hujjatlaringiz rad etildi: "${verification.adminNote}". Qayta yuboring.`}
          </p>
        </div>
        <button onClick={() => navigate('/owner/verification')}
          className="flex items-center gap-2 px-8 py-4 bg-pink-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-pink-400 transition-all shadow-xl shadow-pink-500/20"
        >
          <BadgeCheck className="w-5 h-5" /> Tasdiqlanish sahifasi
        </button>
      </motion.div>
    );
  }

  return <RegisterHall isEdit={isEdit} />;
};

/* ─── Overview ─── */
const OwnerOverview = () => {
  const [halls, setHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { verification } = useVerification();

  useEffect(() => {
    Promise.all([api.get('/halls/owner'), api.get('/bookings/owner')])
      .then(([h, b]) => { setHalls(h.data); setBookings(b.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const upcoming = bookings.filter(b => b.status === 'upcoming');
  const completed = bookings.filter(b => b.status === 'completed');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">
          Xush Kelibsiz, {user?.firstName}!
        </h1>
        <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-[10px]">
          Kabinetingizning umumiy holati
        </p>
      </div>

      {/* Verification alert */}
      {verification !== undefined && verification?.status !== 'approved' && (
        <Link to="/owner/verification">
          <motion.div whileHover={{ scale: 1.01 }}
            className={`p-5 rounded-3xl border flex items-center gap-4 cursor-pointer transition-all ${
              !verification
                ? 'bg-slate-900/80 border-slate-700 hover:border-pink-500/40'
                : verification.status === 'submitted'
                ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'
                : 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
            }`}
          >
            {!verification
              ? <ShieldAlert className="w-8 h-8 text-slate-400 flex-shrink-0" />
              : verification.status === 'submitted'
              ? <Clock className="w-8 h-8 text-amber-400 flex-shrink-0 animate-pulse" />
              : <ShieldX className="w-8 h-8 text-red-400 flex-shrink-0" />}
            <div className="flex-1">
              <p className="font-black text-white text-sm uppercase tracking-wide">
                {!verification ? "Hujjatlarni yubormadingiz"
                  : verification.status === 'submitted' ? "Hujjatlar tekshirilmoqda"
                  : "Hujjatlar rad etildi"}
              </p>
              <p className="text-xs text-slate-500 font-bold mt-0.5">
                {!verification
                  ? "To'yxona qo'shish uchun hujjatlaringizni yuboring →"
                  : verification.status === 'submitted'
                  ? "Admin tez orada ko'rib chiqadi →"
                  : `${verification.adminNote} — Qayta yuboring →`}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </motion.div>
        </Link>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="To'yxonalar" value={halls.length} icon={Building2}
          gradient="from-pink-500/20 to-rose-500/20" iconColor="text-pink-400" />
        <StatCard label="Kelgusi Bronlar" value={upcoming.length} icon={CalendarCheck}
          gradient="from-blue-500/20 to-indigo-500/20" iconColor="text-blue-400" />
        <StatCard label="Yakunlangan" value={completed.length} icon={CheckCircle}
          gradient="from-emerald-500/20 to-teal-500/20" iconColor="text-emerald-400" />
      </div>

      {upcoming.length > 0 && (
        <div className="bg-slate-950/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 p-8 space-y-6">
          <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Clock className="w-5 h-5 text-pink-400" /> Yaqinlashayotgan Bronlar
          </h3>
          <div className="space-y-3">
            {upcoming.slice(0, 5).map(b => (
              <div key={b.id} className="flex items-center justify-between p-5 bg-slate-900 rounded-2xl border border-slate-800 hover:border-pink-500/30 transition-all">
                <div>
                  <p className="font-black text-white uppercase text-sm">{b.hall?.name}</p>
                  <p className="text-xs text-slate-500 font-bold mt-1">
                    {b.customerFirstName} {b.customerLastName} • {b.customerPhone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-pink-400">
                    {new Date(b.date).toLocaleDateString('uz-UZ')}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">
                    {b.seatsCount} o'rindiq
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

const StatCard = ({ label, value, icon: Icon, gradient, iconColor }) => (
  <motion.div whileHover={{ y: -4 }}
    className="p-8 rounded-[2.5rem] bg-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden group"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    <div className="relative z-10 flex flex-col gap-6">
      <div className={`p-4 rounded-2xl bg-slate-900 w-fit border border-slate-800 ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-4xl font-black text-white">{value}</p>
      </div>
    </div>
  </motion.div>
);

/* ─── Owner Verification Page ─── */
const OwnerVerification = () => {
  const { verification, refresh } = useVerification();
  const [form, setForm] = useState({ pinfl: '', phone: '' });
  const [files, setFiles] = useState({ passportPhoto: null, hallDoc: null, selfieWithPassport: null });
  const [previews, setPreviews] = useState({ passportPhoto: null, hallDoc: null, selfieWithPassport: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fileInputs = {
    passportPhoto: useRef(),
    hallDoc: useRef(),
    selfieWithPassport: useRef()
  };

  const labels = {
    passportPhoto: 'Passport rasmi',
    hallDoc: "To'yxona guvohnomasi / Ijara shartnomasi",
    selfieWithPassport: 'Passport ushlab tushgan rasmi (selfie)'
  };

  const handleFile = (field, file) => {
    if (!file) return;
    setFiles(p => ({ ...p, [field]: file }));
    setPreviews(p => ({ ...p, [field]: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const data = new FormData();
    data.append('pinfl', form.pinfl);
    data.append('phone', form.phone);
    if (files.passportPhoto) data.append('passportPhoto', files.passportPhoto);
    if (files.hallDoc) data.append('hallDoc', files.hallDoc);
    if (files.selfieWithPassport) data.append('selfieWithPassport', files.selfieWithPassport);

    try {
      await api.post('/owner/verification', data);
      setSuccess('Hujjatlar muvaffaqiyatli yuborildi! Admin tez orada ko\'rib chiqadi.');
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (verification === undefined) return <PageLoader />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Shaxsni Tasdiqlash</h1>
        <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-[10px]">
          To'yxona qo'shish uchun hujjatlarni yuboring
        </p>
      </div>

      {/* Current status card */}
      {verification && (
        <div className={`p-6 rounded-3xl border flex items-start gap-4 ${
          verification.status === 'approved'
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : verification.status === 'submitted'
            ? 'bg-amber-500/10 border-amber-500/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          {verification.status === 'approved'
            ? <BadgeCheck className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-0.5" />
            : verification.status === 'submitted'
            ? <Clock className="w-8 h-8 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
            : <ShieldX className="w-8 h-8 text-red-400 flex-shrink-0 mt-0.5" />}
          <div>
            <p className={`font-black text-sm uppercase tracking-wide ${
              verification.status === 'approved' ? 'text-emerald-400'
              : verification.status === 'submitted' ? 'text-amber-400'
              : 'text-red-400'
            }`}>
              {verification.status === 'approved' ? 'Tasdiqlangan — To\'yxona qo\'sha olasiz!'
                : verification.status === 'submitted' ? 'Hujjatlar tekshirilmoqda...'
                : 'Rad etildi'}
            </p>
            {verification.adminNote && (
              <p className="text-sm text-slate-400 font-bold mt-1">{verification.adminNote}</p>
            )}
            {verification.status === 'approved' && (
              <p className="text-xs text-slate-500 font-bold mt-1">
                PINFL: {verification.pinfl} • Tel: {verification.phone}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Don't show form if approved */}
      {verification?.status === 'approved' ? (
        <div className="bg-slate-950/80 rounded-[2.5rem] border border-slate-800 p-12 text-center space-y-4">
          <BadgeCheck className="w-20 h-20 text-emerald-400 mx-auto" />
          <p className="text-xl font-black text-white uppercase tracking-tight">
            Siz tasdiqlangansiz!
          </p>
          <p className="text-slate-400 font-bold text-sm">
            Endi to'yxona qo'sha va boshqara olasiz.
          </p>
          <Link to="/owner/register-hall"
            className="inline-flex items-center gap-2 px-8 py-4 bg-pink-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-pink-400 transition-all shadow-xl shadow-pink-500/20 mt-4"
          >
            <PlusCircle className="w-5 h-5" /> To'yxona Qo'shish
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm font-bold">
              <XCircle className="w-5 h-5 flex-shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm font-bold">
              <CheckCircle className="w-5 h-5 flex-shrink-0" /> {success}
            </div>
          )}

          <Section title="Shaxsiy ma'lumotlar" icon={<FileText className="w-5 h-5 text-pink-400" />}>
            <Field label="JSHSHIR (PINFL)">
              <Input
                placeholder="12345678901234"
                value={form.pinfl}
                onChange={e => setForm(p => ({ ...p, pinfl: e.target.value }))}
                required
              />
            </Field>
            <Field label="Telefon raqam">
              <Input
                placeholder="+998 90 123 45 67"
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                required
              />
            </Field>
          </Section>

          <Section title="Hujjat rasmlari (ixtiyoriy)" icon={<ImagePlus className="w-5 h-5 text-pink-400" />}>
            <p className="text-xs text-slate-500 font-bold -mt-2">
              Rasmlar ixtiyoriy — hozircha PINFL va telefon bilan ham yuborsa bo'ladi
            </p>
            <div className="space-y-4">
              {['passportPhoto', 'hallDoc', 'selfieWithPassport'].map(field => (
                <div key={field}>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                    {labels[field]}
                  </p>
                  <div
                    onClick={() => fileInputs[field].current?.click()}
                    className={`relative flex items-center gap-4 p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                      previews[field]
                        ? 'border-pink-500/40 bg-pink-500/5'
                        : 'border-slate-700 hover:border-pink-500/40 hover:bg-pink-500/5'
                    }`}
                  >
                    {previews[field] ? (
                      <>
                        <img src={previews[field]} className="w-16 h-16 object-cover rounded-xl border border-slate-700 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-white truncate">{files[field]?.name}</p>
                          <p className="text-xs text-pink-400 font-bold mt-0.5">
                            {(files[field]?.size / 1024).toFixed(0)} KB • Tanlangan ✓
                          </p>
                        </div>
                        <button type="button"
                          onClick={e => { e.stopPropagation(); setFiles(p=>({...p,[field]:null})); setPreviews(p=>({...p,[field]:null})); }}
                          className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-xl text-slate-500 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center flex-shrink-0">
                          <Upload className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-400">Rasm yuklash uchun bosing</p>
                          <p className="text-xs text-slate-600 font-bold mt-0.5">JPG, PNG, WEBP</p>
                        </div>
                      </>
                    )}
                    <input
                      ref={fileInputs[field]}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleFile(field, e.target.files[0])}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <motion.button type="submit"
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-2xl shadow-pink-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading
              ? <><Loader2 className="w-6 h-6 animate-spin" /> Yuklanmoqda...</>
              : <><Send className="w-5 h-5" />
                {verification?.status === 'rejected' ? 'Qayta Yuborish' : 'Hujjatlarni Yuborish'}</>
            }
          </motion.button>
        </form>
      )}
    </motion.div>
  );
};

/* ─── My Halls ─── */
const MyHalls = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHalls = () => {
    setLoading(true);
    api.get('/halls/owner').then(r => setHalls(r.data)).finally(() => setLoading(false));
  };
  useEffect(fetchHalls, []);

  const deleteHall = async (id) => {
    if (!window.confirm("Haqiqatdan ham o'chirmoqchimisiz?")) return;
    await api.delete(`/halls/${id}`);
    fetchHalls();
  };

  if (loading) return <PageLoader />;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">To'yxonalarim</h1>
          <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-[10px]">{halls.length} ta maskan</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/owner/register-hall')}
          className="flex items-center gap-2 px-6 py-3.5 bg-pink-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-pink-500/20 hover:bg-pink-400 transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Yangi Qo'shish
        </motion.button>
      </div>

      {halls.length === 0 ? (
        <div className="bg-slate-950/80 rounded-[2.5rem] border border-dashed border-slate-700 p-20 text-center">
          <Building2 className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Hali to'yxona yo'q</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {halls.map((hall, i) => (
            <motion.div key={hall.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-slate-950 border border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-pink-500/30 transition-all shadow-2xl"
            >
              <div className="relative h-48 overflow-hidden">
                {hall.images?.length > 0 ? (
                  <img
                    src={hall.images[0].startsWith('http') ? hall.images[0] : `${API_URL}${hall.images[0]}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80'}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-slate-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                    hall.status === 'tasdiqlangan'
                      ? 'bg-emerald-500/90 text-white border-emerald-500'
                      : 'bg-amber-500/90 text-black border-amber-500'
                  }`}>
                    {hall.status === 'tasdiqlangan' ? 'Tasdiqlangan' : 'Kutilmoqda'}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{hall.name}</h3>
                  <p className="text-xs text-slate-500 font-bold mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {hall.district} • {hall.address}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">SIG'IM</p>
                    <p className="text-sm font-black text-white mt-0.5">{hall.capacity} kishi</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">NARX</p>
                    <p className="text-sm font-black text-pink-400 mt-0.5">{Number(hall.price).toLocaleString()} so'm</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => navigate(`/owner/edit-hall/${hall.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-blue-500/20 hover:text-blue-400 border border-slate-800 hover:border-blue-500/30 rounded-2xl text-slate-400 text-xs font-black uppercase tracking-widest transition-all"
                  >
                    <Edit className="w-4 h-4" /> Tahrirlash
                  </button>
                  <button onClick={() => deleteHall(hall.id)}
                    className="flex items-center justify-center gap-2 py-3 px-5 bg-slate-900 hover:bg-red-500/20 hover:text-red-400 border border-slate-800 hover:border-red-500/30 rounded-2xl text-slate-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

/* ─── Register / Edit Hall ─── */
const RegisterHall = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '', description: '', address: '', district: '', capacity: '', price: '', phone: '',
    singers: [], karnaySurnay: { available: false, price: 0 }, menus: [], cars: [], ownerId: user?.id || ''
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [owners, setOwners] = useState([]);
  const [newSinger, setNewSinger] = useState({ name: '', price: '' });
  const [newCar, setNewCar] = useState({ brand: '', price: '' });
  const [newMenu, setNewMenu] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (user?.role === 'admin') api.get('/admin/owners').then(r => setOwners(r.data));
    if (isEdit && id) {
      api.get(`/halls/${id}`).then(r => {
        const d = r.data;
        setFormData({
          name: d.name||'', description: d.description||'', address: d.address||'',
          district: d.district||'', capacity: d.capacity||'', price: d.price||'',
          phone: d.phone||'', singers: d.singers||[], karnaySurnay: d.karnaySurnay||{available:false,price:0},
          menus: d.menus||[], cars: d.cars||[], ownerId: d.owner?.id||d.ownerId||''
        });
        setExistingImages(d.images||[]);
      }).finally(() => setFetchLoading(false));
    }
  }, [isEdit, id, user]);

  const addFiles = (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
    setNewFiles(p => [...p, ...valid]);
    setNewPreviews(p => [...p, ...valid.map(f => URL.createObjectURL(f))]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      data.append(k, ['singers','karnaySurnay','menus','cars'].includes(k) ? JSON.stringify(v) : v);
    });
    data.append('images', JSON.stringify(existingImages));
    newFiles.forEach(f => data.append('images', f));
    try {
      if (isEdit) await api.put(`/halls/${id}`, data);
      else await api.post('/halls', data);
      navigate(user?.role === 'admin' ? '/admin/halls' : '/owner/halls');
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally { setLoading(false); }
  };

  const set = (field, val) => setFormData(p => ({ ...p, [field]: val }));

  if (fetchLoading) return <PageLoader />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">
          {isEdit ? "To'yxonani Tahrirlash" : "Yangi To'yxona"}
        </h1>
        <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-[10px]">
          {isEdit ? "Ma'lumotlarni yangilang" : "Yangi maskanni ro'yxatdan o'tkazing"}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm font-bold">
          <XCircle className="w-5 h-5 flex-shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Section title="Asosiy Ma'lumotlar" icon={<FileText className="w-5 h-5 text-pink-400" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="To'yxona nomi">
              <Input placeholder="Masalan: Nargiza Palace" value={formData.name} onChange={e => set('name', e.target.value)} required />
            </Field>
            <Field label="Telefon raqam">
              <Input placeholder="+998 90 123 45 67" value={formData.phone} onChange={e => set('phone', e.target.value)} required />
            </Field>
            <Field label="Tuman">
              <Select value={formData.district} onChange={e => set('district', e.target.value)} required>
                <option value="">Tumanni tanlang</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </Select>
            </Field>
            <Field label="To'liq manzil">
              <Input placeholder="Ko'cha, uy raqami" value={formData.address} onChange={e => set('address', e.target.value)} required />
            </Field>
            <Field label="Sig'im (kishi soni)">
              <Input type="number" placeholder="500" value={formData.capacity} onChange={e => set('capacity', e.target.value)} required />
            </Field>
            <Field label="Narx (1 o'rindiq, so'm)">
              <Input type="number" placeholder="150000" value={formData.price} onChange={e => set('price', e.target.value)} required />
            </Field>
            <Field label="Tavsif" className="md:col-span-2">
              <textarea className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder-slate-600 outline-none focus:border-pink-500/60 transition-all resize-none"
                placeholder="To'yxona haqida qisqacha ma'lumot..." rows={3}
                value={formData.description} onChange={e => set('description', e.target.value)} required />
            </Field>
          </div>
        </Section>

        {user?.role === 'admin' && (
          <Section title="Ega Biriktirish" icon={<ShieldCheck className="w-5 h-5 text-amber-400" />}>
            <Select value={formData.ownerId} onChange={e => set('ownerId', e.target.value)} required>
              <option value="">Egani tanlang</option>
              {owners.map(o => <option key={o.id} value={o.id}>{o.firstName} {o.lastName} ({o.username})</option>)}
            </Select>
          </Section>
        )}

        <Section title="Rasmlar" icon={<ImagePlus className="w-5 h-5 text-pink-400" />}>
          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Mavjud rasmlar ({existingImages.length})</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img src={img.startsWith('http') ? img : `${API_URL}${img}`}
                      className="w-full h-full object-cover rounded-2xl border border-slate-700"
                      onError={e => e.target.src='https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300&q=80'} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                    <button type="button" onClick={() => setExistingImages(p => p.filter((_,j)=>j!==i))}
                      className="absolute top-1.5 right-1.5 p-1.5 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <X className="w-3 h-3" />
                    </button>
                    {i === 0 && <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-pink-500 text-white text-[8px] font-black rounded-lg uppercase">Asosiy</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {newPreviews.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Yangi rasmlar ({newPreviews.length})</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {newPreviews.map((src, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img src={src} className="w-full h-full object-cover rounded-2xl border border-pink-500/40" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                    <button type="button" onClick={() => { URL.revokeObjectURL(newPreviews[i]); setNewFiles(p=>p.filter((_,j)=>j!==i)); setNewPreviews(p=>p.filter((_,j)=>j!==i)); }}
                      className="absolute top-1.5 right-1.5 p-1.5 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-blue-500 text-white text-[8px] font-black rounded-lg uppercase">Yangi</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)}
            onDrop={e=>{e.preventDefault();setDragOver(false);addFiles(e.dataTransfer.files);}}
            onClick={()=>fileRef.current?.click()}
            className={`flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${
              dragOver ? 'border-pink-500 bg-pink-500/10' : 'border-slate-700 hover:border-pink-500/50 hover:bg-pink-500/5'
            }`}
          >
            <Upload className={`w-10 h-10 mb-3 transition-colors ${dragOver ? 'text-pink-400' : 'text-slate-600'}`} />
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Rasmlarni bu yerga tashlang</p>
            <p className="text-xs text-slate-600 font-bold mt-1">yoki bosing va tanlang</p>
            <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={e=>addFiles(e.target.files)} />
          </div>
        </Section>

        <Section title="Honandalar" icon={<Music className="w-5 h-5 text-purple-400" />}>
          <div className="flex gap-3 mb-4">
            <Input className="flex-1" placeholder="Xonanda ismi" value={newSinger.name} onChange={e=>setNewSinger(p=>({...p,name:e.target.value}))} />
            <Input className="w-36" type="number" placeholder="Narxi (so'm)" value={newSinger.price} onChange={e=>setNewSinger(p=>({...p,price:e.target.value}))} />
            <button type="button" onClick={()=>{if(newSinger.name&&newSinger.price){set('singers',[...formData.singers,{...newSinger,price:Number(newSinger.price)}]);setNewSinger({name:'',price:''});}}}
              className="px-5 py-3 bg-purple-500/20 hover:bg-purple-500 text-purple-400 hover:text-white border border-purple-500/30 rounded-2xl font-black text-xs uppercase tracking-wider transition-all">
              Qo'shish
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.singers.map((s,i)=>(
              <Tag key={i} color="purple" onRemove={()=>set('singers',formData.singers.filter((_,j)=>j!==i))}>
                {s.name} — {Number(s.price).toLocaleString()} so'm
              </Tag>
            ))}
          </div>
        </Section>

        <Section title="Mashinalar" icon={<Car className="w-5 h-5 text-blue-400" />}>
          <div className="flex gap-3 mb-4">
            <Input className="flex-1" placeholder="Masalan: Nexia 3" value={newCar.brand} onChange={e=>setNewCar(p=>({...p,brand:e.target.value}))} />
            <Input className="w-36" type="number" placeholder="Narxi (so'm)" value={newCar.price} onChange={e=>setNewCar(p=>({...p,price:e.target.value}))} />
            <button type="button" onClick={()=>{if(newCar.brand&&newCar.price){set('cars',[...formData.cars,{...newCar,price:Number(newCar.price)}]);setNewCar({brand:'',price:''});}}}
              className="px-5 py-3 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/30 rounded-2xl font-black text-xs uppercase tracking-wider transition-all">
              Qo'shish
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.cars.map((c,i)=>(
              <Tag key={i} color="blue" onRemove={()=>set('cars',formData.cars.filter((_,j)=>j!==i))}>
                {c.brand} — {Number(c.price).toLocaleString()} so'm
              </Tag>
            ))}
          </div>
        </Section>

        <Section title="Taomnomalar" icon={<Utensils className="w-5 h-5 text-emerald-400" />}>
          <div className="flex gap-3 mb-4">
            <Input className="flex-1" placeholder="Masalan: Standart menyu" value={newMenu} onChange={e=>setNewMenu(e.target.value)} />
            <button type="button" onClick={()=>{if(newMenu){set('menus',[...formData.menus,{name:newMenu}]);setNewMenu('');}}}
              className="px-5 py-3 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-2xl font-black text-xs uppercase tracking-wider transition-all">
              Qo'shish
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.menus.map((m,i)=>(
              <Tag key={i} color="emerald" onRemove={()=>set('menus',formData.menus.filter((_,j)=>j!==i))}>
                {m.name}
              </Tag>
            ))}
          </div>
        </Section>

        <Section title="Karnay-Surnay" icon={<Star className="w-5 h-5 text-amber-400" />}>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div onClick={()=>set('karnaySurnay',{...formData.karnaySurnay,available:!formData.karnaySurnay.available})}
                className={`w-12 h-6 rounded-full transition-colors relative ${formData.karnaySurnay.available?'bg-amber-500':'bg-slate-700'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.karnaySurnay.available?'translate-x-7':'translate-x-1'}`} />
              </div>
              <span className="font-black text-sm text-white uppercase tracking-wide">
                {formData.karnaySurnay.available ? 'Mavjud' : 'Mavjud emas'}
              </span>
            </label>
            {formData.karnaySurnay.available && (
              <Input className="w-48" type="number" placeholder="Xizmat narxi (so'm)"
                value={formData.karnaySurnay.price}
                onChange={e=>set('karnaySurnay',{...formData.karnaySurnay,price:Number(e.target.value)})} />
            )}
          </div>
        </Section>

        <motion.button type="submit" whileHover={{scale:1.01}} whileTap={{scale:0.99}} disabled={loading}
          className="w-full py-5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-2xl shadow-pink-500/20 disabled:opacity-50 transition-all">
          {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : isEdit ? 'Saqlash' : "Ro'yxatdan O'tkazish"}
        </motion.button>
      </form>
    </motion.div>
  );
};

/* ─── Owner Bookings ─── */
const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortDate, setSortDate] = useState('date_asc');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchBookings = () => {
    setLoading(true);
    const params = new URLSearchParams({ sort: sortDate, status: filterStatus });
    api.get(`/bookings/owner?${params}`).then(r => setBookings(r.data)).finally(() => setLoading(false));
  };
  useEffect(fetchBookings, [sortDate, filterStatus]);

  const cancelBooking = async (id) => {
    if (!window.confirm('Bronni bekor qilmoqchimisiz?')) return;
    await api.put(`/bookings/${id}/cancel`);
    fetchBookings();
  };

  if (loading) return <PageLoader />;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Bronlar</h1>
        <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-[10px]">{bookings.length} ta bron</p>
      </div>
      <div className="grid grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-3xl border border-slate-800">
        <Select value={sortDate} onChange={e => setSortDate(e.target.value)}>
          <option value="date_asc">Sana (yaqin avval)</option>
          <option value="date_desc">Sana (uzoq avval)</option>
        </Select>
        <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Barcha holatlar</option>
          <option value="upcoming">Kelgusida</option>
          <option value="completed">Yakunlangan</option>
          <option value="cancelled">Bekor qilingan</option>
        </Select>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-slate-950/80 rounded-[2.5rem] border border-dashed border-slate-700 p-20 text-center">
          <CalendarCheck className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Hali bron yo'q</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b, i) => (
            <motion.div key={b.id}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="flex items-center justify-between p-6 bg-slate-950 border border-slate-800 rounded-[2rem] hover:border-pink-500/20 transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className={`p-3 rounded-2xl border ${
                  b.status==='upcoming' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                  b.status==='completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-black text-white uppercase text-sm">{b.hall?.name}</p>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">{b.customerFirstName} {b.customerLastName} • {b.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-pink-400">{new Date(b.date).toLocaleDateString('uz-UZ')}</p>
                  <p className="text-[10px] text-slate-600 font-black uppercase mt-0.5">{b.seatsCount} o'rindiq</p>
                </div>
                <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                  b.status==='upcoming' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  b.status==='completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  {b.status==='upcoming'?'Kelgusida':b.status==='completed'?'Yakunlangan':'Bekor'}
                </span>
                {b.status === 'upcoming' && (
                  <button onClick={() => cancelBooking(b.id)}
                    className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-xl text-slate-600 transition-all opacity-0 group-hover:opacity-100">
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

/* ─── Shared UI ─── */
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center py-40 space-y-4">
    <Loader2 className="w-12 h-12 animate-spin text-pink-400" />
    <p className="text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Yuklanmoqda...</p>
  </div>
);

const Section = ({ title, icon, children }) => (
  <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 space-y-5">
    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">{icon} {title}</h3>
    {children}
  </div>
);

const Field = ({ label, children, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    {children}
  </div>
);

const Input = ({ className = '', ...props }) => (
  <input className={`w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder-slate-600 outline-none focus:border-pink-500/60 transition-all ${className}`} {...props} />
);

const Select = ({ children, className = '', ...props }) => (
  <select className={`w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-xs font-black text-slate-400 uppercase tracking-widest outline-none focus:border-pink-500/60 appearance-none transition-all ${className}`} {...props}>
    {children}
  </select>
);

const Tag = ({ children, color, onRemove }) => {
  const colors = {
    purple: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    blue: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  };
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border ${colors[color]}`}>
      {children}
      <button type="button" onClick={onRemove} className="opacity-60 hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
    </span>
  );
};

export default OwnerDashboard;
