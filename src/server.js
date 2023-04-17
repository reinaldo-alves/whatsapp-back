const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 4000;

// on -> escutando - receptor
// emit -> enviando algum dado

const users = [];

io.on('connection', (socket) => {
    socket.on('disconnect', () => {

    })
    
    socket.on("join", (name) => {
        const user = {id: socket.id, name};
        users.push(user);
        io.emit("message", {name: null, message: `${name} entrou no chat`, id: null})
        io.emit("users", users)
    })

    socket.on("message", (message) => {
        io.emit("message", message)
    })
})


server.listen(port, () => console.log(`Servidor rodando na porta ${port}`));