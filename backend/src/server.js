import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  const server = http.createServer(app);

  // 🔥 SOCKET.IO
  const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  // ✅ STORE GLOBALLY
  global.io = io;

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();