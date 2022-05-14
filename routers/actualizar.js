const express = require('express');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const ruta = express.Router();

const Proveedor = require('../models/Proveedores');
const Articulo = require('../models/Articulo');

const MetodCat = require('../methods/Categorias');
const MetodArt = require('../methods/Articulo');
const MetodCup = require('../methods/Carrito');

ruta.put('/Proveedor', auth, async(req, res) => {
    let { idO, idP, nombreP, dirP, telP, rfcP, corP, codP } = req.body;
    let datos = await Proveedor.findOneAndUpdate({ id: idO }, {
        $set: {
            id: idP,
            nombre: nombreP,
            direccion: dirP,
            telefono: telP,
            RFC: rfcP,
            correo: corP,
            cp: codP
        }
    }, { new: true });
    res.json(datos || { id: idO });
});

ruta.put('/articulo', auth, async(req, res) => {
    try {
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
            cat,
            idA
        } = req.body;
        let datosA = await Articulo.findOneAndUpdate({ id: idA }, {
            $set: {
                id,
                diasC,
                nombre,
                cantidad: (parseInt(cantidad) + parseInt(unidadesC)),
                unidadesV,
                costo,
                costoP,
                precioV,
                precioM,
                puntoR
            }
        }, { new: true });
        await MetodArt.actualizarProvArt(prov, datosA._id);
        await MetodCat.actualizarCat(cat || [], datosA.categorias, datosA._id, req.data._id);
        res.json({ id: datosA._id });
    } catch (e) {
        res.status(500).json({ msg: "erorr" });
    }
});

ruta.post('/compra', auth, async(req, res) => {
    MetodCup.comprar(req.data._id);
    res.send("ok");
});

module.exports = ruta;