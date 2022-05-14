const express = require('express');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const ruta = express.Router();

const Usuario = require('../models/Usuarios');
const Proveedor = require('../models/Proveedores');
const Carrito = require('../models/Carrito');

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

ruta.delete('/Articulo', auth, async(req, res) => {
    let { id } = req.body;
    let idu = req.data._id;
    let idC = await Usuario.findById({ _id: idu }).select('carrito');
    let carrito = await Carrito.findById({ _id: idC.carrito });
    carrito.articulos = carrito.articulos.filter(f => f._id.toString() !== id.toString());
    await carrito.save();
    res.json({ msg: "Exitoso" });
});

module.exports = ruta;