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
    group: boolean;
    roomname: string
}

interface IAllMessages {
    [roomName: string]: Array<IMessage>
}

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    users: (f: Array<IUser>) => void;
    message: (g: IMessage, h: string) => void;
    groupdata: (h: IRoom) => void;
    rooms: (h: Array<IRoom>) => void;
    roomMessages: (i: Array<IMessage>) => void
}

interface ClientToServerEvents {
    join: (i: string, j: string, k: string) => void;
    message: (l: IMessage, m: IRoom) => void;
    logout: (m: IUser) => void;
    newgroup: (n: string, o: string, p: string) => void;
    newchat: (q: IUser, r: IUser) => void;
    adduser: (s: IUser, t: IRoom) => void;
    joinroom: (u: string) => void;
    getRoomMessages: (v: IRoom) => void
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

function isInArray (array: Array<IUser>, id: string) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === id) {
        return true;
        }
    }
    return false;
}

io.on('connection', (socket) => {
    socket.on('logout', (user) => {
        users = users.filter((item) => item.id !== user.id);
        const userRooms = rooms.filter((item) => isInArray(item.users, user.id) === true)
        userRooms.map((item) => {
            io.in(item.roomname).emit("message", {user: noUser, message: `${user.name} saiu do chat`, hour: ''}, item.roomname)
            socket.leave(item.roomname)
        })
        rooms.map((item) => {
            item.users = item.users.filter((el) => el.id !== user.id);
        })
        io.emit("users", users)
        io.emit("rooms", rooms)
    })
    
    socket.on("join", (name, avatar, color) => {
        const user = {id: socket.id, name: name, avatar: avatar, color: color};
        users.push(user);
        io.emit("users", users)
        io.emit("rooms", rooms)
    })

    socket.on("message", (message, room) => {
        socket.in(room.roomname).emit("message", message, room.roomname)
    })

    socket.on("newgroup", (roomname, avatar, id) => {
        const user = users.filter((item) => item.id === id);
        const room = {name: roomname, avatar: avatar, users: user, messages: [], group: true, roomname: roomname}
        rooms.push(room);
        socket.join(roomname)
        io.in(roomname).emit("message", {user: noUser, message: `Grupo ${roomname} criado`, hour: ''}, roomname)
        io.emit("groupdata", room)
        io.emit("rooms", rooms)
    })

    socket.on("newchat", (otherUser, user) => {
        const userschat = [user, otherUser]
        const roomName = user.id.concat(otherUser.id);
        const room = {name: user.name.concat(otherUser.name), avatar: user.avatar.concat(otherUser.avatar), users: userschat, messages: [], group: false, roomname: roomName}
        rooms.push(room);
        socket.join(roomName)
        io.in(roomName).emit("message", {user: noUser, message: 'Conversa iniciada', hour: ''}, roomName)
        io.emit("groupdata", room)
        io.emit("rooms", rooms)
    })

    socket.on("adduser", (user, room) => {
        const index = rooms.findIndex((item) => item.roomname === room.roomname);
        const selectedRoom = rooms[index];
        selectedRoom.users.push(user)
        rooms[index] = selectedRoom
        io.in(selectedRoom.roomname).emit("message", {user: noUser, message: `${user.name} entrou no grupo`, hour: ''}, selectedRoom.roomname)
        io.emit("groupdata", selectedRoom)
        io.emit("rooms", rooms)
    })

    socket.on("joinroom", (roomname) => {
        socket.join(roomname);
    })
})


server.listen(port, () => console.log(`Servidor rodando na porta ${port}`));