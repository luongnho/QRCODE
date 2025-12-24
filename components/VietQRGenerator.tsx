
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Bank, QRData } from '../types';
import { fetchBanks, generateQRUrl } from '../services/vietQrService';
import { suggestTransferMessage } from '../services/geminiService';
import { VIETQR_TEMPLATE_OPTIONS } from '../constants';

const VietQRGenerator: React.FC = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [showBankList, setShowBankList] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<QRData>({
    bankBin: '',
    accountNumber: '',
    accountName: '',
    amount: '',
    description: '',
    template: 'compact2',
  });

  const [qrUrl, setQrUrl] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetchBanks();
        setBanks(response.data);
      } catch (err) {
        console.error('Không thể tải danh sách ngân hàng.');
      } finally {
        setLoading(false);
      }
    };
    init();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowBankList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredBanks = useMemo(() => {
    return banks.filter(bank => 
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      bank.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.bin.includes(searchTerm)
    );
  }, [banks, searchTerm]);

  const selectedBank = useMemo(() => {
    return banks.find(b => b.bin === formData.bankBin);
  }, [banks, formData.bankBin]);

  // Updated to use 'en-US' for comma separation as requested
  const formatCurrencyInput = (value: string) => {
    const number = value.replace(/\D/g, '');
    if (!number) return '';
    return new Intl.NumberFormat('en-US').format(parseInt(number));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      const rawValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: rawValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bankBin || !formData.accountNumber) {
      alert('Vui lòng chọn ngân hàng và nhập số tài khoản.');
      return;
    }
    const url = generateQRUrl(formData);
    setQrUrl(url);
  };

  const handleAiSuggest = async () => {
    if (!formData.description) {
      alert('Nhập một vài từ khóa vào ô nội dung để AI gợi ý.');
      return;
    }
    setAiSuggesting(true);
    const suggestion = await suggestTransferMessage(formData.description);
    setFormData(prev => ({ ...prev, description: suggestion }));
    setAiSuggesting(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn pb-10">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 transition-colors duration-500">
        <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center">
          <span className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center rounded-lg mr-3">
            <i className="fas fa-university text-sm"></i>
          </span>
          Thông tin thanh toán
        </h2>
        
        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Ngân hàng thụ hưởng
            </label>
            <div 
              onClick={() => setShowBankList(!showBankList)}
              className="w-full p-4 border-2 border-slate-100 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900/50 dark:text-white cursor-pointer flex items-center justify-between hover:border-primary-400 transition-all shadow-sm"
            >
              {selectedBank ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm border border-slate-100">
                    <img src={selectedBank.logo} alt={selectedBank.shortName} className="max-h-full object-contain" />
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{selectedBank.shortName}</span>
                </div>
              ) : (
                <span className="text-slate-400">Chọn ngân hàng từ danh sách...</span>
              )}
              <i className={`fas fa-chevron-down text-slate-400 transition-transform ${showBankList ? 'rotate-180' : ''}`}></i>
            </div>

            {showBankList && (
              <div className="absolute z-50 w-full mt-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                  <div className="relative">
                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input
                      type="text"
                      placeholder="Tìm theo tên ngân hàng..."
                      className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto custom-scrollbar">
                  {filteredBanks.length > 0 ? filteredBanks.map(bank => (
                    <div
                      key={bank.id}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, bankBin: bank.bin }));
                        setShowBankList(false);
                      }}
                      className={`flex items-center gap-4 p-4 hover:bg-primary-50 dark:hover:bg-primary-900/10 cursor-pointer transition-colors border-b border-slate-50 dark:border-slate-700/30 last:border-0 ${formData.bankBin === bank.bin ? 'bg-primary-50/50 dark:bg-primary-900/20' : ''}`}
                    >
                      <div className="w-14 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm border border-slate-50 flex-shrink-0">
                        <img src={bank.logo} alt={bank.shortName} className="max-h-full object-contain" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-black text-sm text-slate-800 dark:text-white uppercase leading-tight">{bank.shortName}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{bank.name}</p>
                      </div>
                      {formData.bankBin === bank.bin && <i className="fas fa-check-circle text-primary-500 ml-auto"></i>}
                    </div>
                  )) : (
                    <div className="p-10 text-center text-slate-400 flex flex-col gap-2">
                      <i className="fas fa-ghost text-2xl opacity-20"></i>
                      <p className="text-sm italic font-medium">Không thấy kết quả phù hợp</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Số tài khoản
              </label>
              <input
                type="text"
                name="accountNumber"
                className="w-full p-4 border-2 border-slate-100 dark:border-slate-700 rounded-2xl dark:bg-slate-900/50 dark:text-white focus:border-primary-500 outline-none transition-all font-mono text-lg"
                value={formData.accountNumber}
                onChange={handleInputChange}
                placeholder="Nhập số tài khoản"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Tên chủ tài khoản
              </label>
              <input
                type="text"
                name="accountName"
                className="w-full p-4 border-2 border-slate-100 dark:border-slate-700 rounded-2xl dark:bg-slate-900/50 dark:text-white focus:border-primary-500 outline-none transition-all uppercase"
                value={formData.accountName}
                onChange={handleInputChange}
                placeholder="Vd: NGUYEN VAN A"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Số tiền (VNĐ)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="amount"
                  className="w-full p-4 pr-12 border-2 border-slate-100 dark:border-slate-700 rounded-2xl dark:bg-slate-900/50 dark:text-white focus:border-primary-500 outline-none transition-all font-black text-xl text-primary-600 dark:text-primary-400"
                  value={formatCurrencyInput(formData.amount)}
                  onChange={handleInputChange}
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-black uppercase">đ</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Mẫu giao diện
              </label>
              <select
                name="template"
                className="w-full p-4 border-2 border-slate-100 dark:border-slate-700 rounded-2xl dark:bg-slate-900/50 dark:text-white focus:border-primary-500 outline-none transition-all cursor-pointer appearance-none"
                value={formData.template}
                onChange={handleInputChange}
              >
                {VIETQR_TEMPLATE_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex justify-between">
              Nội dung chuyển khoản
              <button
                type="button"
                onClick={handleAiSuggest}
                disabled={aiSuggesting}
                className="text-primary-500 text-xs font-black hover:text-primary-600 flex items-center gap-1 transition-colors uppercase tracking-wider"
              >
                {aiSuggesting ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                AI Gợi ý
              </button>
            </label>
            <input
              type="text"
              name="description"
              className="w-full p-4 border-2 border-slate-100 dark:border-slate-700 rounded-2xl dark:bg-slate-900/50 dark:text-white focus:border-primary-500 outline-none transition-all"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Vd: Chuyen khoan thanh toan"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-5 rounded-2xl transition-all transform hover:scale-[1.01] active:scale-[0.98] shadow-xl shadow-primary-500/20 flex items-center justify-center gap-3 text-lg"
          >
            <i className="fas fa-qrcode text-xl"></i>
            TẠO MÃ THANH TOÁN
          </button>
        </form>
      </div>

      <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 min-h-[450px] transition-colors duration-500">
        {qrUrl ? (
          <div className="text-center animate-fadeIn w-full">
            <div className="bg-white p-5 rounded-[2rem] mb-8 shadow-2xl inline-block border-8 border-slate-50 dark:border-slate-900">
              <img src={qrUrl} alt="VietQR" className="max-w-full h-auto rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <a
                href={qrUrl}
                download="VietQR_Payment.png"
                target="_blank"
                rel="noreferrer"
                className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 p-4 rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-slate-600 transition-all flex flex-col items-center gap-2 text-[11px] uppercase tracking-widest border border-slate-200 dark:border-slate-600"
              >
                <i className="fas fa-cloud-arrow-down text-2xl text-primary-500"></i>
                Tải ảnh về
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(qrUrl);
                  alert('Đã copy link ảnh QR!');
                }}
                className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 p-4 rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-slate-600 transition-all flex flex-col items-center gap-2 text-[11px] uppercase tracking-widest border border-slate-200 dark:border-slate-600"
              >
                <i className="fas fa-copy text-2xl text-primary-500"></i>
                Sao chép link
              </button>
            </div>
            <p className="mt-8 text-slate-400 dark:text-slate-500 text-xs font-bold italic flex items-center justify-center gap-2">
              <i className="fas fa-circle-info"></i>
              Mở ứng dụng Ngân hàng để quét mã
            </p>
          </div>
        ) : (
          <div className="text-center p-12 bg-slate-50/50 dark:bg-slate-900/30 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-700">
            <div className="w-28 h-28 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <i className="fas fa-qrcode text-5xl text-slate-200 dark:text-slate-700"></i>
            </div>
            <h3 className="text-xl font-black text-slate-700 dark:text-slate-300 mb-2">Sẵn sàng tạo mã</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 max-w-[220px] mx-auto font-medium">Hoàn tất biểu mẫu bên trái để nhận mã QR thanh toán chuyên nghiệp.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VietQRGenerator;
