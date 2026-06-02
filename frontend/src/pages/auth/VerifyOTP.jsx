import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) navigate('/login');
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOTP(email, otp);
      navigate('/owner');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-slate-950 p-8 rounded-xl shadow-xl text-center border border-slate-800">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 text-amber-300 rounded-full mb-6">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-amber-300 mb-2">Verify OTP</h2>
        <p className="text-slate-400 mb-8">We've sent a 6-digit code to <span className="font-semibold text-slate-100">{email}</span></p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            maxLength="6"
            className="input-field text-center text-3xl tracking-[1em] font-bold"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary w-full py-3 flex justify-center items-center gap-2" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
