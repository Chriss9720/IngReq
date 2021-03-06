const jwt = require('jsonwebtoken');
const config = require('config');
const fs = require('fs');

const cargar = (pagina, res) => {
    fs.readFile(`public/html/${pagina}.html`, (err, data) => {
        if (err) {
            res.writeHead(404, { 'content-type': 'text/html' });
            res.write(err);
            res.end();
        } else {
            res.writeHead(200, { 'content-type': 'text/html' });
            res.write(data);
            res.end();
        }
    });
};

const verificarToken = (req, res, next) => {
    let token = req.get('Authorization');
    if (!token) {
        let cook = req.cookies;
        let keys = Object.keys(cook);
        for (let i = 0; i < keys.length && !token; i++) {
            if (keys[i] == "token")
                token = cook[keys[i]];
        }
    }
    jwt.verify(token, config.get("ConfigTk.SEED"), (err, datos) => {
        if (err) {
            console.log("M muerto");
            return cargar('Denegado', res);
        } else {
            req.data = datos;
            next();
        }
    });
};

module.exports = verificarToken;