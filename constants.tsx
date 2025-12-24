
import { Denomination } from './types';

export const VND_DENOMINATIONS: Denomination[] = [
  { value: 500000, label: '500.000 ₫', color: 'bg-cyan-700' },
  { value: 200000, label: '200.000 ₫', color: 'bg-orange-600' },
  { value: 100000, label: '100.000 ₫', color: 'bg-green-700' },
  { value: 50000, label: '50.000 ₫', color: 'bg-rose-600' },
  { value: 20000, label: '20.000 ₫', color: 'bg-blue-700' },
  { value: 10000, label: '10.000 ₫', color: 'bg-yellow-600' },
];

export const VIETQR_API_BANKS = 'https://api.vietqr.io/v2/banks';
export const VIETQR_TEMPLATE_OPTIONS = [
  { id: 'compact2', label: 'Rút gọn 2 (Khuyên dùng)' },
  { id: 'compact', label: 'Rút gọn' },
  { id: 'qr_only', label: 'Chỉ mã QR' },
  { id: 'print', label: 'In ấn' },
];
