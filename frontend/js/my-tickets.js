// ========================================
// MY TICKETS PAGE JAVASCRIPT
// ========================================

let ticketToCancel = null;

document.addEventListener('DOMContentLoaded', () => {
  // Check authentication
  if (!Auth.requireAuth()) {
    return;
  }

  loadMyTickets();
});

// Load user's tickets
async function loadMyTickets() {
  const container = document.getElementById('ticketsContainer');
  try {
    showSkeleton(container, 3);

    const response = await API.getMyTickets();

    if (response.data && response.data.length > 0) {
      container.innerHTML = response.data.map(ticket => createTicketCard(ticket)).join('');
    } else {
      container.innerHTML = `
        <div class="no-tickets">
          <div class="no-tickets-icon">🎫</div>
          <h3>No Tickets Yet</h3>
          <p style="color: var(--text-secondary); margin: 1rem 0;">
            You haven't registered for any events yet.
          </p>
          <a href="events.html" class="btn btn-primary">Browse Events</a>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading tickets:', error);
    container.innerHTML = `
      <div class="no-tickets">
        <h3>Unable to load tickets</h3>
        <p style="color: var(--text-secondary);">${error.message}</p>
      </div>
    `;
  }
}

// Create ticket card HTML (includes QR code)
function createTicketCard(ticket) {
  const event = ticket.eventId;
  const eventDate = formatDate(event.date);
  const isPastEvent = new Date(event.date) < new Date();

  return `
    <div class="ticket-card slide-up">
      <div class="ticket-header">
        <img src="${event.bannerImage}" alt="${event.title}">
        <span class="ticket-badge">${isPastEvent ? 'Attended' : 'Upcoming'}</span>
      </div>
      <div class="ticket-content">
        <h3 class="ticket-title">${event.title}</h3>
        <div class="ticket-info">
          <div class="ticket-info-item"><span>📅</span><span>${eventDate}</span></div>
          <div class="ticket-info-item"><span>🕐</span><span>${event.time}</span></div>
          <div class="ticket-info-item"><span>📍</span><span>${event.venue}, ${event.city}</span></div>
          <div class="ticket-info-item"><span>🎫</span><span>${event.category}</span></div>
        </div>
        <div class="ticket-id">
          Ticket ID: ${ticket.ticketId}
        </div>
        <div class="ticket-qr" style="text-align:center; margin-top:1rem;">
          ${ticket.qrCode ? `<img src="${ticket.qrCode}" alt="Ticket QR Code" style="height:130px; margin:auto; border-radius:12px; background:#fff; box-shadow:0 2px 8px 0 rgba(0,0,0,0.08);">` : `<span style="color:var(--text-secondary);font-size:0.85rem;">No QR code</span>`}
          <div style="font-size:0.85rem; color:var(--text-muted); margin-top:8px;">Scan at Entry</div>
        </div>
        <div class="ticket-actions">
          <a href="event-details.html?id=${event._id}" class="btn btn-primary" style="flex: 1;">
            View Event
          </a>
          ${!isPastEvent ? `
            <button 
              onclick="openCancelModal('${ticket._id}')" 
              class="btn btn-danger"
              title="Cancel registration"
            >
              Cancel
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

// Open cancel modal
function openCancelModal(ticketId) {
  ticketToCancel = ticketId;
  document.getElementById('cancelModal').classList.add('show');
}

// Close cancel modal
function closeCancelModal() {
  ticketToCancel = null;
  document.getElementById('cancelModal').classList.remove('show');
}

// Confirm cancellation
async function confirmCancel() {
  if (!ticketToCancel) return;

  const confirmBtn = document.getElementById('confirmCancelBtn');
  confirmBtn.disabled = true;
  confirmBtn.innerHTML = '<div class="spinner spinner-sm"></div>';

  try {
    await API.cancelTicket(ticketToCancel);

    showNotification('Registration cancelled successfully', 'success');
    closeCancelModal();

    // Reload tickets
    setTimeout(() => {
      loadMyTickets();
    }, 500);

  } catch (error) {
    showNotification(error.message, 'error');
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = 'Yes, Cancel';
  }
}
