const Usuario = require('../models/Usuarios');
const Proveedor = require('../models/Proveedores');

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

module.exports = {
    registrarProveedor,
    ligarProveedorUser
};