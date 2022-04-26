const chatForm = document.getElementById('chat-form')
let chatInput = document.getElementById('msg')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
//get username and room from url
const{username, room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})
const socket = io()

console.log(username, room);

//join chatroom
socket.emit('joinRoom', {username, room})

//get room and users
socket.on('roomUsers',({room, users})=>{
    outputRoomName(room)
    outputUsers(users)
})
//message from server
socket.on('message', message =>{
    console.log(message);
    outputMessage(message)

    //scroll down
    chatMessages.scrollTop= chatMessages.scrollHeight
})

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const msg = chatInput.value
    
    
    //emit mesage to server
    socket.emit('chatMessage', msg)
    chatInput.value=''

    
})

//output message to dom

function outputMessage(message){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
            <p class="text">${message.text}
            </p>`
    document.querySelector('.chat-messages').append(div)
        }


//add room name to dom
function outputRoomName(room){
roomName.innerText=room
}

//add users to dom
function outputUsers(users){
userList.innerHTML=`${users.map(user=>`<li>${user.username}</li>`).join('')}`
}