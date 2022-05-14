const express = require('express');
const ruta = express.Router();
const Joi = require('@hapi/joi');
const auth = require('../middlewares/auth');
const Usuarios = require('../models/Usuarios');

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

const valdiarCodPos = Joi.object({
    codigoP: Joi.string().min(5).max(5).pattern(/^[0-9]+$/).required().error(errores => {
        errores.forEach(e => {
            switch (e.code) {
                case "string.empty":
                    e.message = "Ingrese su codigo postal";
                    break;
                case 'string.pattern.name':
                case "string.pattern.base":
                case "string.pattern.invert.name":
                case "string.pattern.invert.base":
                    e.message = "Solo se permiten numeros";
                    break;
                case "string.min":
                case 'string.max':
                    e.message = "Longitud minima y maxima de 5";
                    break;
            }
        })
        return errores;
    })
});

const validarRfc = Joi.object({
    rfc: Joi.string().min(13).max(13).pattern(/^[ña-zA-Z\d]+$/).required().error(errores => {
        errores.forEach(e => {
            switch (e.code) {
                case 'string.empty':
                    e.message = "Ingrese su rfc";
                    break;
                case 'string.pattern.name':
                case "string.pattern.base":
                case "string.pattern.invert.name":
                case "string.pattern.invert.base":
                    e.message = "Solo se permiten letras mayusculas, minusculas y digitos";
                    break;
                case "string.min":
                case 'string.max':
                    e.message = "Longitud minima y maxima de 13";
                    break;
            }
        });
        return errores;
    })
});

const validarId = Joi.object({
    id: Joi.string().min(3).required().error(errores => {
        errores.forEach(e => {
            switch (e.code) {
                case 'string.empty':
                    e.message = "Ingrese un id";
                    break;
                case "string.min":
                case 'string.max':
                    e.message = "Longitud minima 3";
                    break;
            }
        });
        return errores;
    })
});

const validarPrecio = Joi.object({
    precio: Joi.string().pattern(/^\d+(\.\d+)*$/).required().error(errores => {
        errores.forEach(e => {
            switch (e.code) {
                case 'string.empty':
                    e.message = "Ingrese un valor";
                    break;
                case 'string.pattern.name':
                case "string.pattern.base":
                case "string.pattern.invert.name":
                case "string.pattern.invert.base":
                    e.message = "valores numericos enteros o reales";
                    break;
            }
        });
        return errores;
    })
});

const validarEnteros = Joi.object({
    entero: Joi.string().pattern(/^\d+$/).required().error(errores => {
        errores.forEach(e => {
            switch (e.code) {
                case 'string.empty':
                    e.message = "Ingrese un valor";
                    break;
                case 'string.pattern.name':
                case "string.pattern.base":
                case "string.pattern.invert.name":
                case "string.pattern.invert.base":
                    e.message = "valores numericos enteros";
                    break;
            }
        });
        return errores;
    })
});

const validar = (data, campo, joi, body, id = undefined) => {
    let { error } = joi.validate(body);
    if (error)
        data[campo] = {
            s: true,
            msg: error.message,
            id: id || Object.keys(body)[0]
        }
    else {
        data[campo] = {
            s: false,
            id: id || Object.keys(body)[0]
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

ruta.post('/registroProveedores', auth, (req, res) => {
    let errores = {};
    let { idP, nombreP, dirP, telP, rfcP, corP, codP } = req.body;
    errores = validar(errores, "errId", validarId, { id: idP }, 'idP');
    errores = validar(errores, "errNombre", validarNombre, { nombre: nombreP }, 'nombreP');
    errores = validar(errores, "errEmail", validarEmail, { email: corP }, 'corP');
    errores = validar(errores, "errTelefono", validarTelefono, { telefono: telP }, 'telP');
    errores = validar(errores, 'errRfc', validarRfc, { rfc: rfcP }, 'rfcP');
    errores = validar(errores, "errDir", validarDirrecion, { direccion: dirP }, 'dirP');
    errores = validar(errores, 'errcodP', valdiarCodPos, { codigoP: codP }, 'codP');
    res.json(errores);
});

ruta.post('/login', (req, res) => {
    let errores = {};
    let { clave, email } = req.body;
    errores = validar(errores, "errEmail", validarEmail, { email });
    errores = validar(errores, "errClave", validarClave, { clave });
    res.json(errores);
});

ruta.post('/existeProveedores', auth, (req, res) => {
    Usuarios.findById(req.data._id)
        .then(data => {
            if (data.proveedores && data.proveedores.length > 0) {
                res.json(data.proveedores);
            } else {
                res.status(404).json({ msg: "No hay proveedores registrados" });
            }
        })
        .catch(c => {
            res.status(404).json({ msg: "No hay proveedores registrados" });
        });
});

ruta.post('/existeCategorias', auth, (req, res) => {
    Usuarios.findById(req.data._id)
        .then(data => {
            if (data.categorias && data.categorias.length > 0) {
                res.json(data.categorias);
            } else {
                res.status(404).json({ msg: "No hay categorias registradas" });
            }
        })
        .catch(c => {
            res.status(404).json({ msg: "No hay categorias registradas" });
        });
});

ruta.post('/articulo', auth, (req, res) => {
    let errores = {};
    let {
        id,
        diasC,
        nombre,
        cantidad,
        unidadesC,
        unidadesV,
        costo,
        costoP,
        precioV,
        precioM,
        puntoR,
        prov,
        cat
    } = req.body;

    errores = validar(errores, "errId", validarId, { id });
    errores = validar(errores, "errDiasC", validarEnteros, { entero: diasC }, 'diasC');
    errores = validar(errores, "errNombre", validarNombre, { nombre });
    errores = validar(errores, "errCantidad", validarEnteros, { entero: cantidad }, 'cantidad');
    errores = validar(errores, "errUnidadesC", validarEnteros, { entero: unidadesC }, 'unidadesC');
    errores = validar(errores, "errUnidadesV", validarEnteros, { entero: unidadesV }, 'unidadesV');
    errores = validar(errores, "errCosto", validarPrecio, { precio: costo }, 'costo');
    errores = validar(errores, "errCostoP", validarPrecio, { precio: costoP }, 'costoP');
    errores = validar(errores, "errPrecioV", validarPrecio, { precio: precioV }, 'precioV');
    errores = validar(errores, "errPrecioM", validarPrecio, { precio: precioM }, 'precioM');
    errores = validar(errores, "errPuntoR", validarEnteros, { entero: puntoR }, 'puntoR');
    errores = validar(errores, "errIdProv", validarId, { id: (prov || "") }, 'provSel');

    res.json(errores);
});

ruta.post('/cupon', auth, (req, res) => {
    let { id, desc, cat, cant } = req.body;
    let errores = {};
    errores = validar(errores, "errId", validarId, { id });
    errores = validar(errores, "errDesc", validarPrecio, { precio: desc }, 'desc');
    errores = validar(errores, "errCant", validarEnteros, { entero: cant }, 'cant');
    if (cat && cat.length > 0) {
        errores["errCat"] = {
            s: false,
            id: "catSel"
        }
    } else {
        errores["errCat"] = {
            s: true,
            msg: "Seleccione al menos una categoria",
            id: "catSel"
        }
    }
    res.json(errores);
});

module.exports = ruta;