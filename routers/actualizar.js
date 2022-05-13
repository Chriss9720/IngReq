const express = require('express');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const ruta = express.Router();

const Usuario = require('../models/Usuarios');
const Proveedor = require('../models/Proveedores');
const Articulo = require('../models/Articulo');

const MetodCat = require('../methods/Categorias');

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
    let {
        img,
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
            img,
            id,
            diasC,
            nombre,
            cantidad: (cantidad + unidadesC),
            unidadesV,
            costo,
            costoP,
            precioV,
            precioM,
            puntoR
        }
    }, { new: true });
    await actualizarProvArt(prov, datosA._id);
    await MetodCat.actualizarCat(cat, datosA.categorias, datosA._id, req.data._id);
    res.send("ok");
});

const actualizarProvArt = async(idP, idA) => {
    idP = await Proveedor.findOne({ id: idP });
    let articulo = await Articulo.findById({ _id: idA });
    if (articulo) {
        articulo.proveedores = [];
        await articulo.save();
        await Articulo.findByIdAndUpdate(idA, {
            $addToSet: {
                proveedores: {
                    $each: [{
                        idP: idP._id
                    }]
                }
            }
        });
    }
};

module.exports = ruta;