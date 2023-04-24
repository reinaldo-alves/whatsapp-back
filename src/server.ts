import express from "express";
import http from "http";
import { Server } from "socket.io"

interface IUser {
    id: string;
    name: string;
    avatar: string;
    color: string
}

interface IMessage {
    user: IUser;
    message: string;
    hour: string;
}

interface IRoom {
    name: string;
    avatar: string | null;
    users: Array<IUser>;
    messages: Array<IMessage>;
    group: boolean;
    roomname: string
}

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    users: (f: Array<IUser>) => void;
    message: (g: IMessage) => void;
    groupdata: (h: IRoom) => void;
    rooms: (h: Array<IRoom>) => void;
}

interface ClientToServerEvents {
    join: (i: string, j: string, k: string) => void;
    message: (l: IMessage, m: IRoom) => void;
    logout: (m: IUser) => void;
    newgroup: (n: string, o: string, p: string) => void;
    newchat: (q: IUser, r: IUser) => void;
    adduser: (s: IUser, t: IRoom) => void;
    joinroom: (u: string) => void
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

let users = [] as Array<IUser>;
const noUser = {id:'', name:'', avatar: '', color:''};

let rooms = [] as Array<IRoom>

let messages = [] as Array<any>

io.on('connection', (socket) => {
    socket.on('logout', (user) => {
        users = users.filter((item) => item.id !== user.id);
        io.emit("message", {user: noUser, message: `${user.name} saiu do chat`, hour: ''})
        io.emit("users", users)
    })
    
    socket.on("join", (name, avatar, color) => {
        const user = {id: socket.id, name: name, avatar: avatar, color: color};
        users.push(user);
        io.emit("message", {user: noUser, message: `${name} entrou no chat`, hour: ''})
        io.emit("users", users)
        io.emit("rooms", rooms)
    })

    socket.on("message", (message, room) => {
        socket.in(room.roomname).emit("message", message)
    })

    socket.on("newgroup", (roomname, avatar, name) => {
        const user = users.filter((item) => item.name === name);
        const room = {name: roomname, avatar: avatar, users: user, messages: [], group: true, roomname: roomname}
        rooms.push(room);
        socket.join(roomname)
        io.in(roomname).emit("message", {user: noUser, message: `${name} entrou no grupo`, hour: ''})
        io.emit("groupdata", room)
        io.emit("rooms", rooms)
        console.log('Novo grupo criado', room)
    })

    socket.on("newchat", (otherUser, user) => {
        const userschat = [user, otherUser]
        const roomName = user.id.concat(otherUser.id);
        const room = {name: user.name.concat(otherUser.name), avatar: user.avatar.concat(otherUser.avatar), users: userschat, messages: [], group: false, roomname: roomName}
        rooms.push(room);
        socket.join(roomName)
        io.emit("groupdata", room)
        io.emit("rooms", rooms)
        console.log('Novo grupo criado', room)
        console.log('Todos os grupos', rooms)
    })

    socket.on("adduser", (user, room) => {
        const index = rooms.findIndex((item) => item.name === room.name);
        const selectedRoom = rooms[index];
        selectedRoom.users.push(user)
        rooms[index] = selectedRoom
        io.emit("groupdata", selectedRoom)
        io.emit("rooms", rooms)
    })

    socket.on("joinroom", (roomname) => {
        socket.join(roomname);
    })
})


server.listen(port, () => console.log(`Servidor rodando na porta ${port}`));