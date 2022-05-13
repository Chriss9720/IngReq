const express = require('express');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const ruta = express.Router();

//modelos
const Usuario = require('../models/Usuarios');
const Proveedor = require('../models/Proveedores');
const Articulo = require('../models/Articulo');
const Categorias = require('../models/Categorias');

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
            cantidad,
            unidadesC,
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
                            if (cat) validarCategorias(art._id, cat, req.data._id);
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

const validarCategorias = async(idA, cat, idU) => {
    let userData = await Usuario.findById({ _id: idU })
        .populate({
            path: 'categorias.cat',
            model: 'Categorias',
            select: { __v: 0 }
        });
    let catUser = [];
    userData.categorias.forEach(uC => catUser.push({ nombre: uC.cat.nombre, _id: uC.cat._id }));
    cat.forEach(c => {
        let find = catUser.find(f => f.nombre == c.c);
        if (find) {
            siExisteCat(find._id, idA)
        } else {
            noExisteCat(c.c, idU, idA);
        }
    });
};

const noExisteCat = (nombreC, idU, idA) => {
    crearCategoria(nombreC)
        .then(idCat => {
            ligarCategoriasUser(idU, idCat._id)
                .then(lu => {
                    ligarCategoriasProd(idA, idCat._id)
                        .then(lp => {
                            console.log("todo ok");
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
};

const siExisteCat = (idCat, idA) => {
    ligarCategoriasProd(idA, idCat)
        .then(lp => {
            console.log("todo ok");
        })
        .catch(err => {
            console.log(err);
        });
};

const ligarCategoriasUser = async(idU, idC) => {
    let actualizar = await Usuario.findByIdAndUpdate(idU, {
        $addToSet: {
            categorias: {
                $each: [{
                    cat: idC
                }]
            }
        }
    }, { new: true });
    return actualizar;
};

const ligarCategoriasProd = async(idA, idC) => {
    let actualizar = await Categorias.findByIdAndUpdate(idC, {
        $addToSet: {
            articulos: {
                $each: [{
                    idA: idA
                }]
            }
        }
    }, { new: true });
    return actualizar;
};

const crearCategoria = async(nombre) => {
    let Schema = new Categorias({ nombre });
    return await Schema.save();
};

module.exports = ruta;