const config = require('./utils/env')
const express = require('express')
const app = express();
const server = require('http').Server(app);
const socketServer = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./route/route');
const jwt = require('jsonwebtoken');
const utils = require('./utils/commons')
const codeStatus = require('./utils/status')
require('./db/db');

/**
 * Port connection
 */
const PORT = process.env.PORT || 5000

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(cors())

const path = require("path")
app.use(express.static(path.join(__dirname, "client", "build")))

/**
 * Check token authentication
 */
app.use(function (req, res, next) {

    let token = req.headers['authorization']
    if (!token) return next();

    token = token.replace('Bearer ', '');

    jwt.verify(token, config.JWTSecret, function (err, decode) {
        if (err) return utils.requestJsonFailed(res, codeStatus.badRequest, 'Session expired! Please sign in.')
        else {
            req.auth = decode;
            next();
        }
    });
});

/**
 * Routing
 */
app.use('/api', router);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

/**
 * Socket server
 */
const io = socketServer(server)

io.on("connection", (socket) => {

    // Broadcast messages
    socket.on('new content added', data => {
        socket.broadcast.emit('notice new content added', data)
    })

    // User disconnected
    socket.on('disconnect');
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
