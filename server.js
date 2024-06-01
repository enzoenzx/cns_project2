const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.post('/upload', (req, res) => {
    const jsonData = req.body;
    const targetPath = path.join(uploadsDir, 'data.json');

    fs.writeFile(targetPath, JSON.stringify(jsonData, null, 2), err => {
        if (err) {
            console.error('Failed to save file:', err);
            return res.status(500).send('Failed to save file');
        }
        res.send('File uploaded and saved successfully');
        console.log('File uploaded and saved successfully');
    });
});

app.get('/download/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(uploadsDir, fileName);

    fs.access(filePath, fs.constants.F_OK, err => {
        if (err) {
            return res.status(404).send('File not found');
        }
        res.download(filePath, err => {
            if (err) {
                console.error('Failed to download file:', err);
                res.status(500).send('Failed to download file');
            }
        });
    });
});

app.get('/pw', (req, res) => {
    const zipFilePath = path.join(__dirname, 'src', 'pw.zip');
    fs.access(zipFilePath, fs.constants.F_OK, err => {
        if (err) {
            return res.status(404).send('File not found');
        }
        res.sendFile(zipFilePath, err => {
            if (err) {
                console.error('Failed to send file:', err);
                res.status(500).send('Failed to send file');
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});