const express = require('express');
const app = express();
const routes = require('./routes/route.js');

const usuariosRouter = require('./routes/usuarios');
const transferenciasRouter = require('./routes/transferencias');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Montar las rutas de usuarios y transferencias
app.use('/usuarios', usuariosRouter);
app.use('/transferencias', transferenciasRouter);
app.use('/', routes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});