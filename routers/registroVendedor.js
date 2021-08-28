const express = require('express');
const bcrypt = require('bcrypt');
const Vendedor = require('../models/Vendedor');
const Joi = require('@hapi/joi');
const ruta = express.Router();

const joi = Joi.object({
    NombreCompleto: Joi.string().pattern(/^[ña-zA-Z\s]+$/).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "mx"] } }).required(),
    Clave: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9\.\$\#]+$/).required(),
    Telefono: Joi.string().min(10).max(10).required(),
    Curp: Joi.string().min(18).max(18).required(),
    Direccion: Joi.string().min(10).required()
});

ruta.post('/', (req, res) => {
    let vendedor = req.body;
    let { error } = joi.validate({
        NombreCompleto: vendedor.Nombre,
        email: vendedor.Email,
        Clave: vendedor.Clave,
        Telefono: vendedor.Telefono,
        Curp: vendedor.Curp,
        Direccion: vendedor.Direccion
    });
    if (!error) {
        registrar(vendedor).then(
            x => res.json({ msj: "Registro Exitoso" })
        ).catch(
            err => {
                let name = Object.keys(err.keyValue);
                let msj = `Este valor ya esta registrado\n${name[0]}: ${err.keyValue[name[0]]}`
                res.status(404).json({ error: msj });
            }
        );
    } else {
        res.status(404).json({ error: error.details[0].message });
    }
});

const registrar = async(vendedor) => {
    let Schema = new Vendedor({
        NombreCompleto: vendedor.Nombre,
        Email: vendedor.Email,
        Clave: bcrypt.hashSync(vendedor.Clave, 10),
        Telefono: vendedor.Telefono,
        Curp: vendedor.Curp,
        Direccion: vendedor.Direccion
    });
    return await Schema.save();
}

module.exports = ruta;