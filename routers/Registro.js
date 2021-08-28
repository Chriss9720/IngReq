const express = require('express');
const bcrypt = require('bcrypt');
const Vendedor = require('../models/Vendedor');
const Comprador = require('../models/Comprador');
const Joi = require('@hapi/joi');
const moment = require('moment');
const ruta = express.Router();

const joiVendedor = Joi.object({
    NombreCompleto: Joi.string().pattern(/^[ña-zA-Z\s]+$/).required().error(errores => {
        errores.forEach(e => {
            switch (e.code) {
                case 'string.empty':
                    e.message = "Ingrese su nombre";
                    break;
                case 'string.pattern.name':
                case "string.pattern.base":
                case "string.pattern.invert.name":
                case "string.pattern.invert.base":
                    e.message = "Solo se permiten letras mayusculas y minusculas";
                    break;
            }
        });
        return errores;
    }),
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
    Clave: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9\.\$\#]+$/).required().error(errores => {
        errores.forEach(e => {
            switch (e.code) {
                case "string.empty":
                    e.message = "Ingrese su contraseña";
                    break;
                case "string.min":
                    e.message = "Longitud minima de 3";
                    break;
                case 'string.pattern.name':
                case "string.pattern.base":
                case "string.pattern.invert.name":
                case "string.pattern.invert.base":
                    e.message = "Solo se permiten letras, numeros y los caracteres: . $ #";
                    break;
                case 'string.max':
                    e.message = "Longitud maxima de 30 caracteres";
                    break;
            }
        })
        return errores;
    }),
    Telefono: Joi.string().min(10).max(10).pattern(/^[0-9]+$/).required().error(errores => {
        errores.forEach(e => {
            switch (e.code) {
                case "string.empty":
                    e.message = "Ingrese su telefono";
                    break;
                case 'string.pattern.name':
                case "string.pattern.base":
                case "string.pattern.invert.name":
                case "string.pattern.invert.base":
                    e.message = "Solo se permiten numeros";
                    break;
                case "string.min":
                case 'string.max':
                    e.message = "Longitud minima y maxima de 10";
                    break;
            }
        })
        return errores;
    }),
    Curp: Joi.string().min(18).max(18).required().error(errores => {
        errores.forEach(e => {
            switch (e.code) {
                case "string.empty":
                    e.message = "Ingrese su CURP";
                    break;
                case "string.min":
                case 'string.max':
                    e.message = "Longitud minima y maxima de 18";
                    break;
            }
        })
        return errores;
    }),
    Direccion: Joi.string().min(10).required().error(errores => {
        errores.forEach(e => {
            switch (e.code) {
                case "string.empty":
                    e.message = "Ingrese su direccion";
                    break;
                case "string.min":
                    e.message = "Longitud minima de 10";
                    break;
            }
        })
        return errores;
    })
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
};

const joiComprador = Joi.object({
    NombreCompleto: Joi.string().pattern(/^[ña-zA-Z\s]+$/).required().error(errores => {
        errores.forEach(e => {
            switch (e.code) {
                case 'string.empty':
                    e.message = "Ingrese su nombre";
                    break;
                case 'string.pattern.name':
                case "string.pattern.base":
                case "string.pattern.invert.name":
                case "string.pattern.invert.base":
                    e.message = "Solo se permiten letras mayusculas y minusculas";
                    break;
            }
        });
        return errores;
    }),
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
    Clave: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9\.\$\#]+$/).required().error(errores => {
        errores.forEach(e => {
            switch (e.code) {
                case "string.empty":
                    e.message = "Ingrese su contraseña";
                    break;
                case "string.min":
                    e.message = "Longitud minima de 3";
                    break;
                case 'string.pattern.name':
                case "string.pattern.base":
                case "string.pattern.invert.name":
                case "string.pattern.invert.base":
                    e.message = "Solo se permiten letras, numeros y los caracteres: . $ #";
                    break;
                case 'string.max':
                    e.message = "Longitud maxima de 30 caracteres";
                    break;
            }
        })
        return errores;
    }),
    Telefono: Joi.string().min(10).max(10).pattern(/[0-9]+/).required().error(errores => {
        errores.forEach(e => {
            switch (e.code) {
                case "string.empty":
                    e.message = "Ingrese su telefono";
                    break;
                case 'string.pattern.name':
                case "string.pattern.base":
                case "string.pattern.invert.name":
                case "string.pattern.invert.base":
                    e.message = "Solo se permiten numeros";
                    break;
                case "string.min":
                case 'string.max':
                    e.message = "Longitud minima y maxima de 10";
                    break;
            }
        })
        return errores;
    }),
    Direccion: Joi.string().min(10).required().error(errores => {
        errores.forEach(e => {
            switch (e.code) {
                case "string.empty":
                    e.message = "Ingrese su direccion";
                    break;
                case "string.min":
                    e.message = "Longitud minima de 10";
                    break;
            }
        })
        return errores;
    }),
    edad: Joi.string().min(2).max(2).pattern(/[0-9]+/).required().error(errores => {
        errores.forEach(e => {
            switch (e.code) {
                case "string.empty":
                    e.message = "Ingrese su edad";
                    break;
                case "string.min":
                case 'string.max':
                    e.message = "Longitud minima y maxima de 2";
                    break;
            }
        })
        return errores;
    }),
    fecha: Joi.date().required().error(errores => {
        errores.forEach(e => {
            switch (e.code) {
                case "string.empty":
                    e.message = "Ingrese la fecha";
                    break;
                case "date.base":
                    e.message = "Ingrese la fecha";
                    break;
            }
        })
        return errores;
    })
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
        let years = moment().diff(comprador.FechaNacimiento, 'years', false);
        if (years == comprador.Edad) {
            if (years >= 18) {
                registrarComprador(comprador).then(
                    x => res.json({ msj: "Registro Exitoso" })
                ).catch(
                    err => {
                        let name = Object.keys(err.keyValue);
                        let msj = `Este valor ya esta registrado\n${name[0]}: ${err.keyValue[name[0]]}`
                        res.status(404).json({ error: msj });
                    }
                );
            } else {
                res.status(404).json({ error: "Debe de ser mayor de 18 años" });
            }
        } else {
            res.status(404).json({ error: "La edad no concuerda con la fecha de nacimiento" });
        }
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
};

module.exports = ruta;