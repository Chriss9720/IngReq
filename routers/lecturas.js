const express = require('express');
const Usuario = require('../models/Usuarios');
const Proveedor = require('../models/Proveedores');
const auth = require('../middlewares/auth');
const ruta = express.Router();

ruta.post('/proveedores', auth, async(req, res) => {
    let lista = await Usuario.findById(req.data._id)
        .populate({
            path: 'proveedores.idP',
            model: 'Proveedores',
            select: { _id: 0, __v: 0 }
        })
        .select("idP");
    res.json(lista.proveedores || []);
});

module.exports = ruta;