// ========================================
// HOMEPAGE JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  loadFeaturedEvents();
});

// Initialize Particles.js
function initParticles() {
  particlesJS('particles-js', {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: '#6366f1'
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0,
          color: '#000000'
        }
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: '#6366f1',
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'grab'
        },
        onclick: {
          enable: true,
          mode: 'push'
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1
          }
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
  });
}

// Load featured events
async function loadFeaturedEvents() {
  const container = document.getElementById('featuredEvents');
  
  try {
    showSkeleton(container, 3);
    
    const response = await API.getAllEvents({ limit: 3, sort: 'popular' });
    
    if (response.data && response.data.length > 0) {
      container.innerHTML = response.data.map(event => createEventCard(event)).join('');
    } else {
      container.innerHTML = '<p class="no-events">No featured events available</p>';
    }
  } catch (error) {
    console.error('Error loading featured events:', error);
    container.innerHTML = '<p class="no-events">Unable to load events</p>';
  }
}

// Create event card HTML
function createEventCard(event) {
  const eventDate = formatDate(event.date);
  const seatsLeft = event.capacity - event.registeredCount;
  
  return `
    <div class="event-card hover-lift" onclick="window.location.href='event-details.html?id=${event._id}'">
      <div class="event-card-image">
        <img src="${event.bannerImage}" alt="${event.title}">
      </div>
      <div class="event-card-content">
        <span class="event-card-category">${event.category}</span>
        <h3 class="event-card-title">${event.title}</h3>
        <div class="event-card-info">
          <span>📅 ${eventDate}</span>
          <span>📍 ${event.city}</span>
          <span>👥 ${event.registeredCount}/${event.capacity} registered</span>
        </div>
        <div class="event-card-footer">
          <span class="event-card-seats">${seatsLeft} seats left</span>
          <button class="btn btn-sm btn-primary">View Details</button>
        </div>
      </div>
    </div>
  `;
}
