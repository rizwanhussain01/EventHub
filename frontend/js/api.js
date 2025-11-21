// ========================================
// API CALLS
// ========================================

const API = {
  
  // Generic API call function
  async request(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const token = Auth.getToken();

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Auth APIs
  async register(userData) {
    return this.request(API_CONFIG.ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async login(credentials) {
    return this.request(API_CONFIG.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  async getMe() {
    return this.request(API_CONFIG.ENDPOINTS.GET_ME);
  },

  // Event APIs
  async getAllEvents(queryParams = {}) {
    const queryString = new URLSearchParams(queryParams).toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.GET_ALL_EVENTS}${queryString ? '?' + queryString : ''}`;
    return this.request(endpoint);
  },

  async getEventById(eventId) {
    return this.request(`${API_CONFIG.ENDPOINTS.GET_EVENT_BY_ID}/${eventId}`);
  },

  async createEvent(eventData) {
    return this.request(API_CONFIG.ENDPOINTS.CREATE_EVENT, {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  },

  async updateEvent(eventId, eventData) {
    return this.request(`${API_CONFIG.ENDPOINTS.UPDATE_EVENT}/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData)
    });
  },

  async deleteEvent(eventId) {
    return this.request(`${API_CONFIG.ENDPOINTS.DELETE_EVENT}/${eventId}`, {
      method: 'DELETE'
    });
  },

  async getOrganizerEvents() {
    return this.request(API_CONFIG.ENDPOINTS.GET_ORGANIZER_EVENTS);
  },

  // Ticket APIs
  async registerForEvent(eventId, userData) {
    return this.request(`${API_CONFIG.ENDPOINTS.REGISTER_EVENT}/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async getMyTickets() {
    return this.request(API_CONFIG.ENDPOINTS.GET_MY_TICKETS);
  },

  async cancelTicket(ticketId) {
    return this.request(`${API_CONFIG.ENDPOINTS.CANCEL_TICKET}/${ticketId}`, {
      method: 'DELETE'
    });
  },

  // Admin APIs
  async getAllUsers() {
    return this.request(API_CONFIG.ENDPOINTS.GET_ALL_USERS);
  },

  async deleteUser(userId) {
    return this.request(`${API_CONFIG.ENDPOINTS.DELETE_USER}/${userId}`, {
      method: 'DELETE'
    });
  },

  async getAllEventsAdmin() {
    return this.request(API_CONFIG.ENDPOINTS.GET_ALL_EVENTS_ADMIN);
  },

  async getAdminStats() {
    return this.request(API_CONFIG.ENDPOINTS.GET_ADMIN_STATS);
  }
};
