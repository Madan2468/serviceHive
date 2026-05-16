# ServiceHive - Premium Leads Intelligence Dashboard

ServiceHive is a high-end, full-stack Lead Management & Intelligence Dashboard designed for high-conversion sales teams. Built with a stunning 3D glassmorphic aesthetic, it provides a seamless experience for tracking, managing, and analyzing leads in real-time.

![ServiceHive Dashboard](https://raw.githubusercontent.com/Madan2468/serviceHive/main/frontend/public/dashboard-bg.png)

## ✨ Features

- **📊 Performance Analytics**: Integrated real-time data visualization with Recharts, featuring lead activity trends, status distribution, and source analysis.
- **🚀 3D Glassmorphic UI**: A premium, "floating window" design with abstract 3D backgrounds and deep backdrop blurs.
- **📊 Leads Intelligence**: Real-time stats hero banner featuring Total Leads, Conversion Rates, and Active Pipeline tracking.
- **🔐 Secure Authentication**: JWT-based system with protected routes and persistent sessions.
- **🎭 Role-Based Access (RBAC)**: Distinct permissions for Admins (Full Control) and Sales Users (Personal Lead Management).
- **🔎 Advanced Pipeline Controls**: 
  - Dynamic filtering by Status (New, Contacted, Qualified, etc.) and Source.
  - Debounced real-time search by Name or Email.
  - Multi-column sorting.
- **📥 CSV Intelligence**: Export filtered and searched leads directly to CSV for external reporting.
- **🌓 Adaptive Theme**: Fully integrated Dark and Light modes with smooth transitions and theme-aware 3D backgrounds.
- **📱 Fluid Animations**: Powered by Framer Motion for staggered list entrances and interactive micro-animations.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Modern Utility-First)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Validation**: Zod + React Hook Form

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Security**: JWT (Authentication), bcryptjs (Hashing)

### Infrastructure
- **Containerization**: Docker & Docker Compose

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Docker (Optional, for containerized deployment)

### Setup Instructions

1. **Clone the Repo**
   ```bash
   git clone https://github.com/Madan2468/serviceHive.git
   cd serviceHive
   ```

2. **Environment Configuration**
   In the `backend` directory, create a `.env` file (see `.env.example`):
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```

3. **Run with Docker (Recommended)**
   ```bash
   docker-compose up --build -d
   ```
   *Frontend: http://localhost:80 | Backend: http://localhost:5001*

4. **Run Locally (Development)**
   - **Backend**: `cd backend && npm install && npm run dev`
   - **Frontend**: `cd frontend && npm install && npm run dev`

## 📑 API Overview

- `POST /api/auth/register` - User Registration
- `POST /api/auth/login` - Secure Login
- `GET /api/leads` - Paginated & Filtered Leads
- `POST /api/leads` - Lead Creation
- `GET /api/leads/export/csv` - CSV Data Export

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ by Madan*
