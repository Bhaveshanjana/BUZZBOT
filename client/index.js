const readline = require("readline/promises");
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv").config();

const chatHistory = [];

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function chatloop() {
  const question = await rl.question("You:");

  chatHistory.push({
    role: "user",
    parts: [
      {
        text: question,
        type: "text",
      },
    ],
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: chatHistory,
  });
  console.log(response.candidates[0].content.parts[0].text);

  chatloop();
}
chatloop();
