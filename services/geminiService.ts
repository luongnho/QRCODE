import { GoogleGenAI, Type } from "@google/genai";

// Always initialize with apiKey from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const suggestTransferMessage = async (context: string): Promise<string> => {
  try {
    // Use ai.models.generateContent with model name and prompt directly
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest a professional and concise Vietnamese transfer description for: ${context}. Keep it under 50 characters. Just return the text.`,
    });
    // Use .text property directly, it is a getter, not a method
    return response.text?.trim() || "Chuyen khoan";
  } catch (error) {
    console.error('Gemini error:', error);
    return "Chuyen khoan";
  }
};

export const formatMoneyInWords = async (amount: number): Promise<string> => {
  if (amount === 0) return "Không đồng";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Vietnamese representation of the amount ${amount} in words. For example: 'Một triệu hai trăm nghìn đồng'. Just return the words.`,
    });
    // Use .text property directly
    return response.text?.trim() || "";
  } catch (error) {
    return "";
  }
};
