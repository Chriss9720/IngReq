const express = require('express');
const ruta = express.Router();
const auth = require('../middlewares/auth');
const fs = require('fs');

const methodArt = require('../methods/Articulo');

ruta.post('/subir/img/art', auth, async(req, res) => {
    if (req.files) {
        let id = req.files.name['name'];
        let remover = await methodArt.getImg(id);
        if (!remover !== "none.jpg") {
            fs.unlinkSync(`public/img/${remover}`)
        }
        let file = req.files.file;
        let name = `${id}.${file['name'].split(".")[1]}`;
        file.mv(`./public/img/${name}`, err => {
            if (err)
                console.log("Error al guardar la img", err);
            else {
                methodArt.setImg(id, name);
            }
        });
        res.json({ name: name });
    } else {
        res.json({ Sin_foto: "ok" })
    }
});

module.exports = ruta;