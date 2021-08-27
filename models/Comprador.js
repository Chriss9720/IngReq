const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Carrito = new Schema({
    "Producto": { type: Schema.Types.ObjectId, ref: "Producto" },
});

const Comprador = new Schema({
    "Email": { type: String, required: true },
    "Clave": { type: String, required: true },
    "Carrito": [Carrito],
    "Nombre": { type: String, required: true },
    "Direccion": { type: String, required: true },
    "Edad": { type: Number, required: true },
    "FechaNacimiento": { type: Date, required: true },
    "Telefono": { type: String }
});

module.exports = Mongoose.model("Comprador", Comprador);