# 🐦 MCP Twitter Poster

A simple developer tool that lets you post on **Twitter (X)** through an **MCP (Model Context Protocol)** server. This project wraps the official [twitter-api-v2](https://github.com/PLhery/node-twitter-api-v2) library to expose a tool that can be called by an AI agent to tweet on your behalf.

---

## ✨ Features

- ✅ Post tweets via Twitter/X API
- 🤖 Exposes a tool for AI assistants via `server.tool(...)`
- 🔐 Uses OAuth 1.0a (safe & secure with `Read and Write` permissions)
- ⚙️ Fully customizable and ready to extend

---

## 🧰 Requirements

- Node.js (v18+ recommended)
- Twitter Developer account
- MCP-compatible AI client (like Gemini Assistants or similar)

---

## 🚀 Setup

#### 1. Clone the repo

```bash
git clone https://github.com/Bhaveshanjana/BUZZBOT
cd BUZZBOT

```

#### 2. Install dependencies
```
npm install

```
#### 3. Set up your Twitter App
- Go to the Twitter Developer Dashboard

- Create a new Project and App

- Under App Settings > User authentication settings, set:

🔘 App permissions: Read and Write

🔘 Type of app: Web App, Automated App or Bot

  Callback URL: http://localhost:3000/callback

 Website URL: https://example.com

- Save, then go to Keys and tokens and generate:

- API Key + Secret 

- Access Token + Secret

#### 4. Create a .env file
- Paste your credentials to .env like **.env.example**

#### 5. Start the Server & client
```
nodemon index.js 
```
---

## 🛠 Usage
Once the server is running, you can ask your AI assistant to post on Twitter by saying:

Post 'create an post on x "how Ai change developer life"

---
## 💬 Contact

For any feedback, suggestions or collaborations: 📧 [bhaveshanjana58@gmail.com]


