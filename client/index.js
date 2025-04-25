import readline from "readline/promises";
import { GoogleGenAI } from "@google/genai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import dotenv from "dotenv";

dotenv.config();
const chatHistory = [];
let tools = [];

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const mcpClient = new Client({
  name: "example-client",
  version: "1.0.0",
});
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// loads available tools so ai use them
mcpClient
  .connect(new SSEClientTransport(new URL("http://localhost:3000/sse")))
  .then(async () => {
    console.log("connected to mcp server");
    tools = (await mcpClient.listTools()).tools.map((tool) => {
      return {
        name: tool.name,
        description: tool.description,
        parameters: {
          type: tool.inputSchema.type,
          properties: tool.inputSchema.properties,
          required: tool.inputSchema.required,
        },
      };
    });
    chatloop();
  });

async function chatloop(toolCall) {
  if (toolCall) {
    console.log("Calling tool", toolCall.name);

    chatHistory.push({
      role: "model",
      parts: [
        {
          text: `Calling tool ${toolCall.name}`,
          type: "text",
        },
      ],
    });

    const toolResult = await mcpClient.callTool({
      name: toolCall.name,
      arguments: toolCall.args,
    });

    chatHistory.push({
      role: "user",
      parts: [
        {
          text: "Tool result " + toolResult.content[0].text,
          type: "text",
        },
      ],
    });
  } else {
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
  }

  // sends user data to ai with tools if asked
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: chatHistory,
    config: {
      tools: [
        {
          functionDeclarations: tools,
        },
      ],
    },
  });
  const functionCall = response.candidates[0].content.parts[0].functionCall;

  const responseText = response.candidates[0].content.parts[0].text;
  if (functionCall) {
    return chatloop(functionCall);
  }
  chatHistory.push({
    role: "model",
    parts: [
      {
        text: responseText,
        type: "text",
      },
    ],
  });
  console.log(`AI: ${responseText}`);

  chatloop();
}
