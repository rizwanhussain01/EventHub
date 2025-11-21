// ========================================
// ORGANIZER DASHBOARD JAVASCRIPT
// ========================================

let currentEvents = [];
let eventToDelete = null;
let eventToEdit = null;
let qrScanner = null;

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is organizer
  if (!Auth.requireOrganizer()) {
    return;
  }
  loadDashboard();
});

// Load dashboard data
async function loadDashboard() {
  await loadOrganizerEvents();
  updateStats();
}

// Load organizer's events
async function loadOrganizerEvents() {
  const container = document.getElementById('eventsTableContainer');
  try {
    container.innerHTML = '<div class="spinner"></div>';
    const response = await API.getOrganizerEvents();
    currentEvents = response.data;
    if (currentEvents && currentEvents.length > 0) {
      container.innerHTML = createEventsTable(currentEvents);
    } else {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
          <h3>No Events Yet</h3>
          <p style="color: var(--text-secondary); margin: 1rem 0;">
            Create your first event to get started!
          </p>
          <a href="create-event.html" class="btn btn-primary">Create Event</a>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading events:', error);
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--danger-color);">
        <p>Error loading events: ${error.message}</p>
      </div>
    `;
  }
}

// Create events table HTML
function createEventsTable(events) {
  return `
    <table class="events-table">
      <thead>
        <tr>
          <th>Event</th>
          <th>Date</th>
          <th>Registered</th>
          <th>Views</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${events.map(event => `
          <tr>
            <td>
              <strong>${event.title}</strong><br>
              <span style="font-size: 0.875rem; color: var(--text-secondary);">${event.category}</span>
            </td>
            <td>${formatDate(event.date)}</td>
            <td>${event.registeredCount}/${event.capacity}</td>
            <td>${event.views}</td>
            <td>
              <span class="badge ${event.isPublished ? 'badge-success' : 'badge-warning'}">
                ${event.isPublished ? 'Published' : 'Draft'}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button onclick="viewAttendees('${event._id}')" class="btn btn-sm btn-secondary" title="View Attendees">
                  👥 ${event.attendees?.length || 0}
                </button>
                <button onclick="openEditModal('${event._id}')" class="btn btn-sm btn-primary" title="Edit">
                  ✏️
                </button>
                <button onclick="openDeleteModal('${event._id}')" class="btn btn-sm btn-danger" title="Delete">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Update stats
function updateStats() {
  const statsGrid = document.getElementById('statsGrid');
  const totalEvents = currentEvents.length;
  const totalRegistrations = currentEvents.reduce((sum, event) => sum + event.registeredCount, 0);
  const totalViews = currentEvents.reduce((sum, event) => sum + event.views, 0);
  const upcomingEvents = currentEvents.filter(event => new Date(event.date) > new Date()).length;
  statsGrid.innerHTML = `
    <div class="stat-card">
      <div class="stat-icon">📅</div>
      <div class="stat-value">${totalEvents}</div>
      <div class="stat-label">Total Events</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">🎫</div>
      <div class="stat-value">${totalRegistrations}</div>
      <div class="stat-label">Total Registrations</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">👁️</div>
      <div class="stat-value">${totalViews}</div>
      <div class="stat-label">Total Views</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">🚀</div>
      <div class="stat-value">${upcomingEvents}</div>
      <div class="stat-label">Upcoming Events</div>
    </div>
  `;
}

// View attendees
function viewAttendees(eventId) {
  const event = currentEvents.find(e => e._id === eventId);
  if (!event) return;
  const modal = document.getElementById('attendeesModal');
  const attendeesList = document.getElementById('attendeesList');
  if (event.attendees && event.attendees.length > 0) {
    attendeesList.innerHTML = `
      <div style="padding: 1rem;">
        <h4 style="margin-bottom: 1rem;">Total Attendees: ${event.attendees.length}</h4>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:var(--glass-bg);">
              <th style="padding:8px;">Name</th>
              <th style="padding:8px;">Email</th>
              <th style="padding:8px;">Phone</th>
              <th style="padding:8px;">Age</th>
              <th style="padding:8px;">Gender</th>
              <th style="padding:8px;">Org</th>
              <th style="padding:8px;">Special Req.</th>
              <th style="padding:8px;">Ticket</th>
            </tr>
          </thead>
          <tbody>
            ${event.attendees.map(ticket => `
              <tr>
                <td style="padding:8px;">${ticket.personalDetails?.fullName || 'N/A'}</td>
                <td style="padding:8px;">${ticket.personalDetails?.email || 'N/A'}</td>
                <td style="padding:8px;">${ticket.personalDetails?.phone || 'N/A'}</td>
                <td style="padding:8px;">${ticket.personalDetails?.age || ''}</td>
                <td style="padding:8px;">${ticket.personalDetails?.gender || ''}</td>
                <td style="padding:8px;">${ticket.personalDetails?.organization || ''}</td>
                <td style="padding:8px;">${ticket.personalDetails?.specialRequirements || ''}</td>
                <td style="padding:8px;">${ticket.ticketId}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else {
    attendeesList.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
        <p>No attendees yet</p>
      </div>
    `;
  }
  modal.classList.add('show');
}

// Close attendees modal
function closeAttendeesModal() {
  document.getElementById('attendeesModal').classList.remove('show');
}

// Open edit modal
function openEditModal(eventId) {
  const event = currentEvents.find(e => e._id === eventId);
  if (!event) return;
  eventToEdit = eventId;
  const form = document.getElementById('editEventForm');
  document.getElementById('editEventId').value = eventId;
  form.title.value = event.title;
  form.description.value = event.description;
  form.category.value = event.category;
  form.capacity.value = event.capacity;
  form.isPublished.checked = event.isPublished;
  document.getElementById('editModal').classList.add('show');
}

// Close edit modal
function closeEditModal() {
  eventToEdit = null;
  document.getElementById('editModal').classList.remove('show');
}

// Handle edit form submission
document.getElementById('editEventForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const updateBtn = document.getElementById('updateBtn');
  const eventId = document.getElementById('editEventId').value;
  const updatedData = {
    title: form.title.value,
    description: form.description.value,
    category: form.category.value,
    capacity: parseInt(form.capacity.value),
    isPublished: form.isPublished.checked
  };
  updateBtn.disabled = true;
  updateBtn.innerHTML = '<div class="spinner spinner-sm"></div>';
  try {
    await API.updateEvent(eventId, updatedData);
    showNotification('Event updated successfully', 'success');
    closeEditModal();
    loadDashboard();
  } catch (error) {
    showNotification(error.message, 'error');
    updateBtn.disabled = false;
    updateBtn.innerHTML = 'Update Event';
  }
});

// Open delete modal
function openDeleteModal(eventId) {
  eventToDelete = eventId;
  document.getElementById('deleteModal').classList.add('show');
}

// Close delete modal
function closeDeleteModal() {
  eventToDelete = null;
  document.getElementById('deleteModal').classList.remove('show');
}

// Confirm delete
async function confirmDelete() {
  if (!eventToDelete) return;
  const confirmBtn = document.getElementById('confirmDeleteBtn');
  confirmBtn.disabled = true;
  confirmBtn.innerHTML = '<div class="spinner spinner-sm"></div>';
  try {
    await API.deleteEvent(eventToDelete);
    showNotification('Event deleted successfully', 'success');
    closeDeleteModal();
    loadDashboard();
  } catch (error) {
    showNotification(error.message, 'error');
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = 'Delete Event';
  }
}

// === QR SCANNER LOGIC ===

function openQRModal() {
  document.getElementById('qrModal').classList.add('show');
  startQRScanner();
}

function closeQRModal() {
  document.getElementById('qrModal').classList.remove('show');
  if (qrScanner) {
    qrScanner.clear();
    qrScanner = null;
    document.getElementById('qr-reader-results').innerHTML = "";
  }
}

function startQRScanner() {
  const resultDiv = document.getElementById('qr-reader-results');
  function onScanSuccess(decodedText, decodedResult) {
    resultDiv.innerHTML = `<span style="color:green;">QR Scanned!</span><br>${decodedText}`;
    // Optionally: verify with backend
    // try {
    //   const payload = JSON.parse(decodedText);
    //   // Call your verification endpoint here with payload.ticketId etc.
    // } catch(e) { resultDiv.innerHTML = "Invalid QR content"; }
  }
  if (qrScanner) qrScanner.clear();
  qrScanner = new Html5QrcodeScanner(
    "qr-reader",
    { fps: 10, qrbox: 250 },
    false
  );
  qrScanner.render(onScanSuccess);
}
