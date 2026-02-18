
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BirthChart from './components/BirthChart';
import Paywall from './components/Paywall';
import InterpretationSection from './components/InterpretationSection';
import { UserInfo, HoroscopeData } from './types';
import { generateLaso } from './utils/tuviLogic';
import { getHoroscopeInterpretation } from './services/geminiService';

const App: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [lasoData, setLasoData] = useState<HoroscopeData | null>(null);
  const [interpretation, setInterpretation] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7).toUpperCase());

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const info: UserInfo = {
      fullName: formData.get('fullName') as string,
      birthDate: formData.get('birthDate') as string,
      gender: formData.get('gender') as 'Nam' | 'Nữ',
      isLunar: formData.get('calendar') === 'lunar'
    };

    setLoading(true);
    setUserInfo(info);
    const generated = generateLaso(info);
    setLasoData(generated);

    const result = await getHoroscopeInterpretation(generated);
    setInterpretation(result);
    setLoading(false);
    
    setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-gold/30 selection:text-white">
      <Header />

      <div className="flex-grow">
        {!userInfo ? (
          <main className="max-w-xl mx-auto mt-12 px-6 relative z-10 animate-fade-in">
            <div className="glass-panel p-10 md:p-14 rounded-[3.5rem] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
              
              <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner animate-float backdrop-blur-sm">
                      ☯️
                  </div>
                  <h2 className="text-3xl font-royal text-gold font-bold tracking-tight">Khai Lập Lá Số</h2>
                  <p className="text-indigo-300/40 text-[10px] uppercase tracking-[0.4em] mt-3">Khởi tạo bản đồ vận mệnh 2026</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="space-y-2 group">
                  <label className="block text-[10px] font-bold text-gold/50 uppercase tracking-[0.2em] ml-1 transition-colors group-focus-within:text-gold">Họ và Tên Chủ Sự</label>
                  <input required name="fullName" type="text" placeholder="Họ tên đầy đủ..." className="w-full bg-white/[0.03] border border-gold/10 rounded-2xl px-6 py-4 focus:border-gold/60 focus:bg-white/[0.07] outline-none transition-all text-white placeholder:text-white/10 shadow-inner" />
                </div>

                <div className="space-y-2 group">
                  <label className="block text-[10px] font-bold text-gold/50 uppercase tracking-[0.2em] ml-1 transition-colors group-focus-within:text-gold">Ngày Tháng Năm Sinh</label>
                  <input required name="birthDate" type="date" className="w-full bg-white/[0.03] border border-gold/10 rounded-2xl px-6 py-4 focus:border-gold/60 focus:bg-white/[0.07] outline-none transition-all text-white [color-scheme:dark] shadow-inner" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label className="block text-[10px] font-bold text-gold/50 uppercase tracking-[0.2em] ml-1 transition-colors group-focus-within:text-gold">Giới Tính</label>
                    <select name="gender" className="w-full bg-[#0a0a16] border border-gold/10 rounded-2xl px-6 py-4 focus:border-gold/60 outline-none transition-all text-white appearance-none cursor-pointer shadow-inner">
                      <option value="Nam">Nam Mệnh</option>
                      <option value="Nữ">Nữ Mệnh</option>
                    </select>
                  </div>
                  <div className="space-y-2 group">
                    <label className="block text-[10px] font-bold text-gold/50 uppercase tracking-[0.2em] ml-1 transition-colors group-focus-within:text-gold">Lịch Pháp</label>
                    <select name="calendar" className="w-full bg-[#0a0a16] border border-gold/10 rounded-2xl px-6 py-4 focus:border-gold/60 outline-none transition-all text-white appearance-none cursor-pointer shadow-inner">
                      <option value="solar">Dương Lịch</option>
                      <option value="lunar">Âm Lịch</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="btn-gold w-full py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 active:scale-95">
                      <span className="text-xl">❂</span>
                      <span className="tracking-[0.2em]">Xem Kết Quả Ngay</span>
                  </button>
                </div>
              </form>
            </div>
          </main>
        ) : (
          <div id="result-section" className="animate-fade-in relative z-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-72">
                  <div className="relative mb-16">
                      <div className="absolute inset-0 bg-gold/20 rounded-full blur-[60px] animate-pulse"></div>
                      <div className="w-28 h-28 border-t-2 border-b-2 border-gold rounded-full animate-spin relative z-10 shadow-[0_0_40px_rgba(212,175,55,0.4)]"></div>
                  </div>
                  <h3 className="text-gold font-royal text-2xl md:text-3xl tracking-[0.4em] uppercase font-black text-center animate-pulse">Đang Khởi Tạo Mệnh Thư...</h3>
                  <p className="text-indigo-400/40 mt-6 font-light tracking-widest text-[10px] uppercase">Soi chiếu thiên hà • An vị các cung</p>
              </div>
            ) : (
              <>
                {lasoData && <BirthChart data={lasoData} />}
                
                <InterpretationSection 
                  interpretation={interpretation} 
                  isPremium={isPremium} 
                />

                {!isPremium && (
                  <div id="paywall">
                    <Paywall 
                      sessionId={sessionId} 
                      onUnlock={() => setIsPremium(true)} 
                    />
                  </div>
                )}

                <div className="text-center mt-28 mb-16">
                    <button 
                      onClick={() => {
                          setUserInfo(null);
                          setInterpretation(null);
                          setIsPremium(false);
                      }}
                      className="text-gold/30 hover:text-gold transition-all underline decoration-gold/10 hover:decoration-gold/100 text-[10px] tracking-[0.4em] uppercase font-black"
                    >
                      Bình giải lá số khác
                    </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <Footer />

      {!isPremium && userInfo && !loading && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-6">
              <button 
                onClick={() => document.getElementById('paywall')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-gold w-full py-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center justify-center gap-4 border border-white/20 transform hover:scale-105"
              >
                  <span className="text-xl">🔓</span>
                  <span className="uppercase tracking-[0.15em] text-[11px] font-black">Mở Khóa Luận Giải Toàn Bộ</span>
                  <span className="bg-black/20 text-black px-2.5 py-1 rounded text-[10px] font-black">19K</span>
              </button>
          </div>
      )}
    </div>
  );
};

export default App;
