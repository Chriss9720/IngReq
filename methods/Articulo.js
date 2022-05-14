const Usuario = require('../models/Usuarios');
const Proveedor = require('../models/Proveedores');
const Articulo = require('../models/Articulo');

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

const setImg = async(id, img) => {
    await Articulo.findByIdAndUpdate(id, {
        $set: { img: img }
    });
};

const getImg = async(id) => {
    let img = await Articulo.findById(id);
    return img.img.toString();
};

module.exports = {
    registrarArticulo,
    ligarArticuloUsuario,
    ligarProductoProveedor,
    actualizarProvArt,
    setImg,
    getImg
};