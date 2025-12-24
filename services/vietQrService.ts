
import { BankResponse, QRData } from '../types';
import { VIETQR_API_BANKS } from '../constants';

export const fetchBanks = async (): Promise<BankResponse> => {
  const response = await fetch(VIETQR_API_BANKS);
  if (!response.ok) {
    throw new Error('Failed to fetch bank list');
  }
  return response.json();
};

export const generateQRUrl = (data: QRData): string => {
  const { bankBin, accountNumber, accountName, amount, description, template } = data;
  const baseUrl = `https://img.vietqr.io/image/${bankBin}-${accountNumber}-${template}.png`;
  const params = new URLSearchParams();
  
  if (amount) params.append('amount', amount);
  if (description) params.append('addInfo', description);
  if (accountName) params.append('accountName', accountName);

  return `${baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
};
