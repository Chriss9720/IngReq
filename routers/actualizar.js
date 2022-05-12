const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuarios');
const Proveedor = require('../models/Proveedores');
const auth = require('../middlewares/auth');
const ruta = express.Router();

ruta.put('/Proveedor', auth, async(req, res) => {
    let { idO, idP, nombreP, dirP, telP, rfcP, corP, codP } = req.body;
    let datos = await Proveedor.findOneAndUpdate({ id: idO }, {
        $set: {
            id: idP,
            nombre: nombreP,
            direccion: dirP,
            telefono: telP,
            RFC: rfcP,
            correo: corP,
            cp: codP
        }
    }, { new: true });
    res.json(datos || { id: idO });
});

module.exports = ruta;