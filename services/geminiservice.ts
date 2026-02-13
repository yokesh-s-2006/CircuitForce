import { GoogleGenAI } from "@google/genai";
import type { SensorData, Mood } from "../types.ts";

export const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY || '' });

// Shared voice configuration for consistency
// Utility functions for audio encoding/decoding
export const encodeBase64 = (data: Uint8Array): string => {
  let binaryString = '';
  for (let i = 0; i < data.length; i++) {
    binaryString += String.fromCharCode(data[i]);
  }
  return btoa(binaryString);
};

export const decodeBase64 = (base64String: string): Uint8Array => {
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const decodeAudioData = async (audioData: Uint8Array, audioContext: AudioContext): Promise<AudioBuffer> => {
  return new Promise((resolve, reject) => {
    audioContext.decodeAudioData(
      audioData.buffer as ArrayBuffer,
      (buffer) => resolve(buffer),
      (error) => reject(error)
    );
  });
};

export const getPlantInsights = async (data: SensorData, mood: Mood, imageBase64?: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: {
        parts: [
          {
            text: `You are an intelligent emotional support plant named Flora.
            Current sensor readings: 
            - Air Quality: ${data.airQuality}/100
            - Harmful Gas: ${data.harmfulGas} ppm
            - Soil Moisture: ${data.soilMoisture}%
            - Vibration: ${data.vibration}/10
            - Temperature: ${data.temperature}°C
            - Humidity: ${data.humidity}%
            - Emotion: ${mood}

            Speak ONLY in English. Give specific environmental advice in 2 sentences. 
            End with 2-3 positive emojis.`
          },
          ...(imageBase64 ? [{
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64.split(',')[1]
            }
          }] : [])
        ]
      },
    });
    return response.text || "I'm doing okay! 🌿✨";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm here for you. 💖🌱";
  }
};

export const getFloraVoiceResponse = async (userThought: string): Promise<{ audio: string; text: string }> => {
  try {
    const textGenResponse = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: {
        parts: [{
          text: `You are Flora, an emotional support plant companion. User said: "${userThought}"
          
          Respond with 1-2 supportive sentences. Be compassionate and brief. End with 1-2 relevant emojis.
          Respond ONLY in English.`
        }]
      }
    });

    const responseText = textGenResponse.text || "I'm here for you. 💖";

    return {
      audio: '',
      text: responseText
    };
  } catch (error) {
    console.error("Voice Response Error:", error);
    return {
      audio: '',
      text: "I'm here for you. 💖🌱"
    };
  }
};

export const startLiveAudioSession = async () => {
  try {
    const session = await (ai.models as any).liveConnectWebSocket({
      model: 'gemini-2.0-flash-exp'
    });
    return session;
  } catch (error) {
    console.error("Live session error:", error);
    throw error;
  }
};
