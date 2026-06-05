import { Link } from 'react-router-dom';
import { Users, MapPin, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { API_URL } from '../../api/axios';

const HallCard = ({ hall }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
    if (imagePath.startsWith('http')) return imagePath;
    
    // Agar bu bizning Git'dagi 20 ta rasmimizdan biri bo'lsa (hall_1.jfif va h.k.)
    // Vercel'ning o'zidan olamiz (chunki Render'da fayllar o'chib ketishi mumkin)
    if (imagePath.includes('hall_') && imagePath.endsWith('.jfif')) {
      return imagePath;
    }
    
    // Yangi yuklangan rasmlar uchun Render backend manzili
    return `${API_URL}${imagePath}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group h-full"
    >
      <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-800 flex flex-col h-full relative backdrop-blur-sm">
        
        {/* Image Container */}
        <div className="relative h-80 overflow-hidden bg-slate-900">
          <motion.img 
            src={getImageUrl(hall.images[0])} 
            alt={hall.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover will-change-transform"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
            }}
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          
          {/* Dark overlay on hover */}
          <motion.div 
            className="absolute inset-0 bg-black/30 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* District Badge */}
          <motion.div 
            className="absolute top-5 left-5 px-4 py-2 bg-slate-900/90 backdrop-blur-md rounded-2xl text-xs font-black text-amber-200 shadow-lg border border-slate-700 uppercase tracking-wider"
            whileHover={{ y: -2 }}
          >
            {hall.district}
          </motion.div>
          
          {/* Favorite Button */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-5 right-5 p-3 bg-slate-900/80 rounded-full backdrop-blur-md border border-slate-700 hover:bg-slate-900 shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
          </motion.button>
          
          {/* Price Badge - Animated on Hover */}
          <motion.div 
            className="absolute bottom-5 right-5 text-right"
            animate={isHovered ? { y: -12 } : { y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-gradient-to-r from-slate-800 to-amber-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-slate-950/40">
              <span className="text-2xl font-black block">{hall.price.toLocaleString()}</span>
              <span className="text-xs font-bold opacity-90">so'm / kishi</span>
            </div>
          </motion.div>
        </div>
        
        {/* Content */}
        <div className="p-7 flex flex-col flex-1 space-y-5 bg-slate-950">
          <div>
            <h3 className="text-2xl font-black text-slate-100 transition-all duration-300 line-clamp-1 mb-2">
              {hall.name}
            </h3>
            <div className="flex items-center text-slate-400 gap-2 hover:text-slate-200 transition-colors">
              <MapPin className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider line-clamp-1">{hall.address}</span>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div 
              className="flex items-center gap-3 p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all"
              whileHover={{ y: -4 }}
            >
              <div className="p-2.5 bg-slate-950 rounded-xl shadow-sm">
                <Users className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400">SIG'IM</span>
                <span className="text-sm font-black text-slate-100">{hall.capacity}</span>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center gap-3 p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all"
              whileHover={{ y: -4 }}
            >
              <div className="p-2.5 bg-slate-950 rounded-xl shadow-sm">
                <Star className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400">REYTING</span>
                <span className="text-sm font-black text-slate-100">5.0</span>
              </div>
            </motion.div>
          </div>

          {/* Button */}
          <Link 
            to={`/hall/${hall.id}`}
            className="w-full mt-auto"
          >
            <motion.button 
              className="w-full bg-gradient-to-r from-slate-800 to-amber-500 hover:from-slate-700 hover:to-amber-400 text-white py-4 rounded-2xl font-bold tracking-wider text-sm transition-all duration-300 shadow-lg shadow-slate-950/30 active:scale-95"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              BATAFSIL KO'RISH
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default HallCard;
