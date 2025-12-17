import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, AIAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to get the model based on complexity
const getModel = (complex: boolean = false) => complex ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';

export const generateSummary = async (data: ResumeData): Promise<string> => {
  const prompt = `
    Based on the following experience and skills, write a professional, concise executive summary (max 3 sentences) for a resume.
    
    Experience: ${JSON.stringify(data.experience)}
    Skills: ${JSON.stringify(data.skills)}
    Target Job: ${data.targetJobDescription || 'General'}
    
    Return only the summary text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: getModel(),
      contents: prompt,
    });
    return response.text?.trim() || '';
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Could not generate summary. Please check your API key.";
  }
};

export const improveDescription = async (text: string, role: string): Promise<string> => {
  const prompt = `
    Rewrite the following resume bullet point for a ${role} position to be more impactful, using action verbs and quantitative results where possible. Keep it concise.
    
    Original: "${text}"
    
    Return only the improved text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: getModel(),
      contents: prompt,
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("AI Improvement Error:", error);
    return text;
  }
};

export const analyzeResume = async (data: ResumeData): Promise<AIAnalysisResult> => {
  if (!data.targetJobDescription) {
    throw new Error("Job Description is required for analysis.");
  }

  const prompt = `
    Analyze this resume against the provided Job Description (JD). 
    Act as an ATS (Applicant Tracking System) expert.
    
    Resume Data: ${JSON.stringify(data)}
    Job Description: "${data.targetJobDescription}"
    
    Provide the output in JSON format with the following schema:
    {
      "score": number (0-100),
      "atsCompatibility": "Low" | "Medium" | "High",
      "keywordMatches": string[],
      "missingKeywords": string[],
      "suggestions": string (short paragraph on how to improve)
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: getModel(true), // Use pro for better analysis
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            atsCompatibility: { type: Type.STRING },
            keywordMatches: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.STRING },
          },
          required: ["score", "atsCompatibility", "keywordMatches", "missingKeywords", "suggestions"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysisResult;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
        score: 0,
        atsCompatibility: "Error",
        keywordMatches: [],
        missingKeywords: [],
        suggestions: "Failed to analyze resume. Please try again."
    };
  }
};