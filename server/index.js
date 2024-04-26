const express = require("express");
const http = require("http"); // Import the HTTP module
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const taskRoutes = require("./routes/Task");
const database = require("./database/mongodb");
const socketIo = require("socket.io");

require("dotenv").config();
database();
const app = express();
const server = http.createServer(app); // Create an HTTP server instance

app.use(cors());
app.use(bodyParser.json());
app.use(taskRoutes);

const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust according to your CORS policy
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  // Use server.listen instead of app.listen
  console.log(`Server running on port ${port}`);
});
