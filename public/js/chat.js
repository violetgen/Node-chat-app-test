
var socket = io();

function scrollToButton(){
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child')
    //heights:
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        // console.log('should scroll');
        messages.scrollTop(scrollHeight);
    }
}
//on the frontend, we listen for the "connect" event
socket.on('connect', function() {
    // console.log('connected to server');
    //now when the user is connected, send him to the room he is supposed to be:
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function(err){
        if(err){
            window.location.href = '/';
            alert(err);
        }else{
            console.log('no error')
        }
    });

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

socket.on('UpdateUserList', function(users){
    // console.log('Active users', users);
    var ol = jQuery('<ol></ol>');
    users.forEach(function(user) {
        ol.append(jQuery('<li></li>').text(user));
    });
    //dont use append, since we are updating the list, but rather wiping it for new connection
    jQuery('#users').html(ol);
});

//whether we are connected or not, the server emit event, we only listen when we are connected
socket.on('newMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm:a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime,
    });
    jQuery('#messages').append(html);

    scrollToButton();
    // var formattedTime = moment(message.createdAt).format('h:mm:a');
    // console.log('new message came', message);
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);

    // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    // var formattedTime = moment(message.createdAt).format('h:mm:a');
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My Current location</a>');
    // li.text(`${message.from}: ${formattedTime}  `);
    // a.attr('href', message.url);
    // li.append(a);
    // jQuery('#messages').append(li);

    var formattedTime = moment(message.createdAt).format('h:mm:a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime,
    });
    jQuery('#messages').append(html);

    scrollToButton();

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