import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, ArrowLeft, Heart } from 'lucide-react';

export function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(email, password, name);
      navigate('/');
    } catch (error) {
      console.error('Kayıt başarısız:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#E83F6F] p-6 flex flex-col justify-center items-center font-['Nunito'] relative overflow-hidden">

      <div className="absolute top-0 right-0 p-8 text-[#FFD600] opacity-20 -rotate-12 pointer-events-none">
        <Heart size={120} fill="currentColor" />
      </div>

      <div className="absolute bottom-0 left-0 p-8 text-[#FFD600] opacity-10 rotate-45 pointer-events-none">
        <Heart size={80} fill="currentColor" />
      </div>

      <div className="w-full max-w-[320px] bg-white border-[4px] border-[#1A1A2E] shadow-[8px_8px_0px_0px_#1A1A2E] p-8 relative z-10">

        <Link
          to="/login"
          className="absolute -top-4 -left-4 w-10 h-10 bg-[#FFD600] border-[3px] border-[#1A1A2E] flex items-center justify-center shadow-[4px_4px_0px_0px_#1A1A2E] hover:-translate-y-1 transition-transform"
        >
          <ArrowLeft size={20} />
        </Link>

        <div className="mb-6">
          <h2 className="text-3xl font-black uppercase leading-none">
            YENİ BİR<br />
            <span className="text-[#FF6B00]">HESAP</span> AÇ
          </h2>
          <p className="text-sm font-bold mt-2 opacity-60 uppercase">
            Lezzet dünyasına ilk adımı at!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-[10px] font-black uppercase">Adın Soyadın</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2" size={16} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-[3px] bg-[#FFF8F0] font-bold text-sm"
                placeholder="Örn: Lezzet Sever"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase">E-posta</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-[3px] bg-[#FFF8F0] font-bold text-sm"
                placeholder="lezzet@tat.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-[3px] bg-[#FFF8F0] font-bold text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1A1A2E] text-white py-4 font-black uppercase"
          >
            {isLoading ? 'Yükleniyor...' : 'ÜYE OL VE BAŞLA'}
          </button>
        </form>

      </div>
    </div>
  );
}