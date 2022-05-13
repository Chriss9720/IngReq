const express = require('express');
const ruta = express.Router();
const auth = require('../middlewares/auth');

ruta.post('/subir/img', auth, (req, res) => {
    if (req.files) {
        let file = req.files.file;
        let name = `${req.data._id}.${file['name'].split(".")[1]}`;
        file.mv(`./public/img/${name}`, err => {
            if (err)
                console.log("Error al guardar la img", err);
        });
        res.json({ name: name });
    } else {
        res.json({ Sin_foto: "ok" })
    }
});

module.exports = ruta;