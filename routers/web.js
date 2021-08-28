const express = require('express');
const fs = require('fs');
//const auth = require('../middlewares/auth');
const ruta = express.Router();

const cargar = (pagina, res) => {
    fs.readFile(`public/html/${pagina}.html`, (err, data) => {
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
}

ruta.get('/', (req, res) => cargar('index', res));

ruta.get('/RegistroVendedor', (req, res) => cargar('RegistroVendedor', res));

ruta.get('/RegistroComprador', (req, res) => cargar('RegistroComprador', res))

module.exports = ruta;