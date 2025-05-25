import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "" });

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: "Based on person's experience to make different tone to make connection and introduce my company which in common. invite a person with 15 minutes call.",
        // contents: "Explain how AI works in a few words",
    });
    console.log(response.text);
}

await main();
