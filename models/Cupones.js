const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Cupones = new Schema({
    porcentaje: { type: Number }
});

module.exports = Mongoose.model("Cupones", Cupones);