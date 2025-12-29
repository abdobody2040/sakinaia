
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

/**
 * Custom error type to differentiate permission/quota issues.
 */
export class ImageGenError extends Error {
  constructor(public code: number, message: string) {
    super(message);
    this.name = 'ImageGenError';
  }
}

export async function generateThematicImage(prompt: string): Promise<string | null> {
  // Always create a new instance right before the call to ensure the latest API key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    // Defaulting to gemini-2.5-flash-image as it is the standard for general tasks 
    // and often has broader access permissions than the preview 'pro' model.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
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
          aspectRatio: "1:1"
        },
      },
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    
    const errorMsg = error?.message || "";
    // Handle 403 (Permission Denied) and 429 (Resource Exhausted)
    if (errorMsg.includes("403") || errorMsg.includes("PERMISSION_DENIED")) {
      throw new ImageGenError(403, "Permission denied. A valid project key may be required.");
    }
    if (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED")) {
      throw new ImageGenError(429, "Quota exhausted. Please use a paid API key.");
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
