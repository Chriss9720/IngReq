const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Articulo = new Schema({
    "img": { type: String, default: "none.jpg" },
    "id": { type: String, required: true, unique: true },
    "diasC": { type: Number, required: true, default: 0 },
    "nombre": { type: String, required: true },
    "cantidad": { type: Number, default: 0 },
    "unidadesV": { type: Number },
    "costo": { type: String, required: true },
    "costoP": { type: String, default: 0 },
    "precioV": { type: String, default: 0 },
    "precioM": { type: String, default: 0 },
    "puntoR": { type: Number },
    "proveedores": [{
        idP: {
            type: Schema.Types.ObjectId,
            ref: "Proveedores"
        }
    }],
    "categorias": [{
        cat: {
            type: Schema.Types.ObjectId,
            ref: 'Categorias'
        }
    }]
});

module.exports = Mongoose.model("Articulo", Articulo);