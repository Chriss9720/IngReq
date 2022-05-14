const express = require('express');
const auth = require('../middlewares/auth');
const ruta = express.Router();

const Usuario = require('../models/Usuarios');
const Articulos = require('../models/Articulo');
const Categorias = require('../models/Categorias');

ruta.post('/proveedores', auth, async(req, res) => {
    let lista = await Usuario.findById(req.data._id)
        .populate({
            path: 'proveedores.idP',
            model: 'Proveedores',
            select: { _id: 0, __v: 0 }
        })
        .select("idP");
    res.json(lista.proveedores || []);
});

ruta.post('/categorias', auth, async(req, res) => {
    let lista = await Usuario.findById(req.data._id)
        .populate({
            path: 'categorias.cat',
            model: 'Categorias',
            select: { _id: 0, __v: 0 }
        })
        .select("cat");
    res.json(lista.categorias || []);
});

ruta.post('/misProductos', auth, async(req, res) => {
    let lista = await Usuario.findById(req.data._id)
        .populate({
            path: 'productos.idP',
            model: 'Articulo',
            select: { _id: 0, __v: 0 },
            populate: [{
                path: 'proveedores.idP',
                model: 'Proveedores',
                select: { _id: 0, __v: 0 }
            }, {
                path: 'categorias.cat',
                model: 'Categorias',
                select: { _id: 0, __v: 0 }
            }]
        }).select("idP");
    res.json(lista.productos || []);
});

ruta.post('/cupones', auth, async(req, res) => {
    let lista = await Usuario.findById(req.data._id)
        .populate({
            path: 'cupones.idC',
            model: 'Cupones',
            select: { _id: 0, __v: 0 },
            populate: {
                path: 'categorias.cat',
                model: 'Categorias',
                select: { _id: 0, __v: 0 },
            }
        }).select("idC");
    res.json(lista.cupones || [])
});

ruta.post('/articulos', auth, async(req, res) => {
    let lista = await Articulos.find().select("nombre precioV id cantidad img");
    res.json(lista || []);
});

ruta.post('/articulo/:id', auth, async(req, res) => {
    let articulo = await Articulos.findById({ _id: req.params.id }).select("cantidad img id precioV nombre");
    res.json(articulo);
});

ruta.post('/carrito', auth, async(req, res) => {
    let carrito = await Usuario.findById(req.data._id)
        .populate({
            path: 'carrito',
            model: 'Carrito',
            populate: {
                path: 'articulos.idA',
                model: 'Articulo',
                select: { _id: 0, __v: 0 }
            }
        })
        .select('carrito');
    res.json(carrito.carrito.articulos || []);
});

ruta.post('/categorias/arts', auth, async(req, res) => {
    let cats = await Categorias.find().select("nombre -_id");
    res.json(cats || []);
});

module.exports = ruta;