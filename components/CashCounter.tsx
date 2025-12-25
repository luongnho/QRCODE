import React, { useState, useEffect } from 'react';
import { VND_DENOMINATIONS } from '../constants';
import { CashCount } from '../types';

const CashCounter: React.FC = () => {
  const [counts, setCounts] = useState<CashCount>(() => {
    const initial: CashCount = {};
    VND_DENOMINATIONS.forEach(d => initial[d.value] = 0);
    return initial;
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newTotal = VND_DENOMINATIONS.reduce((sum, d) => {
      const countValue = counts[d.value] || 0;
      return sum + (d.value * countValue);
    }, 0);
    setTotal(newTotal);
  }, [counts]);

  const updateCount = (value: number, delta: number) => {
    setCounts(prev => ({
      ...prev,
      [value]: Math.max(0, prev[value] + delta)
    }));
  };

  const handleInputChange = (value: number, text: string) => {
    const num = parseInt(text) || 0;
    setCounts(prev => ({
      ...prev,
      [value]: Math.max(0, num)
    }));
  };

  const reset = () => {
    const cleared: CashCount = {};
    VND_DENOMINATIONS.forEach(d => cleared[d.value] = 0);
    setCounts(cleared);
  };

  // Updated formatting to 'en-US' for comma-based separation (50,000)
  const formatMoney = (amount: number) => {
    return amount.toLocaleString('en-US');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn pb-10">
      <div className="sticky top-24 z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700 mb-10 transition-all">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">Tổng cộng tiền mặt</p>
            <h2 className="text-4xl md:text-5xl font-black text-primary-600 dark:text-primary-400 tracking-tighter whitespace-nowrap">
              {formatMoney(total)}<span className="text-2xl ml-1.5 opacity-70 font-bold">₫</span>
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-black hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all flex items-center gap-2 group uppercase tracking-widest text-xs"
            >
              <i className="fas fa-trash-can group-hover:shake"></i>
              Xóa sạch
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {VND_DENOMINATIONS.map((d) => (
          <div 
            key={d.value}
            className="flex items-center gap-3 sm:gap-4 bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl shadow-sm border-2 border-slate-50 dark:border-slate-700/50 hover:border-primary-400/50 transition-all group hover:shadow-lg transition-all duration-300"
          >
            {/* Denomination Box */}
            <div className={`${d.color} w-16 sm:w-20 h-10 sm:h-12 flex-shrink-0 flex items-center justify-center text-white font-black text-sm sm:text-base rounded-xl shadow-lg shadow-black/10 transform group-hover:scale-105 transition-transform border-2 border-white/10`}>
              {d.label.split('.')[0]}k
            </div>

            {/* Middle Info Section - Expanded */}
            <div className="flex-1 min-w-0">
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Thành tiền</p>
              <p className="text-sm sm:text-base md:text-lg font-black text-slate-700 dark:text-slate-200 whitespace-nowrap truncate">
                {formatMoney(d.value * (counts[d.value] || 0))} ₫
              </p>
            </div>

            {/* Counter Controls - Compacted */}
            <div className="flex items-center gap-1 sm:gap-2 bg-slate-50 dark:bg-slate-900/50 p-1 rounded-2xl flex-shrink-0 border border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => updateCount(d.value, -1)}
                className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-red-500 shadow-sm transition-all active:scale-90"
              >
                <i className="fas fa-minus text-[10px]"></i>
              </button>
              
              <input
                type="number"
                min="0"
                value={counts[d.value] || ''}
                onChange={(e) => handleInputChange(d.value, e.target.value)}
                className="w-8 sm:w-10 text-center text-base sm:text-lg font-black bg-transparent border-none focus:ring-0 outline-none text-slate-800 dark:text-white p-0"
                placeholder="0"
              />

              <button 
                onClick={() => updateCount(d.value, 1)}
                className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-green-500 shadow-sm transition-all active:scale-90"
              >
                <i className="fas fa-plus text-[10px]"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default CashCounter;
