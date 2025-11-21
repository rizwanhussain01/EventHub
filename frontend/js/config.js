// ========================================
// API CONFIGURATION
// ========================================

const API_CONFIG = {
  // Change this to your deployed backend URL
  BASE_URL: 'https://eventhub-ouwj.onrender.com/api',

  
  // API Endpoints
  ENDPOINTS: {
    // Auth
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    GET_ME: '/auth/me',
    
    // Events
    GET_ALL_EVENTS: '/events',
    GET_EVENT_BY_ID: '/events',
    CREATE_EVENT: '/events',
    UPDATE_EVENT: '/events',
    DELETE_EVENT: '/events',
    GET_ORGANIZER_EVENTS: '/events/organizer/my-events',
    
    // Tickets
    REGISTER_EVENT: '/tickets/events',
    GET_MY_TICKETS: '/tickets/my-tickets',
    CANCEL_TICKET: '/tickets',
    
    // Admin
    GET_ALL_USERS: '/admin/users',
    DELETE_USER: '/admin/users',
    GET_ALL_EVENTS_ADMIN: '/admin/events',
    GET_ADMIN_STATS: '/admin/stats'
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API_CONFIG;
}
