import React, { useState } from 'react';
import { AppTab } from './types';
import ThemeToggle from './components/ThemeToggle';
import VietQRGenerator from './components/VietQRGenerator';
import CashCounter from './components/CashCounter';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.VIETQR);

  return (
    <div className="min-h-screen pb-20 text-slate-900 dark:text-slate-100 transition-colors duration-500 bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 transform hover:rotate-12 transition-transform cursor-pointer">
              <i className="fas fa-shield-halved text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter text-slate-800 dark:text-white leading-tight">
                LUONG <span className="text-primary-600">NHO</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tạo QR - Đếm tiền</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab(AppTab.VIETQR)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === AppTab.VIETQR 
                  ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-md transform scale-105' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <i className="fas fa-qrcode mr-2"></i>
              VietQR
            </button>
            <button
              onClick={() => setActiveTab(AppTab.CASH_COUNTER)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === AppTab.CASH_COUNTER 
                  ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-md transform scale-105' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <i className="fas fa-calculator mr-2"></i>
              Đếm tiền
            </button>
          </div>

          <ThemeToggle />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pt-10">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="animate-slideDown">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
              {activeTab === AppTab.VIETQR ? 'Cổng tạo mã QR' : 'Công cụ đếm tiền'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {activeTab === AppTab.VIETQR 
                ? 'Giải pháp tạo mã QR thanh toán nhanh theo tiêu chuẩn NAPAS 24/7.'
                : 'Tính toán nhanh số lượng tiền mặt mệnh giá VNĐ một cách chính xác.'}
            </p>
          </div>
        </header>

        <div className="relative">
          {activeTab === AppTab.VIETQR ? <VietQRGenerator /> : <CashCounter />}
        </div>
      </main>

      {/* Footer / Mobile Nav */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 sm:hidden">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-full px-6 py-3 flex gap-8 shadow-2xl items-center">
          <button
            onClick={() => setActiveTab(AppTab.VIETQR)}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === AppTab.VIETQR ? 'text-primary-500' : 'text-slate-400'}`}
          >
            <i className="fas fa-qrcode text-xl"></i>
            <span className="text-[10px] font-black uppercase">QR</span>
          </button>
          <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700"></div>
          <button
            onClick={() => setActiveTab(AppTab.CASH_COUNTER)}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === AppTab.CASH_COUNTER ? 'text-primary-500' : 'text-slate-400'}`}
          >
            <i className="fas fa-coins text-xl"></i>
            <span className="text-[10px] font-black uppercase">Tiền</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
