 const express = require('express');
 const multer = require('multer');
 const axios = require('axios');
 const fs = require('fs');
 const FormData = require('form-data');
 const app = express();
 const PORT = 3000;
 app.set('json spaces', 2);
 const upload = multer({
     dest: 'uploads/'
 });
 app.get('/', (req, res) => {
     res.sendFile(__dirname + '/index.html');
 });
 app.post('/upload', upload.array('videos', 3), async (req, res) => {
     try {
         const clientId = 'b0ec0d45ae912d2';
         const apiUrl = 'https://api.imgur.com/3/upload';
         const imgurResponses = await Promise.all(req.files.map(async (file) => {
             const videoData = fs.readFileSync(file.path);
             const form = new FormData();
             form.append('video', videoData, {
                 filename: 'video.mp4',
                 contentType: 'video/mp4'
             });
             const imgurResponse = await axios.post(apiUrl, form, {
                 headers: {
                     ...form.getHeaders(),
                     'Authorization': `Client-ID ${clientId}`,
                 },
             });
             return imgurResponse.data;
         }));
         res.json(imgurResponses);
     } catch (error) {
         console.error(error);
         res.status(500).send('Internal Server Error');
     }
 });
 app.listen(PORT, () => {
     console.log(`Server is running on http://localhost:${PORT}`);
 });
