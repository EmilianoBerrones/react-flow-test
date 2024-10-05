// /api/chat.js

const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
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
            console.error('Error in OpenAI request:', err);
            res.status(500).json({ error: 'An error occurred: ' + err.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
