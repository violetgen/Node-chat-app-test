var socket = io();
//on the frontend, we listen for the "connect" event
socket.on('connect', function() {
    console.log('connected to server');

    //we emit an event when we are connected
    socket.emit('CreateMessage', {
        from: 'ogugua@obi.com',
        text: 'obi created new email'
    });
});
socket.on('disconnect', function() {
    console.log('disconnected from server');
});

//whether we are connected or not, the server emit event, we only listen when we are connected
socket.on('newMessage', function(message){
    console.log('new message came', message);
});