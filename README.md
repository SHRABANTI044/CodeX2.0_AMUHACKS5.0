# Personalized Academic Recovery Engine

A full-stack web application to help students recover from academic backlog using rule-based scheduling.

## Features

- **Rule-based scheduling**: Prioritizes subjects based on urgency scores
- **Risk assessment**: Detects academic risk levels (High/Medium/Low)
- **Dynamic schedule updates**: Automatically recalculates schedule when progress is updated
- **Stress-aware planning**: Adjusts study sessions based on stress levels
- **Progress visualization**: Charts and dashboards for tracking progress

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Chart.js for data visualization
- React Router for navigation

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose

### Database

- MongoDB (via Docker)

## Project Structure

```
personalized-academic-recovery-engine/
├── frontend/          # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.js
│   │   │   ├── InputForm.js
│   │   │   └── Dashboard.js
│   │   ├── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/           # Node.js/Express server
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── user.js
│   │   └── schedule.js
│   ├── utils/
│   │   └── scheduling.js
│   ├── server.js
│   └── package.json
└── database/          # MongoDB setup
    └── docker-compose.yml
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- npm or yarn

### 1. Clone the repository

```bash
git clone <repository-url>
cd personalized-academic-recovery-engine
```

### 2. Start MongoDB

```bash
cd database
docker-compose up -d
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Install frontend dependencies

```bash
cd frontend
npm install
```

### 5. Start the backend server

```bash
cd backend
npm start
```

### 6. Start the frontend development server

```bash
cd frontend
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### POST /api/user

Create a new user with subjects and study preferences.

### GET /api/schedule/:userId

Get the generated study schedule for a user.

### PUT /api/update-progress/:userId

Update completion percentage for a subject and recalculate schedule.

## Scheduling Logic

### Urgency Score Formula

```
Urgency Score = (Difficulty × (100 - Completion%)) ÷ Days Left
```

### Risk Classification

- **High Risk**: Days Left < 3 AND Completion < 50%
- **Medium Risk**: Days Left < 7 AND Completion < 70%
- **Low Risk**: Otherwise

### Stress Level Adjustments

- **High Stress**: Study time split into 25-minute sessions with 5-minute breaks
- **Low/Medium Stress**: Continuous study blocks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
