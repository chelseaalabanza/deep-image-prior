const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload')
const hbs = require('hbs');
const bodyParser = require('body-parser');
dotenv.config({ path: './.env'})

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set file upload
app.use(fileUpload());

// Set database
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './');
app.use(express.static(publicDirectory));    

// Set path for partials
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Set view engine as Handlebars
app.set('view engine', 'hbs');

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// Set route(s)
app.use('/', require('./routes/page'));
app.use('/auth', require('./routes/auth'));


// Set port
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});