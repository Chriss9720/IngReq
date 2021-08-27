const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Trabajadores = new Schema({
    "Clave": { type: String, required: true },
    "Entrada": [{ type: Date }],
    "Telefono": { type: String, required: true },
    "Direccion": { type: String, required: true }
});

const Vendido = new Schema({
    "Producto": { type: Schema.Types.ObjectId, ref: "Producto" },
    "Comprador": { type: Schema.Types.ObjectId, ref: "Comprador" }
});

const Vendedor = new Schema({
    "Email": { type: String, required: true },
    "Clave": { type: String, required: true },
    "Telefono": { type: String, required: true },
    "Curp": { type: String, required: true },
    "Direccion": { type: String, required: true },
    "Productos": [{ type: Schema.Types.ObjectId, ref: "Producto" }],
    "Vendidos": [Vendido],
    "Trabajadores": [Trabajadores],
    "Etiquetas": [{ type: Schema.Types.ObjectId, ref: "Etiqueta" }]
});

module.exports = Mongoose.model("Vendedor", Vendedor);