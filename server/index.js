import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";

const app = express();

//create server for manage communication with clients
const server = new McpServer({
  name: "example-server",
  version: "1.0.0",
});

// Creating an simple tool

server.tool(
  "addTwoNumber",
  "Add Two Numbers",
  {
    a: z.number(),
    b: z.number(),
  },
  async (args) => {
    const { a, b } = args;
    return {
      content:[
      {
        type: "text",
        text: `The sum of ${a} and ${b} is ${a + b}`,
      },
    ]}
  }
);

// an object used to store active client connections by their session ID.
const transports = {};

// Create a new SSE transport for sending real-time updates.
app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  transports[transport.sessionId] = transport;
  res.on("close", () => {
    delete transports[transport.sessiodId];
  });
  await server.connect(transport);
});

// method for incoming messaeges
app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send("No transport found for sessionid");
  }
});
app.listen(3000, () => {
  console.log("Server is running on 3000");
});
