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
const users = [];

const httpServer = app.listen(PORT, () => {
    console.log("Server ON")
});
const io = new Server(httpServer);

io.on('connection', (socket) => {
    console.log("Dispositivos conectados: " + io.engine.clientsCount);
    socket.on('newUser', (data)=>{
        console.log(data);
        users.push(data);
        io.emit('userON', users);
    });
    socket.on('mensaje', (data) => {
        conversacion.push(data);
        io.emit('conversacion', conversacion);
    });
    io.emit('conversacion', conversacion);
    io.emit('userON', users);
});

