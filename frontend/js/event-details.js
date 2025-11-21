// ========================================
// EVENT DETAILS PAGE JAVASCRIPT
// ========================================

let currentEvent = null;

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');

  if (!eventId) {
    showNotification('Invalid event ID', 'error');
    setTimeout(() => window.location.href = 'events.html', 1500);
    return;
  }

  loadEventDetails(eventId);
  loadRecommendedEvents();
  setupRegisterModal(eventId);
});

// Load event details
async function loadEventDetails(eventId) {
  const container = document.getElementById('eventDetailsContainer');
  try {
    showLoading('eventDetailsContainer');
    const response = await API.getEventById(eventId);
    currentEvent = response.data;
    container.innerHTML = createEventDetailsHTML(currentEvent);

    // Attach registration button handler after details load
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
      registerBtn.onclick = () => {
        document.getElementById('registrationModal').style.display = 'flex';
        document.getElementById('registerStatus').textContent = '';
      };
    }

    if (new Date(currentEvent.date) > new Date()) {
      startCountdown(currentEvent.date, 'countdown');
    }
  } catch (error) {
    console.error('Error loading event details:', error);
    container.innerHTML = `
      <div class="no-events">
        <h3>Event not found</h3>
        <p>${error.message}</p>
        <a href="events.html" class="btn btn-primary">Back to Events</a>
      </div>
    `;
  }
}

function createEventDetailsHTML(event) {
  const eventDate = formatDate(event.date);
  const seatsLeft = event.capacity - event.registeredCount;
  const isPastEvent = new Date(event.date) < new Date();
  const isFullyBooked = seatsLeft <= 0;
  const isLoggedIn = Auth.isLoggedIn();

  return `
    <div class="event-details fade-in">
      <div class="event-main">
        <img src="${event.bannerImage}" alt="${event.title}" class="event-banner">
        <div class="event-content">
          <span class="badge badge-primary">${event.category}</span>
          <h1 style="margin: 1rem 0;">${event.title}</h1>
          <div class="event-meta">
            <div class="event-meta-item"><span>📅</span><span>${eventDate}</span></div>
            <div class="event-meta-item"><span>🕐</span><span>${event.time}</span></div>
            <div class="event-meta-item"><span>📍</span><span>${event.venue}, ${event.city}</span></div>
            <div class="event-meta-item"><span>👁️</span><span>${event.views} views</span></div>
          </div>
          ${event.tags && event.tags.length > 0 ? `
            <div class="event-tags">
              ${event.tags.map(tag => `<span class="event-tag">#${tag}</span>`).join('')}
            </div>
          ` : ''}
          <h3>About This Event</h3>
          <p style="color: var(--text-secondary); line-height: 1.8; white-space: pre-wrap;">${event.description}</p>
          <div class="organizer-info">
            <h4>Organized By</h4>
            <p style="color: var(--text-secondary); margin: 0.5rem 0;">${event.organizerId?.name || 'Unknown Organizer'}</p>
            <p style="color: var(--text-muted); font-size: 0.875rem; margin: 0;">${event.organizerId?.email || ''}</p>
          </div>
        </div>
      </div>
      <div class="event-sidebar">
        <div class="event-card-sidebar glass-card">
          ${!isPastEvent ? `<div id="countdown" class="countdown" style="margin-bottom: 2rem;"></div>` : `<p class="badge badge-danger" style="margin-bottom: 1rem;">Event Ended</p>`}
          <div style="margin: 2rem 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="color: var(--text-secondary);">Registered</span>
              <span style="font-weight: 600;">${event.registeredCount}/${event.capacity}</span>
            </div>
            <div style="background: var(--glass-bg); height: 8px; border-radius: 4px; overflow: hidden;">
              <div style="background: var(--primary-color); height: 100%; width: ${(event.registeredCount/event.capacity)*100}%;"></div>
            </div>
          </div>
          <div style="font-size: 1.5rem; font-weight: 700; color: ${seatsLeft > 0 ? 'var(--accent-color)' : 'var(--danger-color)'}; margin: 1rem 0;">
            ${seatsLeft > 0 ? `${seatsLeft} Seats Available` : 'Fully Booked'}
          </div>
          ${isLoggedIn ? `
            ${!isPastEvent && !isFullyBooked ? `
              <button class="btn btn-primary btn-lg glow" style="width: 100%;" id="registerBtn">
                Register Now
              </button>
            ` : `
              <button class="btn btn-secondary btn-lg" style="width: 100%;" disabled>
                ${isPastEvent ? 'Event Ended' : 'Fully Booked'}
              </button>
            `}
          ` : `
            <a href="login.html" class="btn btn-primary btn-lg" style="width: 100%;">Login to Register</a>
          `}
          <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--glass-border);">
            <h4 style="font-size: 1rem; margin-bottom: 1rem;">Share This Event</h4>
            <div style="display: flex; gap: 0.5rem; justify-content: center;">
              <button onclick="shareEvent('twitter')" class="btn btn-icon btn-secondary">𝕏</button>
              <button onclick="shareEvent('facebook')" class="btn btn-icon btn-secondary">f</button>
              <button onclick="shareEvent('linkedin')" class="btn btn-icon btn-secondary">in</button>
              <button onclick="copyEventLink()" class="btn btn-icon btn-secondary">🔗</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Registration modal setup
function setupRegisterModal(eventId) {
  const closeModalBtn = document.getElementById('closeModal');
  if (closeModalBtn) {
    closeModalBtn.onclick = function() {
      document.getElementById('registrationModal').style.display = 'none';
      document.getElementById('registerStatus').textContent = '';
    };
  }

  const form = document.getElementById('registrationForm');
  if (form) {
    form.onsubmit = async function(e) {
      e.preventDefault();
      const formData = new FormData(form);
      const personalDetails = Object.fromEntries(formData.entries());
      console.log(personalDetails);

      if (!personalDetails.fullName || !personalDetails.email || !personalDetails.phone) {
        document.getElementById('registerStatus').textContent = "Full name, email, and phone are required!";
        return;
      }

      document.getElementById('registerStatus').textContent = "Registering...";

      try {
        const response = await API.registerForEvent(eventId, personalDetails);
        document.getElementById('registerStatus').textContent = response.message || "Registration successful!";
        setTimeout(() => {
          document.getElementById('registrationModal').style.display = 'none';
          showRegistrationSuccess();
          loadEventDetails(eventId);
        }, 1200);
      } catch (error) {
        document.getElementById('registerStatus').textContent = error.message || "Registration failed";
      }
    };
  }
}

// Show registration confirmation
function showRegistrationSuccess() {
  const confirmModal = document.getElementById('confirmModal');
  if (confirmModal) {
    confirmModal.classList.add('show');
  }
}

// Close confirmation modal
function closeModal() {
  document.getElementById('confirmModal').classList.remove('show');
}

// Share event
function shareEvent(platform) {
  const url = window.location.href;
  const title = currentEvent?.title || 'Check out this event';
  let shareUrl = '';
  switch(platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      break;
  }
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
}

// Copy event link
function copyEventLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url)
    .then(() => {
      showNotification('Link copied to clipboard!', 'success');
    }).catch(() => {
      showNotification('Failed to copy link', 'error');
    });
}

// Recommended events
async function loadRecommendedEvents() {
  const container = document.getElementById('recommendedEvents');
  try {
    const response = await API.getAllEvents({ limit: 3, sort: 'popular' });
    if (response.data && response.data.length > 0) {
      container.innerHTML = response.data.map(event => createEventCardSmall(event)).join('');
    }
  } catch (error) {
    console.error('Error loading recommended events:', error);
  }
}

// Small event card
function createEventCardSmall(event) {
  return `
    <div class="event-card hover-lift" onclick="window.location.href='event-details.html?id=${event._id}'">
      <div class="event-card-image">
        <img src="${event.bannerImage}" alt="${event.title}">
      </div>
      <div class="event-card-content">
        <span class="event-card-category">${event.category}</span>
        <h3 class="event-card-title">${event.title}</h3>
        <div class="event-card-info">
          <span>📅 ${formatDate(event.date)}</span>
          <span>📍 ${event.city}</span>
        </div>
      </div>
    </div>
  `;
}
