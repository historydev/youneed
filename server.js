const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
	cors: {
		origin: 'http://localhost:4200'
	}
});

app.use(express.static('dist/call'));

app.get('/', (req, res) => {
	res.sendFile(__dirname, '/index.html');
});

io.on('connection', socket => {

	console.log(socket.id, ' connected')

	socket.emit('connected', socket.id);

	socket.on('toServer', msg => {
		socket.emit('fromServer', msg);
	});

	socket.on('mediaStreamInfo', ({id, video}) =>  {
		socket.to(id).emit('mediaStreamInfo', video);
	});

	socket.on('call', data => {
		socket.to(data.call.receiver_id).emit('call', data);
	});

	socket.on('accept-call', data => {
		socket.to(data.call.sender_id).emit('accept-call', data);
	});

	socket.on('p2p-accept-call', data => {
		socket.to(data.call.sender_id).emit('p2p-accept-call', data);
	});

	socket.on('decline-call', data => {
		socket.to(data.call.sender_id).emit('decline-call', data);
	});

	socket.on('joinRoom', id => {
		console.log('Join room: ', id);
		socket.join(id)
	});

	socket.on('leaveRoom', id => {
		console.log('Leave room: ', id);
		socket.leave(id);
	});

	socket.on('pushNotification', data => {
		socket.to(data.recipient).emit('pushNotification', data);
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

server.listen(4000, () => {
	console.log('Server started on port 4000');
});
