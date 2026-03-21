import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      login(data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = Array.from({ length: 120 }, (_, i) => 2024 - i);

  return (
    <div className="font-body text-on-surface-variant min-h-screen flex flex-col bg-surface">
      <main className="flex-grow flex items-center justify-center px-6 py-12 lg:py-24">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Brand Side */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-primary text-5xl lg:text-6xl font-extrabold tracking-tighter">Curator</h1>
            <p className="text-on-surface text-2xl lg:text-3xl font-medium leading-tight max-w-md mx-auto lg:mx-0">
              Connect with friends and the world around you on Curator.
            </p>
            <div className="hidden lg:block relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-surface-container-lowest rounded-xl p-8 flex items-center gap-6 shadow-sm">
                <div className="flex -space-x-3">
                  <div className="h-12 w-12 rounded-full border-2 border-surface-container-lowest bg-primary-fixed flex items-center justify-center text-primary font-bold">A</div>
                  <div className="h-12 w-12 rounded-full border-2 border-surface-container-lowest bg-secondary-fixed flex items-center justify-center text-secondary font-bold">B</div>
                  <div className="h-12 w-12 rounded-full border-2 border-surface-container-lowest bg-tertiary-fixed flex items-center justify-center text-tertiary font-bold">C</div>
                </div>
                <p className="text-sm font-semibold text-on-surface">Join 2,000+ curators today</p>
              </div>
            </div>
          </div>

          {/* Sign Up Form */}
          <div className="w-full max-w-[432px] mx-auto lg:ml-auto">
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && <div className="text-error bg-error-container text-on-error-container p-3 rounded-md text-sm">{error}</div>}
                <div className="space-y-4">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name" className="w-full px-4 py-3.5 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest text-on-surface placeholder:text-outline transition-all" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email address" className="w-full px-4 py-3.5 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest text-on-surface placeholder:text-outline transition-all" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="New password" className="w-full px-4 py-3.5 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest text-on-surface placeholder:text-outline transition-all" />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-outline px-1">Date of birth</label>
                  <div className="grid grid-cols-3 gap-3">
                    <select className="px-3 py-2.5 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm text-on-surface">
                      <option>Day</option>
                      {days.map(d => <option key={d}>{d}</option>)}
                    </select>
                    <select className="px-3 py-2.5 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm text-on-surface">
                      <option>Month</option>
                      {months.map(m => <option key={m}>{m}</option>)}
                    </select>
                    <select className="px-3 py-2.5 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm text-on-surface">
                      <option>Year</option>
                      {years.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-outline px-1">Gender</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Female', 'Male', 'Custom'].map(g => (
                      <label key={g} className="flex items-center justify-between px-3 py-2.5 bg-surface-container-highest rounded-lg cursor-pointer border-2 border-transparent has-[:checked]:border-primary transition-all">
                        <span className="text-sm text-on-surface">{g}</span>
                        <input type="radio" name="gender" className="text-primary focus:ring-primary h-4 w-4 border-outline-variant" />
                      </label>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] leading-relaxed text-outline text-center px-2">
                  By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy.
                </p>

                <button disabled={loading} type="submit" className="w-full bg-[#42b72a] hover:bg-[#36a420] text-white font-bold text-lg py-3 rounded-lg shadow-sm transition-colors active:scale-[0.98] mt-1 disabled:opacity-50">
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-outline-variant/20 text-center">
                <Link to="/login" className="text-primary font-semibold hover:underline">Already have an account?</Link>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-on-surface-variant">
              <span className="font-bold text-on-surface">Create a Page</span> for a celebrity, brand or business.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-surface-container-lowest mt-12 py-8 px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-wrap gap-4 text-xs text-outline">
            <a href="#" className="hover:underline">English (US)</a>
            <a href="#" className="hover:underline">Español</a>
            <a href="#" className="hover:underline">Français</a>
            <a href="#" className="hover:underline">Português</a>
          </div>
          <div className="h-px bg-outline-variant/20 w-full"></div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-outline">
            <a href="#" className="hover:underline">Sign Up</a>
            <a href="#" className="hover:underline">Log In</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Help</a>
          </div>
          <div className="text-xs text-outline pt-4">Curator © 2024</div>
        </div>
      </footer>
    </div>
  );
}
