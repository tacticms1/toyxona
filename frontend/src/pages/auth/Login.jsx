import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(formData.email, formData.password);
      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'owner') navigate('/owner');
      else navigate('/customer');
    } catch (err) {
      if (err.response?.data?.unverified) {
        navigate('/verify-otp', { state: { email: formData.email } });
      } else {
        setError(err.response?.data?.message || 'Email yoki parol noto\'g\'ri');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 border border-slate-800 rounded-full text-amber-400 text-xs font-black uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" /> To'yxona.uz
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tight">Xush Kelibsiz</h1>
          <p className="text-slate-500 font-bold mt-2 text-sm">Hisobingizga kiring</p>
        </div>

        <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm font-bold"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Manzil</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input
                  type="email"
                  placeholder="email@misol.uz"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium text-white placeholder-slate-600 outline-none focus:border-amber-500/60 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Parol</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium text-white placeholder-slate-600 outline-none focus:border-amber-500/60 transition-all"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-amber-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <><ArrowRight className="w-5 h-5" /> Kirish</>
              }
            </motion.button>
          </form>

          <div className="pt-2 text-center">
            <p className="text-slate-500 text-sm font-bold">
              Hisobingiz yo'qmi?{' '}
              <Link to="/register" className="text-amber-400 hover:text-amber-300 font-black transition-colors">
                Ro'yxatdan o'tish
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
