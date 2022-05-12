const express = require('express');
const ruta = express.Router();
const Joi = require('@hapi/joi');

const validarNombre = Joi.object({
    nombre: Joi.string().pattern(/^[ña-zA-Z\s]+$/).required().error(errores => {
        errores.forEach(e => {
            switch (e.code) {
                case 'string.empty':
                    e.message = "Ingrese su nombre";
                    break;
                case 'string.pattern.name':
                case "string.pattern.base":
                case "string.pattern.invert.name":
                case "string.pattern.invert.base":
                    e.message = "Solo se permiten letras mayusculas y minusculas y espacios";
                    break;
            }
        });
        return errores;
    })
});

const validarEmail = Joi.object({
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
    })
});

const validarClave = Joi.object({
    clave: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9\.\$\#]+$/).required().error(errores => {
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
                default:
                    e.message = e.message + "desc";
            }
        })
        return errores;
    })
});

const validarTelefono = Joi.object({
    telefono: Joi.string().min(10).max(10).pattern(/^[0-9]+$/).required().error(errores => {
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
    })
});

const validarCurp = Joi.object({
    curp: Joi.string().min(18).max(18).required().error(errores => {
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
    })
});

const validarDirrecion = Joi.object({
    direccion: Joi.string().min(10).required().error(errores => {
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

const validar = (data, campo, joi, body) => {
    let { error } = joi.validate(body);
    if (error) data[campo] = {
        s: true,
        msg: error.message,
        id: Object.keys(body)[0]
    }
    else {
        data[campo] = {
            s: false,
            id: Object.keys(body)[0]
        }
    }
    return data;
};

ruta.post('/registro', (req, res) => {
    let errores = {};
    let { nombre, email, clave, telefono, curp, direccion } = req.body;
    errores = validar(errores, "errNombre", validarNombre, { nombre });
    errores = validar(errores, "errEmail", validarEmail, { email });
    errores = validar(errores, "errClave", validarClave, { clave });
    errores = validar(errores, "errTelefono", validarTelefono, { telefono });
    errores = validar(errores, "errCurp", validarCurp, { curp });
    errores = validar(errores, "errDir", validarDirrecion, { direccion });
    res.json(errores);
});

ruta.post('/login', (req, res) => {
    let errores = {};
    let { clave, email } = req.body;
    errores = validar(errores, "errEmail", validarEmail, { email });
    errores = validar(errores, "errClave", validarClave, { clave });
    res.json(errores);
});

module.exports = ruta;