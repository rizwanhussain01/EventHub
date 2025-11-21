// ========================================
// EVENTS LISTING PAGE JAVASCRIPT
// ========================================

let currentPage = 1;
let currentFilters = {};
let hasMoreEvents = true;

document.addEventListener('DOMContentLoaded', () => {
  loadEvents();
  setupFilters();
});

// Setup filter event listeners
function setupFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const cityFilter = document.getElementById('cityFilter');
  const sortFilter = document.getElementById('sortFilter');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  // Debounced search
  searchInput.addEventListener('input', debounce(() => {
    currentPage = 1;
    currentFilters.search = searchInput.value;
    loadEvents(true);
  }, 500));

  categoryFilter.addEventListener('change', () => {
    currentPage = 1;
    currentFilters.category = categoryFilter.value;
    loadEvents(true);
  });

  cityFilter.addEventListener('input', debounce(() => {
    currentPage = 1;
    currentFilters.city = cityFilter.value;
    loadEvents(true);
  }, 500));

  sortFilter.addEventListener('change', () => {
    currentPage = 1;
    currentFilters.sort = sortFilter.value;
    loadEvents(true);
  });

  loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    loadEvents(false);
  });
}

// Load events from API
async function loadEvents(reset = true) {
  const container = document.getElementById('eventsGrid');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  try {
    if (reset) {
      showSkeleton(container, 6);
    }

    const queryParams = {
      ...currentFilters,
      page: currentPage,
      limit: 12
    };

    const response = await API.getAllEvents(queryParams);

    if (reset) {
      container.innerHTML = '';
    }

    if (response.data && response.data.length > 0) {
      const eventsHTML = response.data.map(event => createEventCard(event)).join('');
      container.innerHTML += eventsHTML;

      // Show/hide load more button
      hasMoreEvents = currentPage < response.pages;
      loadMoreBtn.style.display = hasMoreEvents ? 'inline-block' : 'none';

    } else if (reset) {
      container.innerHTML = `
        <div class="no-events">
          <h3>No events found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      `;
      loadMoreBtn.style.display = 'none';
    }

  } catch (error) {
    console.error('Error loading events:', error);
    if (reset) {
      container.innerHTML = `
        <div class="no-events">
          <h3>Unable to load events</h3>
          <p>${error.message}</p>
        </div>
      `;
    }
    showNotification('Error loading events', 'error');
  }
}

// Create event card HTML
function createEventCard(event) {
  const eventDate = formatDate(event.date);
  const seatsLeft = event.capacity - event.registeredCount;
  const daysUntil = getDaysUntil(event.date);

  return `
    <div class="event-card slide-up" onclick="window.location.href='event-details.html?id=${event._id}'">
      <div class="event-card-image">
        <img src="${event.bannerImage}" alt="${event.title}" loading="lazy">
      </div>
      <div class="event-card-content">
        <span class="event-card-category">${event.category}</span>
        <h3 class="event-card-title">${event.title}</h3>
        <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0.5rem 0;">
          ${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}
        </p>
        <div class="event-card-info">
          <span>📅 ${eventDate} ${daysUntil >= 0 ? `(${daysUntil} days)` : '(Past)'}</span>
          <span>🕐 ${event.time}</span>
          <span>📍 ${event.venue}, ${event.city}</span>
        </div>
        <div class="event-card-footer">
          <span class="event-card-seats">
            ${seatsLeft > 0 ? `${seatsLeft} seats left` : 'Fully Booked'}
          </span>
          <button class="btn btn-sm btn-primary">View Details →</button>
        </div>
      </div>
    </div>
  `;
}
