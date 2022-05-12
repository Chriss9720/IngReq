const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const usuarios = new Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    clave: { type: String, required: true },
    telefono: { type: String, required: true },
    curp: { type: String, required: true },
    direccion: { type: String, required: true }
});

module.exports = Mongoose.model("Usuarios", usuarios);