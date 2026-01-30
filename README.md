# RTChat - Real-time Chat Application

**RTChat** is a full-stack web application designed for seamless, real-time communication. By leveraging WebSockets, it allows users to exchange messages instantly with a smooth and responsive user interface.

![GitHub repo size](https://img.shields.io/github/repo-size/ttkien2125/rtchat)
![GitHub language count](https://img.shields.io/github/languages/count/ttkien2125/rtchat)
![GitHub top language](https://img.shields.io/github/languages/top/ttkien2125/rtchat)
![GitHub last commit](https://img.shields.io/github/last-commit/ttkien2125/rtchat)

## Key Features

* **Real-time Messaging:** Send and receive messages instantly without page refreshes using Socket.IO.
* **User Presence:** Real-time notifications when users join or leave a chat session.
* **Responsive Design:** Optimized for a great experience on desktops, tablets, and mobile devices.
* **Modern Stack:** Built with a clean separation of concerns between Frontend (React) and Backend (Node.js).

## Tech Stack

### Frontend
* **React.js:** For building a dynamic and component-based user interface.
* **TailwindCSS:** Custom styling for a modern look and feel.

### Backend
* **Node.js:** JavaScript runtime for the server environment.
* **Express.js:** Lightweight web framework for handling server-side logic.
* **Socket.IO:** Bi-directional, event-based communication for real-time data transfer.

---

## Installation & Setup

Follow these steps to get the project running on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/ttkien2125/rtchat
cd rtchat
```

### 2. Configure the Backend
```bash
cd backend
npm install
npm run dev
```

The server will typically run on http://localhost:3000 (or your configured PORT).

### 3. Configure the Frontend
```bash
cd frontend
npm install
npm run dev
```

The server will typically run on http://localhost:5173 (or your configured PORT).

---

## Project Structure

```text
rtchat/
├── backend/          # Server-side logic (Node.js, Express, Socket.IO)
├── frontend/         # Client-side UI (React.js, TailwindCSS)
├── package.json
└── README.md
```
