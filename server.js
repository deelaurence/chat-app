const express = require('express')
const http =require('http')
const app = express();
const path =require('path')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')
const server = http.createServer(app)
const io =socketio(server);
//set static folder
app.use(express.static(path.join(__dirname, 'public')))
const botName = 'chatcord bot'

//run when user connects
io.on('connection', socket=>{

    socket.on('joinRoom',({username,room})=>{
        const user = userJoin(socket.id, username, room)
        socket.join(user.room) 
        socket.emit('message', formatMessage(botName, 'welcome to chatcord'))

         //broadcast when user connects

socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} joined`))

//send user and room info
io.to(user.room).emit('roomUsers', {
    room:user.room,
    users: getRoomUsers(user.room)
})

    })    
   
    //listen for chat message
socket.on('chatMessage',msg=>{
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('message',formatMessage(user.username, msg))
})

//runs when client disconnects
socket.on('disconnect', ()=>{
const user = userLeave(socket.id)
if (user){
io.to(user.room).emit('message', formatMessage(botName, `${user.username} left`))
}
//send user and room info
io.to(user.room).emit('roomUsers', {
    room:user.room,
    users: getRoomUsers(user.room)
})
})


});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, ()=> console.log(`server running on port ${PORT}`))

