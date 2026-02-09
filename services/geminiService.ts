
import { GoogleGenAI } from "@google/genai";

// Modelo 1: Fast AI responses (gemini-2.5-flash-lite)
export async function getFastVehicleRecommendation(userProfile: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest',
      contents: `Você é o concierge rápido da Maggi. O cliente disse: "${userProfile}". 
      Dê uma dica ultra rápida (1 frase) sobre um carro ou serviço Maggi.`,
    });
    return response.text || "Como posso ajudar com seu novo Maggi?";
  } catch (error) {
    return "Consulte nossas ofertas exclusivas!";
  }
}

// Modelo 2: AI powered chatbot (gemini-3-pro-preview)
export async function startMaggiChat(history: {role: 'user'|'model', text: string}[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: 'Você é o MaggiBot, especialista em veículos Maggi (VW, Toyota, BYD, etc). Ajude o cliente com dúvidas sobre estoque, financiamento e consórcio. Seja premium, técnico e atencioso.',
    }
  });
  
  const lastMessage = history[history.length - 1].text;
  const response = await chat.sendMessage({ message: lastMessage });
  return response.text;
}

// Modelo 3: Google Maps Grounding (gemini-2.5-flash)
export async function getUnitsWithMaps(lat?: number, lng?: number) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-latest',
    contents: "Onde ficam as concessionárias Maggi mais próximas e quais são seus horários?",
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: lat && lng ? { latitude: lat, longitude: lng } : undefined
        }
      }
    },
  });
  
  const text = response.text;
  const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return { text, links };
}
