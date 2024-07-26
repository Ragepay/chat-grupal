import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import { Server } from 'socket.io';
//  Rutas
import chatRoute from './routes/chat.route.js'


const app = express();
const PORT = 8080 || 3000;

//  Motor de plantillas Express-Handlebars.
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
// Middleware para utilizacion de jsony formualrios.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Carpeta Public.
app.use(express.static(__dirname + '/public'));

//  Rutas
app.use('/chat', chatRoute);

const conversacion = [];
/// Extraer todos los nombres de usuario
const allUsers = conversacion.map(item => item.user);

// Crear un conjunto para eliminar duplicados
const uniqueUsers = new Set(allUsers);

// Convertir el conjunto de nuevo a un array
const usuariosUnicos = Array.from(uniqueUsers);

const httpServer = app.listen(PORT, () => {
    console.log("Server ON")
});
const io = new Server(httpServer);

io.on('connection', (socket) => {
    console.log("Dispositivos conectados: " + io.engine.clientsCount);

    socket.on('mensaje', (data) => {
        conversacion.push(data);
        io.emit('conversacion', conversacion);
        io.emit('userON', usuariosUnicos);
    });
    io.emit('conversacion', conversacion);
    io.emit('userON', usuariosUnicos);
});

