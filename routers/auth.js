const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Vendedor = require('../models/Vendedor');
const Comprador = require('../models/Comprador');
const config = require('config');
const Joi = require('@hapi/joi');
const ruta = express.Router();

const joiLogin = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "mx"] } }).required(),
    Clave: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9\.\$\#]+$/).required()
});

ruta.post('/Comprador', (req, res) => {
    let comprador = req.body;
    let { error } = joiLogin.validate({
        email: comprador.email,
        Clave: comprador.clave
    });
    if (!error) {
        Comprador.findOne({ Email: comprador.email }).then(
            datos => {
                if (datos) {
                    let psw = bcrypt.compareSync(comprador.clave, datos.Clave);
                    if (psw) {
                        let token = jwt.sign({ _id: datos._id, vendedor: false, comprador: true }, config.get("ConfigTk.SEED"), { expiresIn: config.get("ConfigTk.expired") });
                        res.json(token);
                    } else {
                        res.status(400).json({ msj: "Usuario o clave incorrectos" });
                    }
                } else {
                    res.status(400).json({ msj: "Usuario o clave incorrectos" });
                }
            }
        ).catch(
            x => res.status(400).json({ msj: "Usuario o clave incorrectos" })
        );
    } else {
        res.status(404).json({ error: error.details[0].message });
    }
});

ruta.post('/Vendedor', (req, res) => {
    let vendor = req.body;
    let { error } = joiLogin.validate({
        email: vendor.email,
        Clave: vendor.clave
    });
    if (!error) {
        Vendedor.findOne({ Email: vendor.email }).then(
            datos => {
                if (datos) {
                    let psw = bcrypt.compareSync(vendor.clave, datos.Clave);
                    if (psw) {
                        let token = jwt.sign({ _id: datos._id, vendedor: true, comprador: false }, config.get("ConfigTk.SEED"), { expiresIn: config.get("ConfigTk.expired") });
                        res.json(token);
                    } else {
                        res.status(400).json({ msj: "Usuario o clave incorrectos" });
                    }
                } else {
                    res.status(400).json({ msj: "Usuario o clave incorrectos" });
                }
            }
        ).catch(
            x => res.status(400).json({ msj: "Usuario o clave incorrectos" })
        );
    } else {
        res.status(404).json({ error: error.details[0].message });
    }
});

module.exports = ruta;