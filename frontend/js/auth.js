// ========================================
// AUTHENTICATION UTILITIES
// ========================================

const Auth = {
  
  // Get token from localStorage
  getToken() {
    return localStorage.getItem('token');
  },

  // Set token in localStorage
  setToken(token) {
    localStorage.setItem('token', token);
  },

  // Remove token from localStorage
  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get user data from localStorage
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Set user data in localStorage
  setUser(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  },

  // Check if user is logged in
  isLoggedIn() {
    return !!this.getToken();
  },

  // Check if user has specific role
  hasRole(role) {
    const user = this.getUser();
    return user && user.role === role;
  },

  // Check if user is organizer or admin
  isOrganizerOrAdmin() {
    const user = this.getUser();
    return user && (user.role === 'organizer' || user.role === 'admin');
  },

  // Logout user
  logout() {
    this.removeToken();
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  },

  // Redirect if not logged in
  requireAuth() {
    if (!this.isLoggedIn()) {
      showNotification('Please login to access this page', 'error');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
      return false;
    }
    return true;
  },

  // Redirect if not organizer
  requireOrganizer() {
    if (!this.requireAuth()) return false;
    
    if (!this.isOrganizerOrAdmin()) {
      showNotification('Access denied. Organizer role required.', 'error');
      setTimeout(() => {
        window.location.href = 'events.html';
      }, 1500);
      return false;
    }
    return true;
  },

  // Update navbar based on auth status
  updateNavbar() {
    const user = this.getUser();
    const authLinks = document.getElementById('authLinks');
    
    if (!authLinks) return;

    if (this.isLoggedIn() && user) {
      authLinks.innerHTML = `
        <a href="events.html" class="navbar-link">Events</a>
        ${user.role === 'organizer' || user.role === 'admin' ? 
          `<a href="create-event.html" class="navbar-link">Create Event</a>
           <a href="organizer-dashboard.html" class="navbar-link">Dashboard</a>` : 
          `<a href="my-tickets.html" class="navbar-link">My Tickets</a>`
        }
        ${user.role === 'admin' ? 
          `<a href="admin-dashboard.html" class="navbar-link">Admin</a>` : ''
        }
        <span class="navbar-link" style="color: var(--primary-color);">Hi, ${user.name}</span>
        <button onclick="Auth.logout()" class="btn btn-sm btn-primary">Logout</button>
      `;
    } else {
      authLinks.innerHTML = `
        <a href="events.html" class="navbar-link">Events</a>
        <a href="login.html" class="navbar-link">Login</a>
        <a href="register.html" class="btn btn-sm btn-primary">Sign Up</a>
      `;
    }
  }
};

// Initialize navbar on page load
document.addEventListener('DOMContentLoaded', () => {
  Auth.updateNavbar();
});
