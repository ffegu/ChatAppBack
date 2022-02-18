
const socket = io()

const userName = prompt("What is your name??", "Fran Fegu")

let openChat = false
let activeChat = {}
let currentUser;
const chats = {}

socket.on('message', message => {
  if (message === "update-id") {
    currentUser = {
      id: socket.id,
      name: userName,
      status: "Online"
    }
  }
})

socket.emit("new-user", {
  name: userName,
  status: "Online"
})

socket.on("user-connected", user => {
  appendUser(user)
  chats[user.id] = { messages: [] }
})

socket.on("user-disconnected", id => {
  changeStatus(id, 'Offline')
})

socket.on("typing", data => {
  changeStatus(data.user.id, data.typing ? "Typing..." : "Online")
})

socket.on("new-message", data => {
  if (!document.getElementById(data.user.id)) appendUser(data.user)

  if (!chats[data.user.id]) chats[data.user.id] = { messages: [] }

  chats[data.user.id].messages.push({ ...data, position: 'left' })

  document.getElementById(data.user.id).querySelector("#user-status").innerText = data.text
  const unreadCountEl = document.getElementById(data.user.id).querySelector("#unread-count")
  unreadCountEl.innerText = Number(unreadCountEl.innerText) + 1

  if (openChat && activeChat.user.id === data.user.id) appendMessage(data, 'left')

})





