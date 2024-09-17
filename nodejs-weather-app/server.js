// server.js
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const PORT = process.env.PORT || 4000;


// Parser JSON settings
app.use(bodyParser.json());
// Settings CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

wss.on('connection', ws => {
    console.log('Client connected');

    ws.on('message', message => {
        console.log(`Received message => ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// function for sending data by WebSocket
function sendToClients(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// db connections settings
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'weather',
    database: process.env.DB_DATABASE || 'weather'
});

db.connect((err) => {
    if (err) {
        console.error('Не вдалося підключитися до бази даних:', err);
        return;
    }
    console.log('Підключено до бази даних');
});

// Get searches from db
app.get('/api/search-history', (req, res) => {
    db.query('SELECT * FROM search_history', (err, results) => {
        if (err) {
            console.error('Помилка при запиті до бази даних:', err);
            res.status(500).send('Помилка при запиті до бази даних');
            return;
        }
        res.json(results);
    });
});

// Save search in db
app.post('/api/search-history', (req, res) => {
    const { city, temperature, description, wind, lat, lon, timestamp } = req.body;

    if (!city || !temperature || !description || !wind || lat === undefined || lon === undefined || !timestamp) {
        return res.status(400).json({ error: 'Bad Request' });
    }

    const sql = 'INSERT INTO search_history (city, temperature, description, wind, lat, lon, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [
        city,
        temperature,
        description,
        wind,
        lat,
        lon,
        timestamp
    ];

    db.execute(sql, values, (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Server Error' });
        }
        sendToClients({ city, temperature, description, wind, lat, lon, timestamp });
        res.status(201).json({ message: 'Data inserted successfully' });
    });
});

// start server
app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});
