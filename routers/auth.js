const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const Usuarios = require('../models/Usuarios');
const ruta = express.Router();

ruta.post('/login', (req, res) => {
    let comprador = req.body;
    Usuarios.findOne({ email: comprador.email })
        .then(datos => {
            if (datos) {
                let psw = bcrypt.compareSync(comprador.clave, datos.clave);
                if (psw) {
                    let token = jwt.sign({ _id: datos._id }, config.get("ConfigTk.SEED"), { expiresIn: config.get("ConfigTk.expired") });
                    res.json(token);
                } else {
                    res.status(403).json({ msg: "Usuario o clave incorrectos", dts: "Clave erronea" });
                }
            } else {
                res.status(402).json({ msg: "Usuario o clave incorrectos" });
            }
        })
        .catch(c => {
            res.status(401).json({ msg: "Usuario o clave incorrectos", dts: c });
        });
});

module.exports = ruta;