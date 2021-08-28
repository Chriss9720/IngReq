const express = require('express');
const bcrypt = require('bcrypt');
const Vendedor = require('../models/Vendedor');
const Comprador = require('../models/Comprador');
const Joi = require('@hapi/joi');
const ruta = express.Router();

const joiVendedor = Joi.object({
    NombreCompleto: Joi.string().pattern(/^[ña-zA-Z\s]+$/).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "mx"] } }).required(),
    Clave: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9\.\$\#]+$/).required(),
    Telefono: Joi.string().min(10).max(10).pattern(/[0-9]+/).required(),
    Curp: Joi.string().min(18).max(18).required(),
    Direccion: Joi.string().min(10).required()
});

ruta.post('/Vendedor', (req, res) => {
    let vendedor = req.body;
    let { error } = joiVendedor.validate({
        NombreCompleto: vendedor.Nombre,
        email: vendedor.Email,
        Clave: vendedor.Clave,
        Telefono: vendedor.Telefono,
        Curp: vendedor.Curp,
        Direccion: vendedor.Direccion
    });
    if (!error) {
        registrarVendedor(vendedor).then(
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

const registrarVendedor = async(vendedor) => {
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

const joiComprador = Joi.object({
    NombreCompleto: Joi.string().pattern(/^[ña-zA-Z\s]+$/).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "mx"] } }).required(),
    Clave: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9\.\$\#]+$/).required(),
    Telefono: Joi.string().min(10).max(10).pattern(/[0-9]+/).required(),
    Direccion: Joi.string().min(10).required(),
    edad: Joi.string().min(2).max(2).pattern(/[0-9]+/).required(),
    fecha: Joi.date().required()
});

ruta.post('/Comprador', (req, res) => {
    let comprador = req.body;
    let { error } = joiComprador.validate({
        NombreCompleto: comprador.Nombre,
        email: comprador.Email,
        Clave: comprador.Clave,
        Telefono: comprador.Telefono,
        Direccion: comprador.Direccion,
        edad: comprador.Edad,
        fecha: comprador.FechaNacimiento
    });
    if (!error) {
        registrarComprador(comprador).then(
            x => res.json({ msj: "Registro Exitoso" })
        ).catch(
            err => {
                let name = Object.keys(err.keyValue);
                let msj = `Este valor ya esta registrado\n${name[0]}: ${err.keyValue[name[0]]}`
                res.status(404).json({ error: msj });
            }
        );
    } else
        res.status(404).json({ error: error.details[0].message });
});

let registrarComprador = async(comprador) => {
    let Schema = new Comprador({
        Email: comprador.Email,
        Clave: bcrypt.hashSync(comprador.Clave, 10),
        Nombre: comprador.Nombre,
        Direccion: comprador.Direccion,
        Edad: comprador.Edad,
        FechaNacimiento: comprador.FechaNacimiento,
        Telefono: comprador.Telefono,
    });
    return await Schema.save();
}

module.exports = ruta;