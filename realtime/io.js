const User = require('../models/user');
const Order = require('../models/order');
const Message = require('../models/message');
const async = require('async');

module.exports = function(io) {
  io.on('connection', function(socket) {
    const user = socket.request.user;
    // console.log('Username socket:', user.name);
    // console.log('Session socket: ', socket.request.session);
    const orderId = socket.request.session.orderId;
    // console.log('Order ID socket: ', orderId);

    socket.join(orderId);

    socket.on('chatTo', data => {
      async.waterfall([
        function(callback) {
          io.in(orderId).emit('incomingChat', {
            message: data.message,
            sender: user.name,
            senderImage: user.photo,
            senderId: user._id
          });
          let message = new Message();
          message.owner = user._id;
          message.content = data.message;
          message.save(function(err) {
            callback(err, message);
          });
        },

        function(message, callback) {
          Order.update(
            {
              _id: orderId
            },
            {
              $push: { messages: message._id }
            },
            function(err, count) {
              console.log(count);
            }
          );
        }
      ]);
    });

    socket.on('disconnect', function() {
      console.log(`${socket.request.user.name} disconnected`);
    });
  });
};
