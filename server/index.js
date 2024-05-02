const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const redis = require("redis");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const taskRoutes = require("./routes/Task");
const googleRoutes = require("./routes/googleRoutes");
const database = require("./database/mongodb");
const socketIo = require("socket.io");
require("dotenv").config();

database();
const app = express();
const server = http.createServer(app);

const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
  // if you have Redis password, include it here
  // password: 'your-redis-password'
});
redisClient.connect().catch(console.error);

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(bodyParser.json());

// Configure session management
app.use(
  session({
    store: new RedisStore({
      client: redisClient,
    }),
    secret: "keyboard cat", // Replace 'your-secret-key' with a real secret string
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    },
  })
);

app.use((req, res, next) => {
  console.log("Session ID:", req.session.id);
  console.log("Session data:", req.session);
  next();
});

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("socket io is running");
  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});

redisClient.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});
app.use("/google", googleRoutes);
app.use(taskRoutes);

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
