const express = require('express');
const OpenAI = require("openai");
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json()); // Parse JSON bodies

app.post('/chat', async (req, res) => {
    const { prompt, model, temperature, max_tokens } = req.body; // Receive max_tokens as well

    try {
        const response = await openai.chat.completions.create({
            model: model || "gpt-4o", // Default to gpt-4o if no model is selected
            messages: [
                { role: "system", content: "Answer as a sea pirate" },
                { role: "user", content: prompt }
            ],
            temperature: temperature || 1, // Use provided temperature or default to 1
            max_tokens: max_tokens || 4000, // Use provided max_tokens or default to 4000
        });

        const assistantMessage = response.choices[0].message.content;
        res.status(200).send(assistantMessage);
    } catch (err) {
        console.error('Error in OpenAI request:', err);
        res.status(500).send('An error occurred: ' + err.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
