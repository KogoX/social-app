import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Login() {
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
      const { data } = await api.post('/auth/login', { email, password });
      login(data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-body text-on-surface antialiased min-h-screen flex items-center justify-center p-6 bg-surface-container-low">
      <main className="w-full max-w-[1000px] grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Brand Side */}
        <div className="hidden lg:flex flex-col space-y-6">
          <h1 className="text-primary font-bold tracking-tight text-5xl lg:text-6xl">Curator</h1>
          <p className="text-on-surface-variant text-xl leading-relaxed max-w-md font-medium">
            Connect with the people and world around you through a more intentional, editorial social experience.
          </p>
          <div className="pt-8 flex gap-4">
            <div className="w-32 h-32 rounded-xl bg-surface-container-lowest editorial-shadow p-3 flex flex-col justify-between">
              <span className="material-symbols-outlined text-tertiary">gallery_thumbnail</span>
              <span className="text-xs font-semibold text-on-surface-variant">Gallery</span>
            </div>
            <div className="w-48 h-32 rounded-xl bg-primary-container editorial-shadow p-4 flex flex-col justify-between text-on-primary-container">
              <span className="material-symbols-outlined">auto_awesome</span>
              <div>
                <p className="text-xs opacity-80">Join today</p>
                <p className="font-bold">12.4k Curators</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="flex flex-col items-center lg:items-start w-full">
          <h1 className="lg:hidden text-primary font-bold tracking-tight text-4xl mb-8">Curator</h1>
          <div className="bg-surface-container-lowest w-full max-w-[420px] rounded-xl editorial-shadow p-8 flex flex-col">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && <div className="text-error bg-error-container text-on-error-container p-3 rounded-md text-sm">{error}</div>}
              <div className="space-y-1.5">
                <label className="sr-only" htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email address or phone number"
                  className="w-full px-4 py-3.5 rounded-lg bg-surface-container-highest/20 border-none outline outline-1 outline-outline-variant/20 focus:outline-primary focus:bg-surface-container-lowest focus:ring-0 transition-all text-on-surface placeholder:text-outline"
                />
              </div>
              <div className="space-y-1.5">
                <label className="sr-only" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="w-full px-4 py-3.5 rounded-lg bg-surface-container-highest/20 border-none outline outline-1 outline-outline-variant/20 focus:outline-primary focus:bg-surface-container-lowest focus:ring-0 transition-all text-on-surface placeholder:text-outline"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg shadow-lg shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all mt-2 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
              <div className="text-center pt-2">
                <a href="#" className="text-primary text-sm font-medium hover:underline">Forgot Password?</a>
              </div>
              <div className="py-4 flex items-center">
                <div className="flex-grow h-px bg-surface-variant"></div>
              </div>
              <div className="flex justify-center">
                <Link to="/register">
                  <button type="button" className="px-8 py-3 rounded-lg bg-tertiary text-on-tertiary font-bold text-md hover:opacity-90 active:scale-[0.98] transition-all">
                    Create new account
                  </button>
                </Link>
              </div>
            </form>
          </div>
          <p className="mt-8 text-on-surface-variant text-sm">
            <span className="font-bold text-on-surface">Create a Page</span> for a celebrity, brand or business.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-surface-container-low/50 backdrop-blur-sm p-4 hidden md:block">
        <div className="max-w-[1000px] mx-auto flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-outline">
          <span className="hover:underline cursor-pointer">English (US)</span>
          <span className="hover:underline cursor-pointer">Español</span>
          <span className="hover:underline cursor-pointer">Français</span>
          <span className="hover:underline cursor-pointer">Português</span>
          <span className="hover:underline cursor-pointer">Italiano</span>
          <span className="hover:underline cursor-pointer">Deutsch</span>
          <div className="w-full h-px bg-surface-variant/40 my-1"></div>
          <span className="hover:underline cursor-pointer">Sign Up</span>
          <span className="hover:underline cursor-pointer">Log In</span>
          <span className="hover:underline cursor-pointer">Messenger</span>
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:underline cursor-pointer">Terms</span>
          <span className="ml-auto">Curator © 2024</span>
        </div>
      </footer>
    </div>
  );
}
