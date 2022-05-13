const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Categorias = new Schema({
    "nombre": { type: String, required: true },
    "articulos": [{
        idA: {
            type: Schema.Types.ObjectId,
            ref: "Articulo"
        }
    }]
});

module.exports = Mongoose.model("Categorias", Categorias);