//lets load in an inbuilt node module
// const path = require('path');
// const publicPath = path.join(__dirname, '../public');
// console.log(__dirname, '/../public');
// console.log(publicPath);

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
//now we are using http server as opposed to the express server
var server = http.createServer(app);
//lets use the server created above
var io = socketIO(server);

app.use(express.static(publicPath));

//we are listening on a built-in connection event
io.on('connection', socket => {
    console.log('new user connected');

    // socket.emit('newMessage', {
    //     from: 'mike@gmail.com',
    //     text: 'this is from me mike',
    //     createdAt: new Date().getTime()
    // });

    socket.on('CreateMessage', (message) => {
        // console.log('server listened for the message', message);
        //lets send this message to those connected:
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });

    socket.on('disconnect', () => {
        console.log('client disconnected');
    });
});


//this is creating a server 
//like: http.createServer(app)
// app.listen(port, () => {
//     console.log('now on ' + port);
// });

//since we are suing the http server, instead of express server, we do:
server.listen(port, () => {
    console.log('now on ' + port);
});