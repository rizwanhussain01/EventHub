// ========================================
// UTILITY FUNCTIONS
// ========================================

// Show notification
function showNotification(message, type = 'info', duration = 3000) {
  const container = document.getElementById('notificationContainer') || createNotificationContainer();
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  notification.innerHTML = `
    <span class="notification-icon">${icons[type] || icons.info}</span>
    <div class="notification-content">
      <p>${message}</p>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'slideInRight 0.3s ease forwards reverse';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

// Create notification container
function createNotificationContainer() {
  const container = document.createElement('div');
  container.id = 'notificationContainer';
  container.className = 'notification-container';
  document.body.appendChild(container);
  return container;
}

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format time
function formatTime(timeString) {
  return timeString;
}

// Calculate days until event
function getDaysUntil(dateString) {
  const eventDate = new Date(dateString);
  const today = new Date();
  const diffTime = eventDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Countdown timer
function startCountdown(targetDate, elementId) {
  const countdownElement = document.getElementById(elementId);
  if (!countdownElement) return;

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = new Date(targetDate).getTime() - now;

    if (distance < 0) {
      countdownElement.innerHTML = '<p>Event has started!</p>';
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `
      <div class="countdown-item">
        <span class="countdown-value">${days}</span>
        <span class="countdown-label">Days</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-value">${hours}</span>
        <span class="countdown-label">Hours</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-value">${minutes}</span>
        <span class="countdown-label">Minutes</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-value">${seconds}</span>
        <span class="countdown-label">Seconds</span>
      </div>
    `;
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Loading spinner
function showLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '<div class="spinner"></div>';
  }
}

// Hide loading
function hideLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '';
  }
}

// Skeleton loader
function showSkeleton(container, count = 3) {
  const skeletons = Array(count).fill(0).map(() => `
    <div class="card skeleton-card"></div>
  `).join('');
  container.innerHTML = skeletons;
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Validate email
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate form
function validateForm(formData, rules) {
  const errors = {};
  // Helper for safely trimming only string values
  function safeTrim(val) {
    return typeof val === "string" ? val.trim() : val;
  }
  for (const [field, value] of Object.entries(formData)) {
    const fieldRules = rules[field];
    if (!fieldRules) continue;

    // Required check
    if (
      fieldRules.required &&
      (
        (typeof value === "string" && !value.trim()) ||
        (typeof value !== "string" && (value === undefined || value === null || value === ''))
      )
    ) {
      errors[field] = `${field} is required`;
      continue;
    }

    // Min length check
    if (fieldRules.minLength && typeof value === "string" && value.length < fieldRules.minLength) {
      errors[field] = `${field} must be at least ${fieldRules.minLength} characters`;
      continue;
    }

    // Email check
    if (fieldRules.email && !isValidEmail(value)) {
      errors[field] = 'Please enter a valid email';
      continue;
    }

    // Custom validation
    if (fieldRules.custom && !fieldRules.custom(value)) {
      errors[field] = fieldRules.customMessage || `${field} is invalid`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Display form errors
function displayFormErrors(errors) {
  // Clear previous errors
  document.querySelectorAll('.form-error').forEach(el => {
    el.classList.remove('show');
    el.textContent = '';
  });
  document.querySelectorAll('.form-input').forEach(el => {
    el.classList.remove('error');
  });

  // Display new errors
  for (const [field, message] of Object.entries(errors)) {
    const input = document.querySelector(`[name="${field}"]`);
    const errorElement = input?.parentElement.querySelector('.form-error');
    if (input) input.classList.add('error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  }
}

// Smooth scroll to element
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Toggle mobile menu
function toggleMobileMenu() {
  const menu = document.querySelector('.navbar-menu');
  menu.classList.toggle('active');
}

// Generate random ID
function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}
