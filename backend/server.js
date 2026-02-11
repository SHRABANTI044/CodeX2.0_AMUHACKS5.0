const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());

// Routes
const userRoutes = require('./routes/user');
const scheduleRoutes = require('./routes/schedule');

app.use('/api', userRoutes);
app.use('/api', scheduleRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (using in-memory storage)`);
});
