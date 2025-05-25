import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
    httpOptions: { apiVersion: "v1alpha" },
});

app.post("/generate", async (req, res) => {
    const experienceText = req.body.experienceText;
    console.log("收到background的內容：", experienceText);

    try {
        // 用官方推薦的 model 名稱
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `based on person's experience:\n\n${experienceText}\n\nWrite a friendly short message to make connection and introduce my company which in common. invite a person with 15 minutes call.`,

        });

        const text = response.text;
        console.log("AI 回覆：", text);

        res.json({ message: text });
    } catch (err) {
        console.error("AI 回傳錯誤：", err);
        res.status(500).json({ error: "AI 回傳失敗" });
    }
});

app.listen(port, () => {
    console.log(` Server running on http://localhost:${port}`);
});
