// auth.js
const mysql = require('mysql');
const path = require('path');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

let savedUploadId; 

exports.uploadImage = (req, res) => {
    if (!req.files || !req.files.inputImg) {
        const errorMessage = 'No image uploaded.';
        console.error(errorMessage);
        return res.status(400).json({ error: errorMessage });
    }

    const inputImg = req.files.inputImg;

    const validImageTypes = ['image/jpeg', 'image/png'];
    if (!validImageTypes.includes(inputImg.mimetype)) {
        const errorMessage = 'Invalid file type. Please upload an image in JPEG or PNG format.';
        console.error('Invalid file type:', inputImg.mimetype);
        return res.status(400).json({ error: errorMessage });
    }

    db.query('INSERT INTO uploads (input) VALUES (?)', [inputImg.name], (error, result) => {
        if (error) {
            console.error('Error inserting record into database:', error);
            return res.status(500).json({ error: 'Error uploading file.' });
        }

        savedUploadId = result.insertId; 

        const fileExtension = inputImg.name.split('.').pop();
        const newFileName = `input_${savedUploadId}.${fileExtension}`;

        const uploadPath = path.resolve(__dirname, '../public/inputs', newFileName);
        inputImg.mv(uploadPath, async (error) => {
            if (error) {
                console.error('Error uploading file:', error);
                return res.status(500).json({ error: 'Error uploading file.' });
            }

            console.log('File uploaded successfully to:', uploadPath);

            // Update the filename in the database
            db.query('UPDATE uploads SET input = ? WHERE id = ?', [newFileName, savedUploadId], (error) => {
                if (error) {
                    console.error('Error updating filename in database:', error);
                    return res.status(500).json({ error: 'Error updating filename in database.' });
                }

                console.log('Filename updated in the database.');

                res.status(200).json({ success: 'Image uploaded successfully.', output: newFileName });
            });
        });
    });
};



exports.displayOutput = (req, res) => {
    const uploadId = savedUploadId;

    if (!uploadId) {
        return res.render('index', { message: 'Image not found.' });
    }

    db.query('SELECT input, output FROM uploads WHERE id = ?', [uploadId], (error, result) => {
        if (error) {
            console.error('Error fetching data from database:', error);
            return res.render('index', { message: 'Error fetching data from database.' });
        }

        if (result.length === 0) {
            return res.render('index', { message: 'Upload record not found.' });
        }

        const inputFileName = result[0].input;
        const outputFileName = result[0].output;
        console.log('Retrieved input filename:', inputFileName);
        console.log('Retrieved output filename:', outputFileName);

        return res.render('index', { 
            image: inputFileName,
            output: outputFileName,
            successMessage: 'Your image has been restored.'
        });
    });
};

