const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
//const usuarios = require('./routers/usuarios');
const web = require('./routers/web');
const fileUpload = require('express-fileupload');
//const auth = require('./routers/auth');
const cookieParser = require('cookie-parser');

mongoose.connect(config.get('configBD.HOST'), { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(res => console.log("Conectado"))
    .catch(err => console.log("Error al conectar con la bd"));

const app = express();

app.use(cookieParser());
app.use(fileUpload());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/', web);
//app.use('/api/usuarios', usuarios);
//app.use('/auth', auth);

console.log(`${app.get('env')} ${config.get('configBD.HOST')}`);

app.get('/info', (req, res) => {
    let dato = `${app.get('env')} ${config.get('configBD.HOST')}`;
    res.send(dato);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API REST FULL OK, en: ${port}`));