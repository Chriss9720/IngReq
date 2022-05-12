const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('@hapi/joi');
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
        res.status(404).json({ msj: error.details[0].message });
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
        res.status(404).json({ msj: error.details[0].message });
    }
});

module.exports = ruta;