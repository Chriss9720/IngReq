const Cupon = require('../models/Cupones');
const Categorias = require('../models/Categorias');
const Usuario = require('../models/Usuarios');

const registrarCupon = async(id, porcentaje, disponibles) => {
    let cupon = new Cupon({
        id,
        porcentaje,
        disponibles
    });
    return await cupon.save();
};

const ligarCatCupon = async(idC, nombre) => {
    let cat = await Categorias.findOne({ nombre });
    let actualizar = Cupon.findByIdAndUpdate(idC, {
        $addToSet: {
            categorias: {
                $each: [{
                    cat: cat._id
                }]
            }
        }
    }, { new: true });
    return actualizar;
};

const ligarCupUsuario = (idU, idC) => {
    let actualizar = Usuario.findByIdAndUpdate(idU, {
        $addToSet: {
            cupones: {
                $each: [{
                    idC: idC
                }]
            }
        }
    }, { new: true });
    return actualizar;
};

module.exports = {
    registrarCupon,
    ligarCatCupon,
    ligarCupUsuario
}