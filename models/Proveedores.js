const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Proveedores = new Schema({
    "id": { type: String, required: true, unique: true },
    "nombre": { type: String, required: true },
    "direccion": { type: String, required: true },
    "telefono": { type: String, required: true },
    "RFC": { type: String, required: true },
    "correo": { type: String, required: true },
    "cp": { type: String, required: true }
});

module.exports = Mongoose.model("Proveedores", Proveedores);