// backend/routes/ai.js

const express = require('express');
const router = express.Router();
const { aiChatHandler } = require('../controllers/aiController');

// POST /api/ai-chat
router.post('/', aiChatHandler);

module.exports = router;
