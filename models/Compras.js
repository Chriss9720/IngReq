const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Compras = new Schema({
    "fecha": { type: Date, required: true },
    "proveedor": {
        type: Schema.Types.ObjectId,
        ref: "Proveedores"
    },
    "tipo_compra": { type: String },
    "status": { type: Boolean, default: false },
    "subtotal": { type: Number, default: 0 },
    "iva": { type: Number, default: 0 },
    "total": { type: Number, default: 0 }
});

module.exports = Mongoose.model("Compras", Compras);