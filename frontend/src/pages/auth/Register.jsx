import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, MapPin, Loader2, UserCircle, Building2, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const DISTRICTS = [
  'Yunusobod','Chilonzor','Mirzo Ulugbek','Mirobod',
  'Yakkasaroy','Shayxontohur','Olmazor','Sergeli',
  'Uchtepa','Bektemir','Yashnobod','Yangihayot'
];

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', username: '', email: '',
    password: '', role: 'customer', district: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (field, val) => setFormData(p => ({ ...p, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      if (formData.role === 'owner') navigate('/verify-otp', { state: { email: formData.email } });
      else navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Ro'yxatdan o'tishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-10">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 border border-slate-800 rounded-full text-amber-400 text-xs font-black uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" /> To'yxona.uz
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tight">Ro'yxatdan O'tish</h1>
          <p className="text-slate-500 font-bold mt-2 text-sm">Yangi hisob yarating</p>
        </div>

        <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm font-bold"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" /> {error}
            </motion.div>
          )}

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'customer', label: 'Mijoz', icon: User, desc: 'To\'yxona band qilish' },
              { value: 'owner', label: 'Egaman', icon: Building2, desc: 'To\'yxona ro\'yxatdan o\'tkazish' }
            ].map(opt => (
              <button key={opt.value} type="button" onClick={() => set('role', opt.value)}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  formData.role === opt.value
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                }`}
              >
                <opt.icon className={`w-5 h-5 mb-2 ${formData.role === opt.value ? 'text-amber-400' : 'text-slate-500'}`} />
                <p className={`font-black text-sm uppercase tracking-wide ${formData.role === opt.value ? 'text-white' : 'text-slate-400'}`}>{opt.label}</p>
                <p className="text-[10px] text-slate-600 font-bold mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ism">
                <Input placeholder="Aziz" value={formData.firstName} onChange={e => set('firstName', e.target.value)} required />
              </Field>
              <Field label="Familiya">
                <Input placeholder="Rahimov" value={formData.lastName} onChange={e => set('lastName', e.target.value)} required />
              </Field>
            </div>

            <Field label="Username">
              <div className="relative">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <Input className="pl-12" placeholder="aziz_rahimov" value={formData.username} onChange={e => set('username', e.target.value)} required />
              </div>
            </Field>

            <Field label="Email Manzil">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <Input className="pl-12" type="email" placeholder="email@misol.uz" value={formData.email} onChange={e => set('email', e.target.value)} required />
              </div>
            </Field>

            <Field label="Parol">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <Input className="pl-12" type="password" placeholder="••••••••" value={formData.password} onChange={e => set('password', e.target.value)} required />
              </div>
            </Field>

            {formData.role === 'owner' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <Field label="Hudud (Tuman)">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                    <select
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium text-white outline-none focus:border-amber-500/60 transition-all appearance-none"
                      value={formData.district}
                      onChange={e => set('district', e.target.value)}
                      required
                    >
                      <option value="">Tumanni tanlang</option>
                      {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </Field>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-amber-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <><ArrowRight className="w-5 h-5" /> Ro'yxatdan O'tish</>
              }
            </motion.button>
          </form>

          <div className="pt-2 text-center">
            <p className="text-slate-500 text-sm font-bold">
              Hisobingiz bormi?{' '}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 font-black transition-colors">
                Kirish
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    {children}
  </div>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder-slate-600 outline-none focus:border-amber-500/60 transition-all ${className}`}
    {...props}
  />
);

export default Register;
