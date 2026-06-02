import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, MapPin, Loader2, UserCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'customer',
    district: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      if (formData.role === 'owner') {
        navigate('/verify-otp', { state: { email: formData.email } });
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">Ro'yxatdan O'tish</h2>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
              <input
                type="text"
                className="input-field"
                placeholder="Ism"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Familiya</label>
              <input
                type="text"
                className="input-field"
                placeholder="Familiya"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="input-field pl-12"
                placeholder="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Manzil</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                className="input-field pl-12"
                placeholder="email@misol.uz"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                className="input-field pl-12"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Men...</label>
            <select
              className="input-field"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="customer">Mijozman</option>
              <option value="owner">To'yxona egasiman</option>
            </select>
          </div>

          {formData.role === 'owner' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hudud (Tuman)</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select 
                  className="input-field pl-12"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  required
                >
                  <option value="">Tumanni tanlang</option>
                  <option value="Yunusobod">Yunusobod</option>
                  <option value="Chilonzor">Chilonzor</option>
                  <option value="Mirzo Ulugbek">Mirzo Ulugbek</option>
                  <option value="Mirobod">Mirobod</option>
                  <option value="Yakkasaroy">Yakkasaroy</option>
                  <option value="Shayxontohur">Shayxontohur</option>
                  <option value="Olmazor">Olmazor</option>
                  <option value="Sergeli">Sergeli</option>
                  <option value="Uchtepa">Uchtepa</option>
                  <option value="Bektemir">Bektemir</option>
                  <option value="Yashnobod">Yashnobod</option>
                  <option value="Yangihayot">Yangihayot</option>
                </select>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full py-3 flex justify-center items-center gap-2" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Hisobingiz bormi?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Kirish
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
