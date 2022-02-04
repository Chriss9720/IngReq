const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Detalle_Compra = new Schema({
    "articulo": {
        type: Schema.Types.ObjectId,
        ref: "Producto"
    },
    "cantidad": { type: Number, default: 0 },
    "costo_unit": { type: Number, default: 0 },
    "subtotal": { type: Number, default: 0 }
});

module.exports = Mongoose.model("Detalle_Compra", Detalle_Compra);