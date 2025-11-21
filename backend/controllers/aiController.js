// backend/controllers/aiController.js

const axios = require('axios');

const systemPrompt = `You are an expert Event Planner AI assistant for EventHub platform. Your role is to help event organizers plan, organize, and execute successful events.

You provide advice on:
- Event planning strategies and timelines
- Budget management and cost optimization
- Marketing and promotion ideas
- Venue selection and setup
- Attendee engagement strategies
- Event logistics and coordination
- Post-event follow-up and analytics
`;

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// POST handler for /api/ai-chat
exports.aiChatHandler = async (req, res) => {
  try {
    const userPrompt = req.body.prompt || '';
    if (!userPrompt) return res.status(400).json({ reply: "Missing prompt." });

    const fullPrompt = systemPrompt + "\nUser: " + userPrompt;

    // Prepare payload as per Gemini API docs
    const payload = {
      contents: [
        { parts: [{ text: fullPrompt }] }
      ]
    };

    // For debugging, view the payload
    // console.log('Sending payload:', JSON.stringify(payload, null, 2));

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Extract Gemini's reply
    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no reply from AI.";
    res.json({ reply });
  } catch (err) {
    console.error('Gemini AI error:', err?.response?.data || err?.message || err);
    res.status(500).json({ reply: "AI service error. Please try again later." });
  }
};
