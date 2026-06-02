import { useState, useEffect } from 'react';
import api from '../api/axios';
import HallCard from '../components/halls/HallCard';
import { Search, SlidersHorizontal, ArrowUpDown, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('');
  const [sort, setSort] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [error, setError] = useState(null);

  const fetchHalls = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ search, district, sort, minPrice, maxPrice });
      const res = await api.get(`/halls?${params.toString()}`);
      setHalls(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Maʼlumotlarni yuklashda xatolik yuz berdi. Backend ulanishini tekshiring.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHalls(); }, [district, sort]);

  const handleSearch = (e) => { e.preventDefault(); fetchHalls(); };

  return (
    <motion.div className="space-y-10" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: 'easeOut' }}>
      <motion.div className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-24 shadow-2xl bg-slate-950" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-800 to-amber-900/40 opacity-95"></div>
        <motion.div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" animate={{ y: [0, 30, 0], x: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-0 -left-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" animate={{ y: [0, -30, 0], x: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-5 py-2 mb-8 text-sm font-bold tracking-widest text-amber-100 bg-slate-900/80 rounded-full backdrop-blur-md shadow-lg shadow-slate-900/40 border border-amber-200/20">
            <Sparkles className="w-4 h-4 text-amber-200" /> ENG SARA TO'YXONALAR
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Orzungizdagi <br className="hidden md:block" /> <span className="text-amber-300">To'yxonani</span> Toping
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="text-xl text-slate-200/90 mb-12 leading-relaxed max-w-2xl mx-auto">
            Hashamatli va shinam maskanlar. Tasdiqlangan to'yxonalarni shaffof narxlar va darhol band qilish imkoniyati bilan tanlang.
          </motion.p>

          <motion.form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 p-3 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/70 max-w-3xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}>
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-950/70 outline-none text-slate-100 placeholder-slate-500 font-semibold rounded-2xl border border-slate-700/80" placeholder="To'yxona nomini kiriting..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <motion.button type="submit" className="bg-gradient-to-r from-slate-800 to-amber-500 hover:from-slate-700 hover:to-amber-400 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-lg shadow-slate-900/40" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Qidirish</motion.button>
          </motion.form>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-12">
        <motion.aside className="w-full lg:w-80" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
          <div className="bg-slate-950/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-slate-700/70 space-y-8 sticky top-28 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3 font-black text-slate-100 uppercase tracking-widest text-sm">
                <SlidersHorizontal className="w-5 h-5 text-amber-300" /> Filtrlar
              </div>
              {(district || sort || minPrice || maxPrice) && (
                <motion.button onClick={() => { setDistrict(''); setSort(''); setMinPrice(''); setMaxPrice(''); }} className="text-[10px] font-bold text-amber-300 hover:text-amber-200 uppercase tracking-tighter hover:underline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Tozalash</motion.button>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Hudud</label>
                <div className="relative">
                  <select className="w-full bg-slate-900 border-2 border-slate-800 hover:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold text-slate-100 outline-none focus:border-amber-400 transition-all appearance-none" value={district} onChange={(e) => setDistrict(e.target.value)}>
                    <option value="" className="text-slate-700">Barcha tumanlar</option>
                    {['Yunusobod','Chilonzor','Mirzo Ulugbek','Mirobod','Yakkasaroy','Shayxontohur','Olmazor','Sergeli','Uchtepa','Bektemir','Yashnobod','Yangihayot'].map(d => (<option key={d} value={d}>{d}</option>))}
                  </select>
                  <ArrowUpDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Narx Oralig'i (so'm)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Min" className="w-full bg-slate-900 border-2 border-slate-800 hover:border-slate-700 rounded-2xl px-4 py-4 text-sm font-bold text-slate-100 outline-none focus:border-amber-400 transition-all" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                  <input type="number" placeholder="Max" className="w-full bg-slate-900 border-2 border-slate-800 hover:border-slate-700 rounded-2xl px-4 py-4 text-sm font-bold text-slate-100 outline-none focus:border-amber-400 transition-all" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Saralash</label>
                <div className="relative">
                  <select className="w-full bg-slate-900 border-2 border-slate-800 hover:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold text-slate-100 outline-none focus:border-amber-400 transition-all appearance-none" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="">Standart</option>
                    <option value="price_asc">Narx: Arzonroq</option>
                    <option value="price_desc">Narx: Qimmatroq</option>
                    <option value="capacity_desc">Sig'imi: Kattaroq</option>
                  </select>
                  <ArrowUpDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <motion.button onClick={fetchHalls} className="w-full bg-gradient-to-r from-slate-800 to-amber-500 hover:from-slate-700 hover:to-amber-400 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-slate-900/40 hover:shadow-xl" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Filtrni qo'llash</motion.button>
          </div>
        </motion.aside>

        <motion.div className="flex-1 space-y-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
          <div className="flex items-center justify-between px-2">
            <motion.h2 className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>Natijalar: <span className="text-amber-300 font-black">{halls.length} ta to'yxona</span></motion.h2>
          </div>

          

          {loading ? (
            <motion.div className="flex flex-col justify-center items-center h-96 space-y-6 bg-slate-950/90 backdrop-blur-md rounded-3xl border border-slate-700 shadow-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                <Loader2 className="w-16 h-16 text-amber-300" />
              </motion.div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Qidirilmoqda...</p>
            </motion.div>
          ) : halls.length > 0 ? (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, staggerChildren: 0.1 }}>
              {halls.map(hall => (
                <motion.div key={hall.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <HallCard hall={hall} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div className="text-center py-32 bg-slate-950/90 backdrop-blur-md rounded-3xl border border-slate-700 shadow-xl space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <motion.div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-slate-950/40" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Search className="w-12 h-12 text-amber-300" />
              </motion.div>
              <div className="space-y-2">
                <p className="text-2xl font-black text-slate-100">Hech narsa topilmadi</p>
                <p className="text-slate-400 max-w-xs mx-auto">Qidiruv mezonlarini o'zgartirib ko'ring yoki barcha to'yxonalarni ko'ring.</p>
              </div>
              <motion.button onClick={() => { setSearch(''); setDistrict(''); setMinPrice(''); setMaxPrice(''); setSort(''); fetchHalls(); }} className="text-amber-300 font-black uppercase tracking-widest text-sm hover:text-amber-200 hover:underline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Barcha to'yxonalar</motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
