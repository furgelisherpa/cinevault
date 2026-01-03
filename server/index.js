require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

console.log('Attempting to connect to MongoDB Atlas...');
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000 // 5 second timeout to fail fast
})
.then(() => {
    console.log('✅ SUCCESS: MongoDB Connected to Atlas');
    console.log('Connected to Cluster:', mongoose.connection.host);
    console.log('Database Name:', mongoose.connection.name);
    console.log('--- READY FOR DATA ---');
})
.catch(err => {
    console.error('❌ CRITICAL: MongoDB Atlas Connection Failed!');
    console.error('Error Code:', err.code);
    console.error('Error Name:', err.name);
    console.error('Full Message:', err.message);
    
    if (err.message.includes('IP not whitelisted') || err.name === 'MongooseServerSelectionError') {
        console.error('💡 ACTION REQUIRED: Please log into MongoDB Atlas and check:');
        console.error('1. Network Access -> Add IP Address -> "Allow Access From Anywhere" (0.0.0.0/0)');
        console.error('2. Database Access -> Ensure User has "Read and Write to any database" permissions');
    }
});

app.get('/', (req, res) => {
    res.send('Movie Discovery API is running');
});

app.get('/api/status', (req, res) => {
    const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
    res.json({ 
        server: 'online', 
        database: states[mongoose.connection.readyState],
        dbName: mongoose.connection.name
    });
});

const movieRoutes = require('./routes/movieRoutes');
const userRoutes = require('./routes/userRoutes');
const userController = require('./controllers/userController'); // For direct recommendation access or separate route

// Routes
app.use('/api/movies', movieRoutes);
app.use('/api/user', userRoutes);
app.get('/api/recommendations', userController.getRecommendations);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
