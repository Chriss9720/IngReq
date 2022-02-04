const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Comprador = new Schema({
    "Email": { type: String, required: true, unique: true },
    "Clave": { type: String, required: true },
    "Carrito": [{
        type: Schema.Types.ObjectId,
        ref: "Articulo"
    }],
    "Nombre": { type: String, required: true },
    "Direccion": { type: String, required: true },
    "Edad": { type: Number, required: true },
    "Telefono": { type: String, unique: true }
});

module.exports = Mongoose.model("Comprador", Comprador);