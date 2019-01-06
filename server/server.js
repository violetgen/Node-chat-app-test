//lets load in an inbuilt node module
// const path = require('path');
// const publicPath = path.join(__dirname, '../public');
// console.log(__dirname, '/../public');
// console.log(publicPath);

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
//now we are using http server as opposed to the express server
var server = http.createServer(app);
//lets use the server created above
var io = socketIO(server);

var users = new Users();

app.use(express.static(publicPath));

//we are listening on a built-in connection event
io.on('connection', socket => {
    console.log('new user connected');

    // socket.emit('newMessage', {
    //     from: 'Admin',
    //     text: 'welcome to this room',
    //     createdAt: new Date().getTime()
    // });
    // //socket.emit send message to just one user
    // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room name are required');
        }

        //let people join the room they specified:
        //a user joins a room
        socket.join(params.room);
        //we remove them from previous room:
        users.removeUser(socket.id);
        //we add them to the new room
        users.addUser(socket.id, params.name, params.room);
        //now lets emit the event to update the user list:
        io.to(params.room).emit('UpdateUserList', users.getUserList(params.room));

        //socket.emit send message to just one user
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        //we broadcasting to those in a room, we use "to"
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined`));

        //if no errors, still call the callback
        callback();
    });


    socket.on('CreateMessage', (message, callback) => {
        // console.log('CreateMessage', message);
        // console.log('server listened for the message', message);
        //lets send this message to those connected:
        //we use broadcast when we dont want the sender socket to get it
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
        // io.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
        var user = users.getUser(socket.id);
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        
        callback();
    });

    socket.on('createLocationMessage', coords => {
        var user = users.getUser(socket.id);
        if(user){
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude,coords.longitude));
        }
    });



    socket.on('disconnect', () => {
        // console.log('client disconnected');
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('UpdateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin',  `${user.name} just left`));
        }
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