const jwt = require('jsonwebtoken');
const config = require('config');

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
            return res.status(401).json({ "msj": "Aceeso denegado" });
        } else {
            req.data = datos.usuario;
            next();
        }
    });
}

module.exports = verificarToken;