# RankUp ⚡

RankUp is a full-stack competitive programming platform designed for programmers to practice problems, submit solutions, compete in real-time, track their progress, connect with the community, and follow Codeforces contests.

## 🚀 Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- User dashboard

### 🧩 Problem Solving
- Competitive programming problems
- Problem search
- Difficulty filtering
- Tag filtering
- Solved problem tracking
- Problem details with examples and constraints
- C++ code submission
- Real-time judging using Judge0
- Accepted / Wrong Answer / other verdicts
- Submission history
- Detailed submission information

### ⚔️ CodeArena
- Real-time 1v1 matchmaking
- Socket.IO powered communication
- Live opponent connection status
- Competitive coding battle room
- Problem solving during the match

### 🏆 Leaderboard
- Global RankUp leaderboard
- ELO rating
- Problems solved
- Codeforces rating
- Codeforces handle

### 🔄 Codeforces Integration
- Link Codeforces account
- Codeforces profile information
- Codeforces rating
- Upcoming Codeforces contests
- Live contest countdown
- Contest status
- Direct contest join links

### 💬 Community
- Create discussions
- Community feed
- Like / unlike posts
- Comments
- Delete own posts
- Delete own comments

### 💡 Wing Editorials
- Progressive hints
- Hint 1
- Hint 2
- Hint 3
- Full solution
- Expandable editorial interface

### 📊 Dashboard
- User statistics
- Problems solved
- Submission progress
- Codeforces profile information
- Quick actions
- Contest Hub access

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Axios
- React Router
- Socket.IO Client
- Monaco Editor
- CSS

### Backend
- Node.js
- Express.js
- Socket.IO
- JWT
- bcryptjs
- cookie-parser

### Database
- MongoDB Atlas
- Mongoose

### APIs / Services
- Judge0
- Codeforces API

---

## 📁 Project Structure

```text
RankUp/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── README.md
└── .gitignore