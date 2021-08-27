const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Etiqueta = new Schema({
    "Nombre": { type: String, required: true }
});

module.exports = Mongoose.model("Etiqueta", Etiqueta);