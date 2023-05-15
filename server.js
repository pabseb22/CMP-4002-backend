const http = require('http');
const app = require('./app');

//const port = process.env.PORT || 3000;
const port = 3000;

const server = http.createServer(app);

server.listen(port,() =>{
    console.log("Server on port", port);
});

const io = require ('socket.io')(server, {
    cors:{
        origin: true,
        credentials: true,
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    socket.on("sendMessage", (messageInfo, user_id) => {
        socket.broadcast.emit("receiveMessage", messageInfo, user_id);
    })
});