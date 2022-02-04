const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Articulo = new Schema({
    "Img": { type: String, default: "none.jpg" },
    "Nombre": { type: String, required: true },
    "Cantidad": { type: Number, default: 0 },
    "Costo": { type: String, required: true },
    "Costo_prom": { type: String, default: 0 },
    "Descripcion": { type: String, default: "" },
    "Cantidad_pedir": { type: Number, default: 0 },
    "punto_reorden": { type: Number },
    "unidades_compra": { type: Number },
    "unidades_venta": { type: Number },
    "precio_unit_1": { type: Number },
    "precio_unit_2": { type: Number },
    "descuentos": [{
        type: Schema.Types.ObjectId,
        ref: "Cupones"
    }],
    "proveedores": [{
        type: Schema.Types.ObjectId,
        ref: "Proveedores"
    }]
});

module.exports = Mongoose.model("Articulo", Articulo);