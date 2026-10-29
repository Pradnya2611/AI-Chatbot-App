import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/chatbot", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      console.error("OpenRouter API key is missing");
      return res.status(500).json({
        error: "OpenRouter API key is not configured",
        details: "Please check your environment variables",
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: question },
      ],
      model: "gpt-4o-mini",
    });

    return res.json(completion.choices[0].message.content);
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      error: "An error occurred while processing your request.",
      details: error.message,
    });
  }
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running properly!" });
});

export default app;
