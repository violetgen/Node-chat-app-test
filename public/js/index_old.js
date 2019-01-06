
var socket = io();
//on the frontend, we listen for the "connect" event
socket.on('connect', function() {
    console.log('connected to server');

    //we emit an event when we are connected
    // socket.emit('CreateMessage', {
    //     from: 'ogugua@obi.com',
    //     text: 'obi created new email'
    // }, function(){
    //     console.log('got it');
    // });
});
socket.on('disconnect', function() {
    console.log('disconnected from server');
});

//whether we are connected or not, the server emit event, we only listen when we are connected
socket.on('newMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm:a');
    console.log('new message came', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);

    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm:a');

    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Current location</a>');
    li.text(`${message.from}: ${formattedTime}  `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});

// socket.emit('CreateMessage', {
//     from: 'ogugua@obi.com',
//     text: 'obi created new email'
// }, function(data){
//     console.log('got it', data);
// });

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    
    var messageTextBox  = jQuery('[name=message]');
    socket.emit('CreateMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function(){
        messageTextBox.val('');
    });
});


var locationButton = jQuery("#send-location");

locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('geolocation not supported by browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending...');

    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send Location');
        // console.log(position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });
    }, function(){
        locationButton.removeAttr('disabled').text('Send Location');
        alert('unable to fetch location');
    });

});