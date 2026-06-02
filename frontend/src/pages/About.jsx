import { Heart, ShieldCheck, Clock, Star, Users, MapPin } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-16 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-5xl font-black text-gray-900 leading-tight">
          Biz <span className="text-primary">To'yXona</span> Jamoasimiz
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Toshkentdagi to'yxonalarni band qilish jarayonini oson, shaffof va zamonaviy qilishni maqsad qilganmiz. Bizning platformamiz orqali vaqtingizni tejang va eng yaxshi maskanni tanlang.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: 'To\'yxonalar', value: '100+', icon: Star },
          { label: 'Mijozlar', value: '5000+', icon: Users },
          { label: 'Tumanlar', value: '12', icon: MapPin },
          { label: 'Muvaffaqiyat', value: '100%', icon: Heart },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/90 p-8 rounded-[2rem] shadow-xl text-center space-y-3 border border-slate-800">
            <div className="w-12 h-12 bg-slate-950 text-amber-300 rounded-xl flex items-center justify-center mx-auto">
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-slate-100">{stat.value}</p>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Why Us */}
      <div className="bg-gray-900 text-white rounded-[3rem] p-12 md:p-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
        <div className="relative grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black leading-tight">Nega aynan bizni tanlashadi?</h2>
            <div className="space-y-6">
              {[
                { title: 'Ishonchli maskanlar', desc: 'Barcha to\'yxonalar bizning adminlar tomonidan tekshiriladi.', icon: ShieldCheck },
                { title: 'Vaqtni tejash', desc: 'To\'yxonaga borish shart emas, barcha ma\'lumotlar va kalendar shu yerda.', icon: Clock },
                { title: 'Haqqoniy narxlar', desc: 'Hech qanday yashirin to\'lovlarsiz, to\'g\'ridan-to\'g\'ri to\'yxona narxlari.', icon: Star },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80" 
              className="rounded-[2rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
              alt="Wedding"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
