const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');


const app = express();
dotenv.config();

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false })); //poder recibir los datos, false dao que solo solicito texto no imagenes

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use(logger('dev'));

// CORS para peticiones del front-end

// Configurar cabeceras y CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// ROUTES
const indexRoute = require('./api/routes/index');
app.use('/', indexRoute);


module.exports = app;
