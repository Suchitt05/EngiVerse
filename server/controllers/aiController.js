import { GoogleGenAI } from "@google/genai";

// ==========================================
// ASK AI
// ==========================================

export const askAI = async (req, res) => {
  try {
    const { message } = req.body;

    // Check message
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Check Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY is missing from server .env",
      });
    }

    // Create Gemini client
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // AI instruction
    const prompt = `
You are EngiVerse AI Assistant.

EngiVerse is an engineering innovation platform for students.

Help users with:

- Engineering project ideas
- IoT projects
- Electronics and Communication Engineering
- Computer Science
- Programming
- MERN Stack
- Artificial Intelligence
- Machine Learning
- Resume improvement
- Internship preparation
- Career guidance
- Technical questions
- Final year projects

Give simple, practical and beginner-friendly answers.

When suggesting an engineering project, provide:

1. Project title
2. Short description
3. Hardware/software requirements
4. Main features
5. Technologies used
6. Future improvements

User question:

${message}
`;

    // Generate AI response
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const answer = response.text;

    return res.status(200).json({
      success: true,
      answer,
    });

  } catch (error) {
    console.error("Gemini AI Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI service failed",
      error: error.message,
    });
  }
};