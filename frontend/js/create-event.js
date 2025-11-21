// ========================================
// CREATE EVENT PAGE JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is organizer
  if (!Auth.requireOrganizer()) {
    return;
  }

  // Set minimum date to today
  const dateInput = document.querySelector('input[name="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

  // Handle form submission
  document.getElementById('createEventForm').addEventListener('submit', handleSubmit);
});

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = document.getElementById('submitBtn');

  // Get form data
  const formData = {
    title: form.title.value.trim(),
    description: form.description.value.trim(),
    bannerImage: form.bannerImage.value.trim(),
    category: form.category.value,
    capacity: parseInt(form.capacity.value),
    tags: form.tags.value.split(',').map(tag => tag.trim()).filter(tag => tag),
    venue: form.venue.value.trim(),
    city: form.city.value.trim(),
    date: form.date.value,
    time: form.time.value,
    isPublished: form.isPublished.checked
  };

  // Validation rules
  const rules = {
    title: { required: true, minLength: 3 },
    description: { required: true, minLength: 10 },
    bannerImage: { required: true },
    category: { required: true },
    capacity: { 
      required: true,
      custom: (value) => value > 0,
      customMessage: 'Capacity must be greater than 0'
    },
    venue: { required: true },
    city: { required: true },
    date: { required: true },
    time: { required: true }
  };

  const validation = validateForm(formData, rules);

  if (!validation.isValid) {
    displayFormErrors(validation.errors);
    return;
  }

  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<div class="spinner spinner-sm"></div> Creating...';

  try {
    const response = await API.createEvent(formData);
    
    showNotification('Event created successfully!', 'success');
    
    setTimeout(() => {
      window.location.href = 'organizer-dashboard.html';
    }, 1500);

  } catch (error) {
    showNotification(error.message, 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Create Event';
  }
}
