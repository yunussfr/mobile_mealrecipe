import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus, Mail, Lock, ArrowRight } from 'lucide-react';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Giriş başarısız:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFD600] p-6 flex flex-col justify-center items-center font-['Nunito']">
      <div className="w-full max-w-[320px] bg-white border-[4px] border-[#1A1A2E] shadow-[8px_8px_0px_0px_#1A1A2E] p-8 relative overflow-hidden">

        {/* dekor */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#FF6B00] rounded-full border-[3px] border-[#1A1A2E]" />

        <div className="relative z-10">

          {/* logo */}
          <div className="mb-8 flex flex-col items-center">
            <div className="w-20 h-20 bg-[#FFD600] border-[3px] border-[#1A1A2E] flex items-center justify-center mb-4 rotate-3 shadow-[4px_4px_0px_0px_#1A1A2E]">
              <span className="text-4xl">🥘</span>
            </div>

            <h1 className="text-3xl font-black text-[#1A1A2E] uppercase tracking-tighter">
              LEZZETTAT
            </h1>

            <p className="text-sm font-bold text-[#1A1A2E]/60 mt-1 uppercase">
              Mutfaktaki Partiye Katıl!
            </p>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* email */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-[#1A1A2E]">
                E-posta
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  size={18}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lezzet@tat.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#FFF8F0] border-[3px] border-[#1A1A2E] font-bold text-[#1A1A2E]"
                />
              </div>
            </div>

            {/* password */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-[#1A1A2E]">
                Şifre
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  size={18}
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#FFF8F0] border-[3px] border-[#1A1A2E] font-bold text-[#1A1A2E]"
                />
              </div>
            </div>

            {/* login button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF6B00] text-white border-[3px] border-[#1A1A2E] py-4 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#1A1A2E] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Giriş yapılıyor...'
              ) : (
                <>
                  <LogIn size={20} />
                  GİRİŞ YAP
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* register */}
          <div className="mt-8 pt-6 border-t-[3px] border-[#1A1A2E]/10 flex flex-col items-center gap-4">

            <p className="text-sm font-bold text-[#1A1A2E]/60 uppercase">
              Henüz üye değil misin?
            </p>

            <Link
              to="/register"
              className="w-full bg-[#E83F6F] text-white border-[3px] border-[#1A1A2E] py-3 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#1A1A2E] flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              KAYIT OL
            </Link>

          </div>

        </div>
      </div>

      <p className="mt-8 text-[10px] font-black uppercase text-[#1A1A2E]/40 tracking-[0.2em]">
        © 2026 LEZZETTAT CREATIVE STUDIO
      </p>
    </div>
  );
}