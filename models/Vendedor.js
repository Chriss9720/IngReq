const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Trabajadores = new Schema({
    "Clave": { type: String },
    "Entrada": [{ type: Date }],
    "Telefono": { type: String },
    "Direccion": { type: String }
});

const Vendido = new Schema({
    "Producto": { type: Schema.Types.ObjectId, ref: "Producto" },
    "Comprador": { type: Schema.Types.ObjectId, ref: "Comprador" }
});

const Vendedor = new Schema({
    "NombreCompleto": { type: String, required: true },
    "Email": { type: String, required: true, unique: true },
    "Clave": { type: String, required: true },
    "Telefono": { type: String, required: true, unique: true },
    "Curp": { type: String, required: true, unique: true },
    "Direccion": { type: String, required: true },
    "Productos": [{ type: Schema.Types.ObjectId, ref: "Producto" }],
    "Vendidos": [Vendido],
    "Trabajadores": [Trabajadores],
    "Etiquetas": [{ type: Schema.Types.ObjectId, ref: "Etiqueta" }]
});

module.exports = Mongoose.model("Vendedor", Vendedor);