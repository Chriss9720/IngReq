const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Carrito = new Schema({
    articulos: [{
        idA: {
            type: Schema.Types.ObjectId,
            ref: "Articulo"
        },
        cantidad: {
            type: Number,
            default: 0
        }
    }]
});

module.exports = Mongoose.model("Carrito", Carrito);