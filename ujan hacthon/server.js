// A simple backend server to handle authentication and secure API calls.
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = 3001;

// IMPORTANT: In a real application, use a .env file to store your API key
// To run, make sure you have the API_KEY environment variable set.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set. Please add it to your environment.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

app.use(cors());
app.use(express.json());

// --- Mock Database & Authentication ---
const ADMIN_USER = {
  email: 'admin@pilgrimpath.com',
  password: 'admin', // In a real app, this should be a hashed password
};

// A simple in-memory store for session tokens. In production, use a proper database or cache like Redis.
const activeTokens = new Set();

// Login Endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
    // In a real app, use JWTs (JSON Web Tokens) for secure, stateless authentication.
    // For this example, we'll create a simple, secure random token.
    const token = require('crypto').randomBytes(32).toString('hex');
    activeTokens.add(token);
    console.log('Admin logged in, token issued.');
    return res.json({ message: 'Admin login successful', token });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

// --- Middleware to protect admin routes ---
const checkAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  if (activeTokens.has(token)) {
    next(); // Token is valid, proceed to the route
  } else {
    return res.status(403).json({ message: 'Access denied. Invalid token.' });
  }
};


// --- Protected API Routes for Admin Dashboard ---

// Endpoint to get live dashboard data
app.get('/api/dashboard-data', checkAuth, (req, res) => {
  console.log('Authenticated request received for dashboard data.');
  // Mock data - in a real app, you would fetch this from your database
  res.json({
    liveCrowdCount: `~${(15000 + Math.floor(Math.random() * 1000)).toLocaleString()}`,
    crowdChange: `${(Math.random() * 10).toFixed(1)}%`,
    crowdChangeType: Math.random() > 0.5 ? 'increase' : 'decrease',
    bookingsToday: (800 + Math.floor(Math.random() * 100)).toString(),
    bookingsChange: `${(Math.random() * 5).toFixed(1)}%`,
    bookingsChangeType: Math.random() > 0.5 ? 'increase' : 'decrease',
    incidentsToday: (40 + Math.floor(Math.random() * 15)).toString(),
    incidentsChange: `${(Math.random() * 15).toFixed(1)}%`,
    incidentsChangeType: 'increase',
  });
});

// Secure proxy endpoint for Gemini API
app.post('/api/ask-gemini', checkAuth, async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }
  
  console.log(`Authenticated request received to ask Gemini: "${prompt}"`);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert data analyst for the PilgrimPath app admin. Based on the user's query and the app's data context, provide concise, data-driven insights. Be helpful and direct.",
      }
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("Error calling Gemini API from backend:", error);
    res.status(500).json({ message: "Error contacting the Gemini API." });
  }
});


// --- Public API Routes ---

// Public proxy endpoint for the user-facing Gemini chat
app.post('/api/ask-gemini-public', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  console.log(`Public request received to ask Gemini: "${prompt}"`);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "I am your personal PilgrimPath guide for the Ujjain Simhastha. I'm here to help you directly. Ask me for the safest routes, where to find food, safety tips, or any other guidance you need. I will give you clear and concise answers in the language you use (English or Hindi). How can I assist you right now?",
      }
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("Error calling Gemini API from public endpoint:", error);
    res.status(500).json({ message: "Error contacting the Gemini API." });
  }
});


app.listen(port, () => {
  console.log(`
    ============================================
    PilgrimPath Backend Server is running!
    - Listening on http://localhost:${port}
    - Run this server with 'node server.js'
    - It handles admin login and provides a
      secure proxy to the Gemini API.
    ============================================
  `);
});