const express = require('express');
const helmet = require('helmet');
const server = express();
const userRouter = require('./users/userRouter');

//custom middleware
server.use(helmet());
server.use(logger);

server.use('/users', userRouter);

server.get('/', (req, res) => {
   res.send(`<h2>Let's write some middleware!</h2>`);
});

function logger(req, res, next) {
   const time = new Date().toLocaleTimeString();
   const date = new Date().toLocaleDateString();
   console.log(
      `${req.method} Request | http://localhost:4000${req.url} | ${date} , ${time}`
   );
   next();
}

module.exports = server;
