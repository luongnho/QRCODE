
export interface Bank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  short_name: string;
  support: number;
  isTransfer: number;
  swift_code: string;
}

export interface BankResponse {
  code: string;
  desc: string;
  data: Bank[];
}

export interface QRData {
  bankBin: string;
  accountNumber: string;
  accountName: string;
  amount: string;
  description: string;
  template: 'compact' | 'compact2' | 'qr_only' | 'print';
}

export interface SavedAccount {
  id: string;
  bankBin: string;
  bankShortName: string;
  bankLogo: string;
  accountNumber: string;
  accountName: string;
}

export interface Denomination {
  value: number;
  label: string;
  color: string;
}

export enum AppTab {
  VIETQR = 'vietqr',
  CASH_COUNTER = 'cash_counter'
}

export interface CashCount {
  [key: number]: number;
}
