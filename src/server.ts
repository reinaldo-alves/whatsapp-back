import express from "express";
import http from "http";
import { Server } from "socket.io";
import { hash, compare } from "bcrypt";

interface IUser {
    id: string;
    email: string;
    name: string;
    avatar: string;
    password: string;
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
    users: (a: Array<IUser>) => void;
    message: (b: IMessage, c: string) => void;
    groupdata: (d: IRoom) => void;
    rooms: (e: Array<IRoom>) => void;
    roomMessages: (f: Array<IMessage>) => void
    messagelogin: (g: string) => void
}

interface ClientToServerEvents {
    join: (g: string, h: string, i: string, j: string, k: string) => void;
    login: (l: string, m: string) => void;
    message: (n: IMessage, o: IRoom) => void;
    exitgroup: (p: IUser, q: IRoom) => void;
    newgroup: (q: string, r: string, s: string) => void;
    newchat: (t: IUser, u: IUser) => void;
    adduser: (v: IUser, w: IRoom) => void;
    joinroom: (x: string) => void;
    getRoomMessages: (y: IRoom) => void
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
const noUser = {id:'', email: '', name:'', avatar: '', password: '', color:''};

let rooms = [] as Array<IRoom>

function isInArray (array: Array<IUser>, email: string) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].email === email) {
            return true;
        }
    }
    return false;
}

io.on('connection', (socket) => {
    socket.on('exitgroup', (user, group) => {
        const groupMembers = group.users.filter((item) => item.email !== user.email);
        const index = rooms.findIndex((item) => item.roomname === group.roomname);
        rooms[index].users = groupMembers;
        io.in(group.roomname).emit("message", {user: noUser, message: `${user.name} saiu do grupo`, hour: ''}, group.roomname)
        socket.leave(group.roomname)
        io.emit("users", users)
        io.emit("rooms", rooms)
    })
    
    socket.on("join", (name, email, avatar, password, color) => {
        hash(password, 10, (err, hash) => {
            const user = {id: socket.id, name: name, email: email, avatar: avatar, password: hash, color: color};
            users.push(user);
            io.emit("users", users)
            io.emit("rooms", rooms)
        })
    })

    socket.on("login", (email, password) => {
        const [selectedUser] = users.filter((item) => item.email === email);
        let message = ''
        if (!isInArray(users, email)) {
            message = 'Usuário não cadastrado'
        } else {
            compare(password, selectedUser.password, (err, result) => {
                if (err) {
                    message = 'Erro no sistema. Tente novamente mais tarde ou contate o administrador'
                    io.emit("messagelogin", message)
                }
                if (result) {
                    message = 'logged'
                    io.emit("messagelogin", message)
                    io.emit("users", users)
                    io.emit("rooms", rooms) 
                } else {
                    message = 'Senha incorreta'
                    io.emit("messagelogin", message)
                }
        })}
            io.emit("messagelogin", message)
            io.emit("users", users)
            io.emit("rooms", rooms) 
    })

    socket.on("message", (message, room) => {
        socket.in(room.roomname).emit("message", message, room.roomname)
    })

    socket.on("newgroup", (roomname, avatar, email) => {
        const user = users.filter((item) => item.email === email);
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
        rooms.unshift(room);
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