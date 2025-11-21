// ========================================
// ADMIN DASHBOARD JAVASCRIPT
// ========================================

let allUsers = [];
let allEvents = [];

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is admin
  const user = Auth.getUser();
  if (!user || user.role !== 'admin') {
    showNotification('Access denied. Admin only.', 'error');
    setTimeout(() => window.location.href = 'index.html', 1500);
    return;
  }

  loadAdminDashboard();
});

// Load admin dashboard
async function loadAdminDashboard() {
  await loadSystemStats();
  await loadAllUsers();
  await loadAllEvents();
}

// Load system statistics
async function loadSystemStats() {
  const container = document.getElementById('systemStats');
  
  try {
    const response = await API.getAdminStats();
    const stats = response.data;

    container.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-value">${stats.totalUsers}</div>
        <div class="stat-label">Total Users</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-value">${stats.totalEvents}</div>
        <div class="stat-label">Total Events</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🎫</div>
        <div class="stat-value">${stats.totalTickets}</div>
        <div class="stat-label">Active Tickets</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🎭</div>
        <div class="stat-value">${stats.totalOrganizers}</div>
        <div class="stat-label">Organizers</div>
      </div>
    `;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Load all users
async function loadAllUsers() {
  const container = document.getElementById('usersContainer');
  
  try {
    container.innerHTML = '<div class="spinner"></div>';
    
    const response = await API.getAllUsers();
    allUsers = response.data;

    if (allUsers && allUsers.length > 0) {
      container.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${allUsers.map(user => `
              <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                  <span class="badge ${getRoleBadgeClass(user.role)}">
                    ${user.role}
                  </span>
                </td>
                <td>${formatDate(user.createdAt)}</td>
                <td>
                  ${user.role !== 'admin' ? `
                    <button 
                      onclick="deleteUser('${user._id}')" 
                      class="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  ` : '-'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      container.innerHTML = '<p style="text-align: center; padding: 2rem;">No users found</p>';
    }
  } catch (error) {
    console.error('Error loading users:', error);
    container.innerHTML = `<p style="color: var(--danger-color); padding: 2rem;">Error: ${error.message}</p>`;
  }
}

// Load all events
async function loadAllEvents() {
  const container = document.getElementById('eventsContainer');
  
  try {
    container.innerHTML = '<div class="spinner"></div>';
    
    const response = await API.getAllEventsAdmin();
    allEvents = response.data;

    if (allEvents && allEvents.length > 0) {
      container.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Organizer</th>
              <th>Date</th>
              <th>Registered</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${allEvents.map(event => `
              <tr>
                <td>
                  <strong>${event.title}</strong><br>
                  <span style="font-size: 0.875rem; color: var(--text-secondary);">
                    ${event.category}
                  </span>
                </td>
                <td>${event.organizerId?.name || 'N/A'}</td>
                <td>${formatDate(event.date)}</td>
                <td>${event.registeredCount}/${event.capacity}</td>
                <td>
                  <span class="badge ${event.isPublished ? 'badge-success' : 'badge-warning'}">
                    ${event.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <button 
                    onclick="deleteEvent('${event._id}')" 
                    class="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      container.innerHTML = '<p style="text-align: center; padding: 2rem;">No events found</p>';
    }
  } catch (error) {
    console.error('Error loading events:', error);
    container.innerHTML = `<p style="color: var(--danger-color); padding: 2rem;">Error: ${error.message}</p>`;
  }
}

// Switch tabs
function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  document.getElementById(`${tabName}Tab`).classList.add('active');
}

// Delete user
async function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  try {
    await API.deleteUser(userId);
    showNotification('User deleted successfully', 'success');
    loadAllUsers();
    loadSystemStats();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// Delete event
async function deleteEvent(eventId) {
  if (!confirm('Are you sure you want to delete this event?')) return;

  try {
    await API.deleteEvent(eventId);
    showNotification('Event deleted successfully', 'success');
    loadAllEvents();
    loadSystemStats();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// Get role badge class
function getRoleBadgeClass(role) {
  switch(role) {
    case 'admin': return 'badge-danger';
    case 'organizer': return 'badge-primary';
    default: return 'badge-success';
  }
}
