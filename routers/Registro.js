const express = require('express');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const ruta = express.Router();

const MetodUser = require('../methods/Usuario');
const MetodCat = require('../methods/Categorias');
const MethodProv = require('../methods/proveedores');
const MetodArt = require('../methods/Articulo');

ruta.post('/Usuario', (req, res) => {
    MetodUser.registrarUsuario(req.body)
        .then(
            x => res.json({ msj: "Registro Exitoso" })
        )
        .catch(
            err => {
                let name = Object.keys(err.keyValue);
                let msj = `Este valor ya esta registrado\n${name[0]}: ${err.keyValue[name[0]]}`
                res.status(404).json({ error: msj });
            }
        );
});

ruta.post('/Proveedor', auth, (req, res) => {
    MethodProv.registrarProveedor(req.body)
        .then(prov => {
            MethodProv.ligarProveedorUser(req.data._id, prov._id)
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

ruta.post('/articulo', auth, (req, res) => {
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
        cat
    } = req.body;
    MetodArt.registrarArticulo({
            img,
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
        })
        .then(art => {
            MetodArt.ligarProductoProveedor(art._id, prov)
                .then(l => {
                    MetodArt.ligarArticuloUsuario(art._id, req.data._id)
                        .then(lU => {
                            if (cat) MetodCat.validarCategorias(art._id, cat, req.data._id);
                            res.json(art._id);
                        })
                        .catch(err => {
                            let name = Object.keys(err.keyValue);
                            let msj = `ocurrio un error  al ligar el producto con el usuario\n${name[0]}: ${err.keyValue[name[0]]}`;
                            res.status(400).json({ msg: msj });
                        });
                })
                .catch(err => {
                    let name = Object.keys(err.keyValue);
                    let msj = `ocurrio un error al ligar el producto con el proveedor\n${name[0]}: ${err.keyValue[name[0]]}`;
                    res.status(400).json({ msg: msj });
                });
        })
        .catch(err => {
            let name = Object.keys(err.keyValue);
            let msj = `ocurrio un error al crear el producto\n${name[0]}: ${err.keyValue[name[0]]}`;
            res.status(400).json({ msg: msj });
        });
});

module.exports = ruta;