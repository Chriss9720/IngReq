const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuarios');
const Proveedor = require('../models/Proveedores');
const auth = require('../middlewares/auth');
const ruta = express.Router();

ruta.post('/Usuario', (req, res) => {
    registrarUsuario(req.body)
        .then(
            x => {
                res.json({ msj: "Registro Exitoso" });
            }
        )
        .catch(
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

ruta.post('/Proveedor', auth, (req, res) => {
    registrarProveedor(req.body)
        .then(prov => {
            ligarProveedorUser(req.data._id, prov._id)
                .then(lig => {
                    res.json({ msg: "ligado" });
                })
                .catch(err => {
                    res.status(400).json({ msg: "no ligado" });
                })
        })
        .catch(err => {
            res.status(400).json({ msg: "ya existe un proveedor con esta id" });
        })
});

const registrarProveedor = async(datos) => {
    let Schema = new Proveedor({
        "id": datos.idP,
        "nombre": datos.nombreP,
        "direccion": datos.dirP,
        "telefono": datos.telP,
        "RFC": datos.rfcP,
        "correo": datos.corP,
        "cp": datos.codP
    });
    return await Schema.save();
};

const ligarProveedorUser = async(idU, idP) => {
    let actualizar = await Usuario.findByIdAndUpdate(idU, {
        $addToSet: {
            proveedores: {
                $each: [{
                    idP: idP
                }]
            }
        }
    }, { new: true });
    return actualizar;
};

module.exports = ruta;