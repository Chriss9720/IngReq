const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuarios');
const Proveedor = require('../models/Proveedores');
const auth = require('../middlewares/auth');
const ruta = express.Router();

ruta.delete('/Proveedor', auth, (req, res) => {
    let { idP } = req.body;
    let idu = req.data._id;
    Proveedor.findOne({ id: idP }, async(err, result) => {
        if (err) {
            res.status(400).json({ msg: "fallo al buscar el proveedor" })
        } else {
            let user = await Usuario.findById({ _id: idu });
            if (!user) {
                res.status(400).json({ msg: "ocurrio un error al eliminar del usuario" })
            } else {
                user.proveedores = user.proveedores.filter(p => p.idP.toString() !== result._id.toString());
                await user.save();
                Proveedor.deleteOne({ id: idP }, (err) => {
                    if (err) {
                        res.status(400).json({ msg: "no se puede eliminar" })
                    } else {
                        res.json({ msg: "Eliminado Exitoso" });
                    }
                });
            }
        }
    });
});

module.exports = ruta;