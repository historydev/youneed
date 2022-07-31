const httpServer = require("http").createServer();
const io = require('socket.io')(httpServer, {
	cors: {
		origin: '*'
	}
});

io.on('connection', socket => {

	console.log(socket.id, ' connected')

	socket.emit('connected', socket.id);

	socket.on('toServer', msg => {
		socket.emit('fromServer', msg);
	});

	socket.on('joinRoom', id => {
		console.log('Join room: ', id);
		socket.join(id)
	});

	socket.on('leaveRoom', id => {
		console.log('Leave room: ', id);
		socket.leave(id);
	});

	socket.on('message', data => {
		console.log(data);
		socket.to(data.id).emit('message', {
			type: data.type,
			message: {
				type: data.type,
				...data.message
			}
		});
	});

});

httpServer.listen(4000, () => {
	console.log('Server started on port 4000');
});
