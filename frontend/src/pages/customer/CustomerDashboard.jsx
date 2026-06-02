import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { CalendarCheck, MapPin, DollarSign, Clock, XCircle, Loader2 } from 'lucide-react';

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm('Haqiqatdan ham ushbu bandni bekor qilmoqchimisiz?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) {
      alert('Bekor qilishda xatolik yuz berdi');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Mening buyurtmalarim</h1>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold">
          Jami {bookings.length} ta buyurtma
        </div>
      </div>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-800">{booking.hall?.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        booking.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                        booking.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {booking.status === 'upcoming' ? "Endi bo'ladigan" : booking.status === 'completed' ? "Bo'lib o'tgan" : 'Bekor qilingan'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="w-4 h-4 text-primary" />
                        <span>{new Date(booking.date).toLocaleDateString('uz-UZ', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{booking.hall?.district}, {booking.hall?.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span>Jami: {booking.totalPrice.toLocaleString()} so'm (To'landi: {booking.advancePaid.toLocaleString()} so'm)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>Buyurtma qilingan sana: {new Date(booking.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {booking.services?.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tanlangan xizmatlar</p>
                        <div className="flex flex-wrap gap-2">
                          {booking.services.map((s, i) => (
                            <span key={i} className="bg-gray-50 px-2 py-1 rounded text-xs border border-gray-100">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between items-end">
                    {booking.status === 'upcoming' && (
                      <button 
                        onClick={() => cancelBooking(booking.id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium text-sm p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                        Bekor qilish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
          <CalendarCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Sizda hali buyurtmalar yo'q.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 text-primary font-bold hover:underline"
          >
            To'yxonalarni ko'rish
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
