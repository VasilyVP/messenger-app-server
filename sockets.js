/**
 * Sockets app part
 */

const users = {};

function ws(socketClient) {
    socketClient.on('connection', socket => {        
        socketClient.emit('users list update', Object.values(users));

        function clearUser() {
            if (users[socket.id]) delete users[socket.id];
            socketClient.emit('users list update', Object.values(users));
        }

        socket.on('disconnect', () => clearUser());
        socket.on('leave chat', () => clearUser());

        socket.on('register user', user => {
            users[socket.id] = user;
            socketClient.emit('users list update', Object.values(users));
        });

        socket.on('post message', text => {
            socket.broadcast.emit('new message', {
                text: text,
                user: users[socket.id]
            })
        });
    });
}

module.exports = ws;