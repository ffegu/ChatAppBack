const express = require("express")
const cors = require("cors")
const app = express()
const http = require("http")
const server = http.createServer(app)
// const { Server } = require("socket.io")
const moment = require("moment")

app.use(cors())
// const io = new Server(server, {
//     cors: {
//         origin: "*"
//     }
// })
app.use(express.static(__dirname + '/public'))
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

// const users = []

// io.on("connection", (socket) => {

//     socket.send("update-id")

//     socket.on("new-user", user => {
//         users[socket.id] = { id: socket.id, ...user }
//         socket.broadcast.emit('user-connected', users[socket.id])
//     })

//     socket.on('disconnect', () => {
//         socket.broadcast.emit('user-disconnected', socket.id)
//     });

//     socket.on("message", data => {
//         socket.to(data?.user?.id).emit("new-message", { text: data.message, time: moment().format('h:mm A'), user: users[socket.id] })
//     })

//     socket.on("typing", data => {
//         socket.to(data.user.id).emit("typing", {
//             ...data,
//             user: users[socket.id],
//         })
//     })
// })

server.listen(process.env.PORT || 3000, () => {
    console.log("Listening on http://localhost:3000")
})