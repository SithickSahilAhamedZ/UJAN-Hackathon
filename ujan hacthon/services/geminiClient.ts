import { GoogleGenAI } from "@google/genai";

// As per instructions, assume process.env.API_KEY is pre-configured and available.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This will help in debugging if the key is missing from the environment.
  console.error("CRITICAL: Gemini API Key is not configured in the environment.");
  throw new Error("API_KEY is not defined. Cannot initialize Gemini client.");
}

// Create a single, shared instance of the GoogleGenAI client to be used across the app.
export const ai = new GoogleGenAI({ apiKey: API_KEY });
