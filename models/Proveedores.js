const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Proveedores = new Schema({
    "nombre": { type: String, required: true },
    "direccion": { type: String, required: true },
    "telefono": { type: String, required: true },
    "RFC": { type: String, required: true },
    "correo": { type: String, required: true },
    "cp": { type: String, required: true },
    "dias_credito": { type: String, required: true },
    "articulos": [{
        type: Schema.Types.ObjectId,
        ref: "Articulo"
    }]
});

module.exports = Mongoose.model("Proveedores", Proveedores);