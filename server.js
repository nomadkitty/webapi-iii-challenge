const express = require("express");
const helmet = require("helmet");
const server = express();

// import routers
const userRouter = require("./users/userRouter.js");
const postRouter = require("./posts/postRouter.js");

// setup global middleware
server.use(express.json());
server.use(helmet());
server.use(logger);

// set up routers
server.use("/api/users", userRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

function logger(req, res, next) {
  console.log(`${req.method} to ${req.url} and [${new Date().toISOString()}]`);
  next();
}

module.exports = server;
