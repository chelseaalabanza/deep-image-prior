const mysql = require('mysql');
const path = require('path');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.uploadImage = (req, res) => {
    // Check if file was uploaded
    if (!req.files || !req.files.rawImg) {
        const errorMessage = 'No image uploaded.';
        console.error(errorMessage);
        return res.render('index', { errMsg: errorMessage });
    }

    const rawImg = req.files.rawImg;

    // Validate image MIME type
    const validImageTypes = ['image/jpeg', 'image/png'];
    if (!validImageTypes.includes(rawImg.mimetype)) {
        const errorMessage = 'Invalid file type. Please upload an image in JPEG or PNG format.';
        console.error('Invalid file type:', rawImg.mimetype);
        return res.status(400).json({ error: errorMessage });
    }

    // Insert original filename into database (so its ID can exist first)
    db.query('INSERT INTO uploads (input) VALUES (?)', [rawImg.name], (error, result) => {
        if (error) {
            console.error('Error inserting record into database:', error);
            return res.status(500).json({ error: 'Error uploading file.' });
        }

        const uploadId = result.insertId;

        // Generate new filename with ID
        const fileExtension = rawImg.name.split('.').pop();
        const newFileName = `input_${uploadId}.${fileExtension}`;

        console.log('New filename:', newFileName);

        // Move image to uploads directory
        const uploadPath = path.resolve(__dirname, '../public/inputs', newFileName);
        rawImg.mv(uploadPath, async (error) => {
            if (error) {
                console.error('Error uploading file:', error);
                return res.status(500).json({ error: 'Error uploading file.' });
            }

            console.log('File uploaded successfully to:', uploadPath);

            // Update record in database with new filename
            db.query('UPDATE uploads SET input = ? WHERE id = ?', [newFileName, uploadId], (error, result) => {
                if (error) {
                    console.error('Error updating database record:', error);
                    return res.status(500).json({ error: 'Error updating database record.' });
                }

                console.log('Database record updated with new filename');

                // Fetch the corresponding output column for the updated record
                db.query('SELECT output FROM uploads WHERE id = ?', [uploadId], (error, result) => {
                    if (error) {
                        console.error('Error fetching output filename:', error);
                        return res.render('index', {
                            errMsg: 'Error fetching output filename.'
                        });
                    }

                    const outputFileName = result[0].output;
                    console.log('Retrieved output filename:', outputFileName);

                    // Pass the retrieved output filename to the rendering function
                    return res.render('index', { successMsg: 'Image uploaded successfully.', output: outputFileName });
                });
            });
        });
    });
};
