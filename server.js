const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path'); // Added path module
const app = express();
const port = 3001;

app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ message: 'File uploaded successfully' });
});

app.get('/file-count', (req, res) => {
    fs.readdir('uploads/', (err, files) => {
        if (err) {
            console.error('Error reading upload directory:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const fileCount = files.length;
        res.json({ count: fileCount });
    });
});

app.get('/file-list', (req, res) => {
    fs.readdir('uploads/', (err, files) => {
        if (err) {
            console.error('Error reading upload directory:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const fileList = files.map((file) => {
            const extension = path.extname(file); // Get the extension
            return { name: file, extension: extension };
        });
        res.json({ files: fileList });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
