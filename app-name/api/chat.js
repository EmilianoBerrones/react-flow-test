// /api/chat.js

const express = require('express');
const OpenAI = require("openai");
const cors = require('cors');
require("dotenv").config();

// Crear una aplicación Express
const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configurar CORS
app.use(cors({
  origin: '*',  // Permitir solicitudes desde cualquier origen, o cambiarlo a tu dominio si es necesario
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Parsear los cuerpos de las solicitudes a JSON
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const { prompt, model, temperature, max_tokens, fullSystemPrompt } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: model || "gpt-4o",
            messages: [
                { role: "system", content: fullSystemPrompt },
                { role: "user", content: prompt }
            ],
            temperature: temperature || 1,
            max_tokens: max_tokens || 4000,
        });

        const assistantMessage = response.choices[0].message.content;
        res.status(200).json({ message: assistantMessage });
    } catch (err) {
        console.error('Error in OpenAI request:', err.response ? err.response.data : err.message);
        res.status(500).json({ error: 'An error occurred: ' + (err.response ? err.response.data : err.message) });
    }
});

// Exportar la app para que funcione en Vercel
module.exports = app;
