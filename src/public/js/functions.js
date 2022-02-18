

const appendMessage = (message, position) => {

  const messageElement = document.createElement('div')

  const messageId = Math.random()

  messageElement.innerHTML = `<div id=${messageId} class="chat-message-${position} pb-4">
       <div>
         <img
           src=${position === "right" ? 'https://bootdey.com/img/Content/avatar/avatar1.png' : 'https://bootdey.com/img/Content/avatar/avatar3.png'}
           class="rounded-circle mr-1"
           alt=${message?.user?.name}
           width="40"
           height="40"
         />
         <div class="text-muted small text-nowrap mt-2">
           ${message.time}
         </div>
       </div>
       ${message.user.id === currentUser.id ? `<div class="dropdown">
       <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
       </button>
       <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
         <a class="dropdown-item" id="delete" href="#">Delete</a>
       </div>
     </div>` : ``}
       <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
         <div class="font-weight-bold mb-1">
          ${position === "right" ? 'You' : message?.user?.name}
         </div>
          <span id="message-text">${message.text}</span>
       </div>
     </div>`
  document.getElementById("messages-container").appendChild(messageElement)

  if (document.getElementById(messageId).querySelector("#delete")) {
    document.getElementById(messageId).querySelector("#delete").addEventListener("click", (e) => {
      document.getElementById(messageId).querySelector("#message-text").innerText = "This message is deleted"
    })

  }
}

const changeStatus = (id, status) => {
  const user = document.getElementById(id)
  if (!user) return
  user.querySelector("#user-status").innerText = status
  if (openChat && (status === "Online" || status === "Offline")) document.getElementById("chat-container").querySelector("#chat-status").innerText = status
}

const appendUser = (user) => {
  const usersContainer = document.getElementById("users-container")
  const userElement = document.createElement('a')

  userElement.innerHTML = `<a
    id=${user.id}
      href="#${user.name}"
      class="list-group-item list-group-item-action border-0"
    >
      <div id="unread-count" class="badge bg-success float-right">0</div>
      <div class="d-flex align-items-start">
        <img
          src="https://bootdey.com/img/Content/avatar/avatar5.png"
          class="rounded-circle mr-1"
          alt=${user.name}
          width="40"
          height="40"
        />
        <div class="flex-grow-1 ml-3">
          <strong> ${user.name} </strong>
          <div id="user-status" class="small">
              ${user.status}
          </div>
        </div>
      </div>
    </a>`
  usersContainer.appendChild(userElement)

  userElement.addEventListener("click", (e) => {
    openChat = true
    activeChat = { user }

    const chatElement = `<div id="chat-content" class="py-2 px-4 border-bottom d-none d-lg-block">
      <div class="d-flex align-items-center py-1">
        <div class="position-relative">
          <img
            src="https://bootdey.com/img/Content/avatar/avatar5.png"
            class="rounded-circle mr-1"
            alt=${user.name}
            width="40"
            height="40"
          />
        </div>
        <div class="flex-grow-1 pl-3">
          <strong>${user.name}</strong>
          <div class="text-muted small">
            <em id="chat-status">${user.status}</em>
          </div>
        </div>
      </div>
    </div>
  
    <div class="position-relative">
      <div id="messages-container" class="chat-messages p-4"></div>
    </div>
  
    <div class="flex-grow-0 py-3 px-4 border-top">
      <div class="input-group">
        <input
          id="message"
          type="text"
          class="form-control"
          placeholder="Type your message"
        />
        <button id="send" class="btn btn-primary">Send</button>
      </div>
    </div>`

    document.getElementById("chat-container").innerHTML = chatElement

    chats[user.id].messages.forEach(message => {
      appendMessage(message, message.position)
    })

    function sendMessage() {
      const messageInput = document.getElementById("message").value
      if (!messageInput || messageInput.trim() === "") return
      document.getElementById("message").value = ""

      const messageData = { text: messageInput, time: moment().format('h:mm A'), user: currentUser, position: 'right' }
      appendMessage({ text: messageData.text, time: moment().format('h:mm A'), user: currentUser }, messageData.position)
      chats[user.id].messages.push(messageData)
      changeStatus(user.id, messageData.text)
      socket.emit("message", {
        message: messageData.text,
        user
      })
    }

    document.getElementById("message").addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage()
      socket.emit("typing", { user, typing: true })
    })

    document.getElementById("message").addEventListener("focusout", (e) => {
      socket.emit("typing", { user, typing: false })
    })

    document.getElementById("send").addEventListener("click", (e) => sendMessage())

  })

}