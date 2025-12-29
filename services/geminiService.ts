
import { GoogleGenAI, Type } from "@google/genai";
import { ThinkingTrap } from "../types";

// Fix: Initialized GoogleGenAI strictly following guidelines by using direct process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAIReframe(thought: string, traps: ThinkingTrap[]): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User thought: "${thought}". Identified traps: ${traps.join(', ')}. 
      Acting as a CBT therapist, provide a brief, compassionate, and realistic Arabic reframe of this thought. 
      Keep it under 50 words. Focus on the DARE methodology (Acceptance).`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    // Fix: Accessing generated text using the .text property as per GenerateContentResponse guidelines.
    return response.text?.trim() || "حاول التفكير في الأمر من منظور أكثر واقعية وهدوءاً.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "القبول هو المفتاح. لا بأس بالشعور بالقلق الآن.";
  }
}
