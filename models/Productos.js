const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Comentarios = new Schema({
    "Comentario": { type: String, required: true },
    "Like": { type: Number, default: 0 },
    "Comprador": { type: Schema.Types.ObjectID, ref: "Comprador" }
});

const Producto = new Schema({
    "Img": { type: String, default: "none.jpg" },
    "Nombre": { type: String, required: true },
    "Cantidad": { type: Number, default: 0 },
    "Precio_Venta": { type: Number, require: true },
    "Precio_Compra": { type: Number, default: 0 },
    "Descripcion": { type: String, default: "" },
    "Comentarios": [Comentarios],
    "Vendedor": { type: Schema.Types.ObjectID, ref: "Vendedor" }
});

module.exports = Mongoose.model("Producto", Producto);