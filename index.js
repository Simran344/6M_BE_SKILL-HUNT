/*const express = require("express")
require("dotenv").config()
const PORT = process.env.PORT
const app = express()
const cors = require("cors")
const db = require("./server/config/db")
const seed = require("./server/config/seed")
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json({limit:"40mb"}))
app.listen(PORT,()=>{
    console.log("PORT IS LISTENING",PORT)
})
const api = require("./server/route/ApiRoutes")
app.use("/api", api)
const client = require("./server/route/ClientRoutes")
app.use("/client", client)
const dev = require("./server/route/DeveloperRoutes")
app.use("/dev", dev)
const admin = require("./server/route/AdminRoutes")
app.use("/admin", admin)
app.get("/",(req,res)=>{
    res.json({
        status:200,
        success:true,
        message:"Server is running"
    })
})


app.all("/**",(req,res)=>{
  res.status(404).json({
      status:404,
      success:false,
      message:"Not found!!"
    })
})*/
const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const db = require("./server/config/db");
const seed = require("./server/config/seed");
const http = require("http");
const { Server } = require("socket.io");
const ChatModel = require("./server/apis/chat/ChatModel");

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "40mb" }));

// Routes
app.use("/api", require("./server/route/ApiRoutes"));
app.use("/client", require("./server/route/ClientRoutes"));
app.use("/dev", require("./server/route/DeveloperRoutes"));
app.use("/admin", require("./server/route/AdminRoutes"));

app.get("/", (req, res) => {
  res.json({ status: 200, success: true, message: "Server is running" });
});

app.all("/**", (req, res) => {
  res.status(404).json({ status: 404, success: false, message: "Not found!!" });
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join("-");
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    socket.emit("roomJoined", roomId); // optional feedback
  });

  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    const roomId = [senderId, receiverId].sort().join("-");
    try {
      const chatObj = new ChatModel({
        messages: text,
        senderId,
        receiverId
        // autoId removed for performance
      });
      const savedMessage = await chatObj.save();

      io.to(roomId).emit("receiveMessage", {
        _id: savedMessage._id,
        senderId,
        receiverId,
        text: savedMessage.messages,
        createdAt: savedMessage.createdAt
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      socket.emit("errorMessage", "Message send failed");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log("Server listening on PORT", process.env.PORT || 5000);
});