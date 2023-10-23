const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./Routes/UserRoutes");
const ChatRoutes = require("./Routes/ChatRoutes");
const MessageRoutes = require("./Routes/MessageRoutes");
const { notFound, errorHandler } = require("./middleware/middlleware");
const path = require('path');

dotenv.config();
connectDB();

const app = express();
app.use(express.json())

// app.get('/', (req, res) => {
//     res.send("API is running")
// })

// app.get("/api/chat", (req, res) => {
//     res.send(chats)
// })

// app.get("/api/chat/:id", (req, res) => {
//     console.log(req.params.id)
//     const singlechat = chats.find(c => c._id === req.params.id)
//     {
//         res.send(singlechat)
//     }
// })

app.use("/api/user", userRoutes)
app.use("/api/message", MessageRoutes)
app.use("/api/chat", ChatRoutes)

// Deployment

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/Frontend/build")))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, "Frontend", "build", "index.html"));
    })
}
else {
    app.get("/", (req, res) => {
        res.send("api running succesfully");
    })
}

// Deployment

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT;
const server = app.listen(PORT, console.log("Server Started"));

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
});

io.on("connection", (socket) => {
    console.log("Connected to Socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id)
        console.log(userData._id)
        socket.emit('connected')
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log("User Joined Room" + room)
    });

    socket.on('typing', (room) => socket.in(room).emit("typing"))
    socket.on('stoptyping', (room) => socket.in(room).emit("stoptyping"))

    socket.on('new message', (newmessageRecieved) => {
        var chat = newmessageRecieved.chat;

        if (!chat.users) return console.log("Chat.users not defined")

        chat.users.forEach(user => {
            if (user._id == newmessageRecieved.sender._id) return;

            socket.in(user._id).emit("Message recieved", newmessageRecieved)
        })
    });
})