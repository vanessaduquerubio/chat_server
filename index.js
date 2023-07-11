const http = require('http');
const express = require('express');
const cors = require('cors')

//config de env.
require('dotenv').config();

// 1 creamos aplicacion de express
const app = express();

// config app de exprexx
app.use(cors()) //para poder mandar cosas de local a local


// creacion del servidor
const server = http.createServer(app);

//ponerlo a escuchar
const PORT = process.env.PORT || 3000;
server.listen(PORT);

server.on('listening', () => {
    console.log(`Servidor escuchando en puerto ${PORT}`)
})

//configuracion de socket.io
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});
io.on('connection', (socket) => { //socket es el canal por el que se transmite. si hay 20 clientes, la funcion se ejecuta 20 veces, y tendremos 20 cnales (sockets)
    console.log('se ha conectado un nuevo cliente');
    socket.broadcast.emit('mensaje_chat', {
        usuario: 'INFO', mensaje: 'Se ha conectado un nuevo usuario'
    })

    io.emit('clientes_conectados', io.engine.clientsCount)


    socket.on('mensaje_chat', (data) => {//ver como lo he puesto en el front, lo del mensaje (chat.component.ts)
        //console.log(data)
        io.emit('mensaje_chat', data)
    })

    socket.on('disconect', () => {
        io.emit('mensaje_chat', {
            usuario: 'INFO', mensaje: 'Se ha desconectado un usuario 👋'
        })
        io.emit('clientes_conectados', io.engine.clientsCount)
    })
});