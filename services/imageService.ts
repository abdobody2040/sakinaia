
import { GoogleGenAI } from "@google/genai";

/**
 * Checks if the user has selected their own API key.
 * This is required for high-quality image generation and to avoid shared quota limits.
 */
export async function checkHasApiKey(): Promise<boolean> {
  if (typeof window.aistudio?.hasSelectedApiKey === 'function') {
    return await window.aistudio.hasSelectedApiKey();
  }
  return true; // Fallback for environments where the check isn't available
}

/**
 * Opens the AI Studio key selection dialog.
 */
export async function openKeySelector(): Promise<void> {
  if (typeof window.aistudio?.openSelectKey === 'function') {
    await window.aistudio.openSelectKey();
  }
}

export async function generateThematicImage(prompt: string): Promise<string | null> {
  // Always create a new instance to ensure we use the most recent API key from the dialog
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: `A professional, high-quality minimalist artwork for a mental health app. 
            Subject: ${prompt}. 
            Style: Serene, soft pastel colors, clean lines, calming aesthetic, high resolution digital art. 
            No text, no watermarks.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    
    // If the error suggests quota issues or missing project, we should return null 
    // and let the UI handle the key selection flow.
    if (error?.message?.includes("429") || error?.message?.includes("RESOURCE_EXHAUSTED")) {
      console.warn("Quota exceeded. User may need to select a paid API key.");
    }
    
    return null;
  }
}

export const imageCache = {
  get: (key: string): string | null => localStorage.getItem(`img_cache_${key}`),
  set: (key: string, data: string) => {
    try {
      localStorage.setItem(`img_cache_${key}`, data);
    } catch (e) {
      console.warn("Storage full, clearing old images");
      // Basic cache eviction
      Object.keys(localStorage)
        .filter(k => k.startsWith('img_cache_'))
        .forEach(k => localStorage.removeItem(k));
      localStorage.setItem(`img_cache_${key}`, data);
    }
  }
};
