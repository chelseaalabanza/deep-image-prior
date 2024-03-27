const express = require('express');
const mysql = require('mysql');
const authController = require('../controllers/auth');

const router = express.Router();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.post('/uploadImage', authController.uploadImage );

module.exports = router;
