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
app.use(express.text());

app.post('/chat', async (req, res) => {
    const userPrompt = req.body; // Expecting plain text in the request body

    try {
        // Make a request to the OpenAI API without specifying response_format or json_schema
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a helpful assistant." },  // Static system prompt
                { role: "user", content: userPrompt } // User's prompt from the request
            ],
            temperature: 1,
            max_tokens: 4000,
        });

        // Extract the assistant's message from the API response
        const assistantMessage = response.choices[0].message.content;

        // Send the assistant's message as plain text
        res.status(200).send(assistantMessage);
    } catch (err) {
        console.error('Error in OpenAI request:', err);
        // Send error message as plain text
        res.status(500).send('An error occurred: ' + err.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});