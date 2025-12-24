
import { GoogleGenAI } from "@google/genai";

export const suggestTransferMessage = async (context: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn('API_KEY is not defined');
    return "Chuyen khoan";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest a professional and concise Vietnamese transfer description for: ${context}. Keep it under 50 characters. Just return the text.`,
    });
    return response.text?.trim() || "Chuyen khoan";
  } catch (error) {
    console.error('Gemini error:', error);
    return "Chuyen khoan";
  }
};

export const formatMoneyInWords = async (amount: number): Promise<string> => {
  if (amount === 0) return "Không đồng";
  if (!process.env.API_KEY) return "";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Vietnamese representation of the amount ${amount} in words. For example: 'Một triệu hai trăm nghìn đồng'. Just return the words.`,
    });
    return response.text?.trim() || "";
  } catch (error) {
    return "";
  }
};
