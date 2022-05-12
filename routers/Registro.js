const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuarios');
const ruta = express.Router();

ruta.post('/Usuario', (req, res) => {
    registrarUsuario(req.body).then(
        x => res.json({ msj: "Registro Exitoso" })
    ).catch(
        err => {
            let name = Object.keys(err.keyValue);
            let msj = `Este valor ya esta registrado\n${name[0]}: ${err.keyValue[name[0]]}`
            res.status(404).json({ error: msj });
        }
    );
});

const registrarUsuario = async(datos) => {
    let Schema = new Usuario({
        nombre: datos.nombre,
        email: datos.email,
        clave: bcrypt.hashSync(datos.clave, 10),
        telefono: datos.telefono,
        curp: datos.curp,
        direccion: datos.direccion
    });
    return await Schema.save();
};

module.exports = ruta;