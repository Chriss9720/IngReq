const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('@hapi/joi');
const Usuarios = require('../models/Usuarios');
const ruta = express.Router();

const joiLogin = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "mx"] } }).required().error(errores => {
        errores.forEach(e => {
            switch (e.code) {
                case "string.empty":
                    e.message = "Ingrese su email";
                    break;
                case "string.domain":
                    e.message = "Dominios permitos son: mx y com";
                    break;
                case "string.email":
                    e.message = "Email incompleto";
                    break;
            }
        });
        return errores;
    }),
    Clave: Joi.string().required().error(errores => {
        errores.forEach(e => {
            e.message = "Ingrese su clave";
        });
        return errores;
    })
});

ruta.post('/login', (req, res) => {
    let comprador = req.body;
    let { error } = joiLogin.validate({
        email: comprador.email,
        Clave: comprador.clave
    });
    if (!error) {
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
    } else {
        res.status(404).json({ msj: error.details[0].message });
    }
});

module.exports = ruta;