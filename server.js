const httpServer = require("http").createServer();
const io = require('socket.io')(httpServer, {
	cors: {
		origin: 'http://localhost:4200'
	}
});

io.on('connection', socket => {

	console.log(socket.id, ' connected')

	socket.emit('connected', socket.id);

	socket.on('toServer', msg => {
		socket.emit('fromServer', msg);
	})

});

httpServer.listen(4000, () => {
	console.log('Server started on port 4000');
});
