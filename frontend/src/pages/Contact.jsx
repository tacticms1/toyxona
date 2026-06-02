import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto py-12 space-y-16"
    >
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-gray-900">Biz bilan bog'laning</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Savollaringiz yoki takliflaringiz bormi? Biz doimo yordamga tayyormiz.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { title: 'Telefon', value: '+998 71 123 45 67', icon: Phone, color: 'bg-blue-50 text-blue-600' },
          { title: 'Email', value: 'info@toyxona.uz', icon: Mail, color: 'bg-red-50 text-red-600' },
          { title: 'Manzil', value: 'Toshkent sh., Amir Temur ko\'chasi, 108', icon: MapPin, color: 'bg-green-50 text-green-600' },
        ].map((item, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 text-center space-y-4 hover:shadow-xl transition-all duration-500"
          >
            <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto`}>
              <item.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
            <p className="text-gray-500 font-medium">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden grid md:grid-cols-2 border border-gray-50">
        <div className="p-12 md:p-20 space-y-8">
          <h2 className="text-3xl font-black text-gray-900">Xabar yuboring</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <input type="text" placeholder="Ismingiz" className="input-field py-4 bg-gray-50 border-none focus:ring-2 focus:ring-primary" />
              <input type="email" placeholder="Email" className="input-field py-4 bg-gray-50 border-none focus:ring-2 focus:ring-primary" />
            </div>
            <input type="text" placeholder="Mavzu" className="input-field py-4 bg-gray-50 border-none focus:ring-2 focus:ring-primary" />
            <textarea placeholder="Xabaringiz..." rows="5" className="input-field py-4 bg-gray-50 border-none focus:ring-2 focus:ring-primary"></textarea>
            <button type="submit" className="w-full bg-primary hover:bg-gold-600 text-white py-5 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-primary/20">
              <Send className="w-6 h-6" />
              Yuborish
            </button>
          </form>
        </div>
        <div className="bg-gray-900 p-12 md:p-20 text-white relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/10 opacity-50"></div>
          <div className="relative space-y-8">
            <h2 className="text-3xl font-black">Tezkor aloqa</h2>
            <p className="text-gray-400 text-lg">
              Telegram orqali operatorlarimiz bilan bog'laning va tezkor javob oling.
            </p>
            <a href="https://t.me/toyxona_uz" target="_blank" rel="noreferrer" className="inline-flex items-center gap-4 bg-white/10 hover:bg-white/20 px-8 py-5 rounded-2xl font-bold transition-all border border-white/10">
              <MessageCircle className="w-8 h-8 text-[#0088cc]" />
              Telegram kanalimiz
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
