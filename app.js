const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

mongoose.connect(config.get('configBD.HOST'), { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(res => console.log("Conectado"))
    .catch(err => console.log("Error al conectar con la bd"));

const auth = require('./routers/auth');
const web = require('./routers/web');
const validaciones = require('./routers/validaciones');
const registro = require('./routers/registro');

const app = express();

app.use(cookieParser());
app.use(fileUpload());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/', web);
app.use('/api/registro', registro);
app.use('/auth', auth);
app.use('/validar', validaciones);

console.log(`${app.get('env')} ${config.get('configBD.HOST')}`);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proyecto de ing de requerimientos, ejecutandose en : ${port}`));