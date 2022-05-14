const express = require('express');
const fs = require('fs');
const auth = require('../middlewares/auth');
const index = require('../middlewares/index');
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

ruta.get('/', index, (req, res) => cargar('index', res));

ruta.get('/Registro', (req, res) => cargar('Registro', res));

ruta.post('/inicio', (req, res) => cargar('usuario/InicioUsuario', res));

ruta.post('/Administrar', auth, (req, res) => cargar('vendedor/Vendedor', res));

ruta.post('/Administrar/:seccion', auth, (req, res) => cargar(`vendedor/${req.params.seccion}`, res));

ruta.post('/articulo/:id', auth, (req, res) => cargar('usuario/producto', res));

ruta.post('/carrito', auth, (req, res) => cargar('usuario/carrito', res));

ruta.post('/pagar', auth, (req, res) => cargar('usuario/comprar', res));

module.exports = ruta;