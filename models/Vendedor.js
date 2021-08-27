const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Trabajadores = new Schema({
    "Clave": { type: String, required: true },
    "Entrada": [{ type: Date }],
});

const Vendedor = new Schema({
    "Email": { type: String, required: true },
    "Clave": { type: String, required: true },
    "Ventas": { type: Number, default: 0 },
    "Productos": [{ type: Schema.Types.ObjectId, ref: "Producto" }],
    "Vendidos": [{ type: Schema.Types.ObjectId, ref: "Producto" }],
    "Trabajadores": [{ Trabajadores }]
});

module.exports = Mongoose.model("Vendedor", Vendedor);