const httpServer = require("http").createServer();
const fs = require('fs');
const io = require('socket.io')(httpServer, {
	cors: {
		origin: '*'
	}
});

const express = require('express')
const app = express()
const port = 3999;

app.use(express.static(__dirname + '/'))

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/dist/video-call/index.html');
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
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

httpServer.listen(4000, _ => {
	console.log('Server started on port 4000');
});
