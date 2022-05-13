const express = require('express');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const ruta = express.Router();

//modelos
const Usuario = require('../models/Usuarios');
const Proveedor = require('../models/Proveedores');
const Articulo = require('../models/Articulo');
const Categorias = require('../models/Categorias');

const MetodCat = require('../methods/Categorias');

ruta.post('/Usuario', (req, res) => {
    registrarUsuario(req.body)
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
    registrarArticulo({
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
        })
        .then(art => {
            ligarProductoProveedor(art._id, prov)
                .then(l => {
                    ligarArticuloUsuario(art._id, req.data._id)
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

const registrarArticulo = async(data) => {
    let Schema = new Articulo(data);
    return await Schema.save();
};

const ligarArticuloUsuario = async(idA, idU) => {
    let actualizar = Usuario.findByIdAndUpdate(idU, {
        $addToSet: {
            productos: {
                $each: [{
                    idP: idA
                }]
            }
        }
    }, { new: true });
    return actualizar;
};

const ligarProductoProveedor = async(idA, idP) => {
    idP = await Proveedor.findOne({ id: idP }).select("_id");
    let actualizar = Articulo.findByIdAndUpdate(idA, {
        $addToSet: {
            proveedores: {
                $each: [{
                    idP: idP._id
                }]
            }
        }
    }, { new: true });
    return actualizar;
};

module.exports = ruta;