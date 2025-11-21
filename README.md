# 🎉 EventHub - Modern Event Management Platform

A full-stack event management web application with a modern, animated UI built using **HTML, CSS, JavaScript** (frontend) and **Node.js, Express, MongoDB** (backend).

![EventHub Banner](https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=400&fit=crop)

---

## ✨ Features

### 🆕 New & Improved (November 2025)
- **Particles.js animated background on all major pages** (not just homepage)
- **Structured QR scan results:** Organizer dashboard shows clear, user-friendly ticket info after scanning (Verify Successfully, Ticket ID, Name, etc.)
- **AI chat box (Event Planner):** Large, modern, responsive; typing box at bottom; wide Send button; auto-formatting for headings, lists, bullets, markdown from Gemini API
- **Dropdowns ("select" filters) in dark mode:** Consistent modern look, everywhere in app
- **Consistent animated UI and background effects for Login, Ticket, Dashboard, and Planner**
- **Copy-paste CSS/JS solution for rapid theming and bug fixes**
- **Improved mobile responsiveness in chat, forms, filters**
- **Better error handling for invalid QR codes, API errors**

---

### 🎨 Modern UI/UX
- Particle.js animated background
- Glassmorphism cards with smooth animations
- Hover effects and micro-interactions
- Responsive design for all devices
- Neon glow buttons with ripple effects
- Skeleton loading for smooth UX

### 🔐 Authentication System
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (User, Organizer, Admin)
- Protected routes

### 👥 User Roles

**User (Attendee)**
- Browse and search events
- Filter by category, city, date
- View event details with countdown timer
- Register for events
- View and manage tickets
- Cancel registrations

**Organizer**
- Create, edit, delete events
- Upload event banners
- Track registrations and views
- View attendee lists
- QR ticket scanning and structured verification output
- Dashboard with analytics
- Publish/unpublish events

**Admin**
- Manage all users
- Manage all events
- System statistics dashboard
- Delete inappropriate content

### 📅 Event Management
- Full CRUD operations
- Event categories and tags
- Capacity tracking
- Real-time seat availability
- Event search and filters
- Sorting (newest, popular, trending)
- Pagination

### 🎫 Ticket System
- One-click registration
- Unique ticket IDs
- QR code support (with structured scan results)
- Ticket cancellation
- Email notifications (ready to integrate)

---

## 🛠️ Tech Stack

| Layer      | Technology                                                   |
|------------|-------------------------------------------------------------|
| Frontend   | HTML, CSS (Particles.js, Animations), JavaScript            |
| Backend    | Node.js, Express.js, JWT Auth, RESTful API                  |
| Database   | MongoDB (Mongoose ODM)                                      |
| AI Service | Gemini Pro API (Google Cloud)                               |
| Utilities  | Html5Qrcode (QR scanning), Axios/Fetch, Vercel/Netlify      |

---

## 📁 Project Structure

event-management-system/
├── frontend/
│ ├── index.html
│ ├── ai-planner.html
│ ├── organizer-dashboard.html
│ ├── login.html
│ ├── events.html
│ └── css/
│ ├── global.css
│ ├── components.css
│ └── ai-planner.css
│ └── js/
│ ├── ai-planner.js
│ ├── organizer-dashboard.js
│ ├── my-tickets.js
│ └── ...other js
│ └── particles-config.json
├── backend/
│ ├── server.js
│ ├── config/
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ └── middleware/
├── README.md
└── package.json

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v16+ installed
- MongoDB Atlas account (or local MongoDB)
- Code editor (VS Code recommended)

### Step 1: Clone Repository
git clone <your-repo-url>
cd event-management-system


### Step 2: Backend Setup
cd backend
npm install


Create `.env` in backend:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eventmanagement
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://127.0.0.1:5500
Start backend server:
cd backend
npm run dev

Backend runs at `http://localhost:5000`

### Step 3: Frontend Setup
cd frontend
Update `frontend/js/config.js` with your backend URL:
const API_CONFIG = {
BASE_URL: 'http://localhost:5000/api',
// ...
};
Serve frontend via **Live Server** in VS Code or any static file server.

---

## 🌐 Deployment

### Backend (Render/Railway)
- GitHub connect, set environment variables, deploy

### Frontend (Vercel/Netlify)
- Upload frontend folder or connect GitHub
- Update config.js with backend URL, deploy

### MongoDB Atlas Setup
- Free cluster, database user, whitelist IPs, get connection string, add in `.env`

---

## 🎯 API Endpoints

### Authentication
- POST `/api/auth/register` – Register new user
- POST `/api/auth/login` – Login user
- GET `/api/auth/me` – Get current user

### Events
- GET `/api/events` – Get all events (filters)
- GET `/api/events/:id` – Get by ID
- POST `/api/events` – Create (organizer)
- PUT `/api/events/:id` – Update (organizer)
- DELETE `/api/events/:id` – Delete (organizer)
- GET `/api/events/organizer/my-events` – Organizer's events

### Tickets
- POST `/api/tickets/events/:id/register` – Register for event
- GET `/api/tickets/my-tickets` – User's tickets
- DELETE `/api/tickets/:id` – Cancel ticket

### QR Verification
- GET `/api/verify-ticket` – Organizer QR scan endpoint (structured output)

### Admin
- GET `/api/admin/users` – Get all users
- DELETE `/api/admin/users/:id` – Delete user
- GET `/api/admin/events` – All events
- GET `/api/admin/stats` – System stats

### AI Planner
- POST `/api/ai-chat` – Event planning assistant (Gemini)

---

## 🎨 UI Features

- ✅ Particles.js animated background (now global)
- ✅ Glassmorphism design/cards
- ✅ Smooth page transitions
- ✅ Modern responsive chat (AI event planner box)
- ✅ Enhanced QR scan result UI (structured output)
- ✅ Custom dark dropdowns and select filters
- ✅ Countdown timers, skeleton loaders, toasts
- ✅ Mobile-friendly, premium dark theme

---

## 📸 Screenshots

_(Add your screenshots here: Homepage, AI Planner, Organizer Dashboard with scan results, Tickets, etc)_

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit/push changes
4. Open Pull Request

---

## 📝 License

MIT licensed

---

## 👨‍💻 Developer

Created with ❤️ by **Rizwan Hussain**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/rizwanhussain01)

---

## 🙏 Acknowledgments

- Particle.js by Vincent Garreau
- Unsplash for event images
- Gemini API (Google AI)
- MongoDB Atlas
- Express.js community

---

**⭐ If you like this project, give it a star on GitHub!**
