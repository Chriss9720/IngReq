const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Trabajadores = new Schema({
    "Clave": { type: String },
    "Entrada": [{ type: Date }],
    "Telefono": { type: String },
    "Direccion": { type: String }
});

module.exports = Mongoose.model("Trabajadores", Trabajadores);