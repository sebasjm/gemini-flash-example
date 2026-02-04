
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateProductDescription(productName: string, category: string): Promise<string> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a compelling, professional e-commerce product description for a product named "${productName}" in the category "${category}". Keep it under 100 words and focus on benefits.`,
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Failed to generate description. Please write manually.";
  }
}

export async function generateCatalogSummary(catalogName: string, productNames: string[]): Promise<string> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a catchy marketing introduction for a curated catalog called "${catalogName}" which features products like: ${productNames.join(', ')}. Make it sound exclusive and inviting for customers.`,
    });
    return response.text || "No summary generated.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Beautifully curated collection just for you.";
  }
}
