const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const registroVendedor = require('./routers/registroVendedor');
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
app.use('/api/registroVendedor', registroVendedor);
//app.use('/auth', auth);

console.log(`${app.get('env')} ${config.get('configBD.HOST')}`);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proyecto de ing de requerimientos, ejecutandose en : ${port}`));