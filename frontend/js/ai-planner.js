// ========================================
// AI PLANNER CHAT JAVASCRIPT (Gemini style)
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // On page load, show auto-greet message from AI
  addAIMessage("What would you like help planning or organizing?");
});

const chatForm = document.getElementById('aiChatForm');
const chatInput = document.getElementById('aiChatInput');
const chatMessages = document.getElementById('aiChatMessages');

// Point API to backend (PRODUCTION)
const API_BASE = "https://eventhub-ouwj.onrender.com/api";

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  addUserMessage(text);
  chatInput.value = '';
  // Show loading spinner for AI reply
  addAIMessage("<div class='spinner spinner-sm'></div>", true);

  try {
    // Use correct endpoint (no double /api/)
    const response = await fetch(`${API_BASE}/ai-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text })
    });

    const data = await response.json();
    removeLastAIPlaceholder();
    addAIMessage(data.reply || "Sorry, couldn't get a response.");
  } catch (err) {
    removeLastAIPlaceholder();
    addAIMessage("Error connecting to AI service.");
  }
});

// Add user message to chat
function addUserMessage(text) {
  chatMessages.innerHTML += `<div class="ai-msg-user"><span>${escapeHTML(text)}</span></div>`;
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add AI message to chat with markdown/html formatting
function addAIMessage(text, isPlaceholder = false) {
  const html = markdownToHtml(text);
  chatMessages.innerHTML += `<div class="ai-msg-ai"><span>${html}</span></div>`;
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove the last AI loading spinner placeholder
function removeLastAIPlaceholder() {
  const list = chatMessages.querySelectorAll('.ai-msg-ai');
  if (list.length > 0) {
    const last = list[list.length - 1].querySelector('span');
    if (last && last.innerHTML.includes('spinner')) last.innerHTML = "";
  }
}

// Very basic markdown to HTML converter for headings, lists, line breaks
function markdownToHtml(md) {
  if (!md) return "";
  // Headings
  md = md.replace(/^###\s?(.*)$/gm, '<h3>$1</h3>');
  md = md.replace(/^##\s?(.*)$/gm, '<h2>$1</h2>');
  md = md.replace(/^#\s?(.*)$/gm, '<h1>$1</h1>');
  // Bullets and numbered lists
  md = md.replace(/^\s*[\*-]\s(.*)$/gm, '<li>$1</li>');
  md = md.replace(/^\s*\d+\.\s(.*)$/gm, '<li>$1</li>');
  // Wrap consecutive <li> items with <ul>
  md = md.replace(/(<li>[\s\S]*?<\/li>)/g, function(match) {
    return `<ul>${match}</ul>`;
  });
  // Paragraph breaks
  md = md.replace(/\n{2,}/g, '<br>');
  md = md.replace(/\n/g, '<br>');
  return md;
}

// Escape user input to prevent HTML injection
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
  });
}
