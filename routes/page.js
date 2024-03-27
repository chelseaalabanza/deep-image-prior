const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../controllers/auth'); 

// Setup DB
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// Prevents caching; lets clients get the most up-to-date content
router.use((req, res, next) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    next();
});

// Router for index.hbs
router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;