const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Cupones = new Schema({
    id: { type: String, unique: true },
    porcentaje: { type: Number },
    disponibles: { type: String, default: 0 },
    usados: { type: String, default: 0 },
    categorias: [{
        cat: {
            type: Schema.Types.ObjectId,
            ref: 'Categorias'
        }
    }]
});

module.exports = Mongoose.model("Cupones", Cupones);