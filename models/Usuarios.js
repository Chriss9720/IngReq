const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const usuarios = new Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    clave: { type: String, required: true },
    telefono: { type: String, required: true },
    curp: { type: String, required: true },
    direccion: { type: String, required: true },
    proveedores: [{
        idP: {
            type: Schema.Types.ObjectId,
            ref: 'Proveedores'
        }
    }],
    cupones: [{
        idC: {
            type: Schema.Types.ObjectId,
            ref: 'Cupones'
        }
    }],
    categorias: [{
        cat: {
            type: Schema.Types.ObjectId,
            ref: 'Categorias'
        }
    }],
    productos: [{
        idP: {
            type: Schema.Types.ObjectId,
            ref: 'Articulo'
        }
    }]
});

module.exports = Mongoose.model("Usuarios", usuarios);