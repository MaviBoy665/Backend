const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend to call this API

const OPENAI_KEY = process.env.OPENAI_KEY; // Your key stored safely in Render

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.json({ reply: "Please send a message." });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
        max_tokens: 500
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't respond.";
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.json({ reply: "Error contacting AI." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
