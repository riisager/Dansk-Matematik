import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StoryData } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API Key is missing. Please ensure process.env.API_KEY is available.");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

const storySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A catchy title for the story in Danish.",
    },
    story_text: {
      type: Type.STRING,
      description: "The main story content, 500-700 words, written in Danish, exciting for a 15-year-old girl.",
    },
    real_world_fact: {
      type: Type.STRING,
      description: "A cool, true fact from the real world that was woven into the story (in Danish).",
    },
    math_problem: {
      type: Type.OBJECT,
      properties: {
        question: {
          type: Type.STRING,
          description: "A math word problem related to the story suitable for a 9th grade student (in Danish).",
        },
        answer: {
          type: Type.NUMBER,
          description: "The numeric answer to the math problem.",
        },
        unit: {
          type: Type.STRING,
          description: "The unit of the answer (e.g., 'meter', 'kroner', 'år'), if applicable.",
        }
      },
      required: ["question", "answer"],
    },
    reading_question: {
      type: Type.OBJECT,
      properties: {
        question: {
          type: Type.STRING,
          description: "A reading comprehension question in Danish checking a specific detail from the story text.",
        },
        options: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "4 possible answers in Danish, only one is correct.",
        },
        correct_option_index: {
          type: Type.INTEGER,
          description: "The index (0-3) of the correct option in the options array.",
        }
      },
      required: ["question", "options", "correct_option_index"],
    }
  },
  required: ["title", "story_text", "real_world_fact", "math_problem", "reading_question"],
};

export const generateStory = async (topic: string): Promise<StoryData> => {
  try {
    const prompt = `
      Skriv en spændende historie på dansk til en 15-årig pige.
      Historien skal være mellem 500 og 700 ord for at sikre tid til fordybelse og en ordentlig afslutning.
      
      Emne/Genre: ${topic || "En overraskende rejse eller et mysterium"}.
      
      Krav:
      1. Brug fiktive personer, men inkluder mindst én interessant faktuel ting fra den virkelige verden (historie, videnskab, geografi osv.).
      2. Sproget skal være engagerende, varieret og passe til en teenager. Undgå klichéer. Vær kreativ og uforudsigelig.
      3. Historien skal have en tydelig start, midte og slutning.
      4. Historien skal lede op til et matematisk problem, som læseren skal løse til sidst.
      5. Det matematiske problem skal være på 9. klasses niveau (f.eks. procent, geometri, ligninger, sandsynlighed) og være integreret i handlingen.
      6. Inkluder også et læseforståelsesspørgsmål (multiple choice), der tester om læseren har lagt mærke til en specifik detalje i teksten (ikke matematik, men handling/beskrivelse).
      
      Returner svaret som JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: storySchema,
        temperature: 0.9, // Higher creativity for variation
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as StoryData;
    } else {
      throw new Error("No text returned from model");
    }
  } catch (error) {
    console.error("Error generating story:", error);
    throw error;
  }
};