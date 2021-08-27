const express = require('express');
const fs = require('fs');
//const auth = require('../middlewares/auth');
const ruta = express.Router();

ruta.get('/', (req, res) => {
    fs.readFile('public/html/index.html', (err, data) => {
        if (err) {
            res.writeHead(404, { 'content-type': 'text/html' });
            res.write(err);
            res.end();
        } else {
            res.writeHead(200, { 'content-type': 'text/html' });
            res.write(data);
            res.end();
        }
    });
})

module.exports = ruta;