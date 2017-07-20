
/**
 * socketIo控制
 */

module.exports = function (server) {

    var io = require('socket.io').listen(server);

    io.on('connection', function (socket) {
        console.log('启动了')
        socket.on('ferret', function (name, fn) {
            console.log(name)
            fn('yangbiao');
        });
        socket.on('disconnect', function () {
            console.log('user disconnet');
        });
    });
};