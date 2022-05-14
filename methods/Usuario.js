const Usuario = require('../models/Usuarios');

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

module.exports = {
    registrarUsuario
}