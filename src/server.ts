import express from "express";
import http from "http";
import { Server } from "socket.io"

interface IUser {
    id: string;
    name: string;
    avatar: string | null;
    color: string
}

interface IMessage {
    user: IUser
    message: string
    hour: string
}

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    users: (f: Array<IUser>, g: IUser) => void;
    message: (h: IMessage) => void;
}

interface ClientToServerEvents {
    join: (i: string, j: string, k: string) => void;
    message: (l: IMessage) => void;
}

interface SocketData {
    name: string;
    age: number;
}

const app = express();
const server = http.createServer(app);
const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    SocketData
>(server);

const port = process.env.PORT || 4000;

// on -> escutando - receptor
// emit -> enviando algum dado

const users = [] as Array<IUser>;
const noUser = {id:'', name:'', avatar: null, color:''};

io.on('connection', (socket) => {
    socket.on('disconnect', () => {

    })
    
    socket.on("join", (name, avatar, color) => {
        const user = {id: socket.id, name: name, avatar: avatar, color: color};
        users.push(user);
        io.emit("message", {user: noUser, message: `${name} entrou no chat`, hour: ''})
        io.emit("users", users, user)
    })

    socket.on("message", (message) => {
        io.emit("message", message)
    })
})


server.listen(port, () => console.log(`Servidor rodando na porta ${port}`));