import {Server, Socket} from "socket.io";
import * as http from 'http';

export default function(http_server: http.Server) {
	const io = new Server(http_server, {
		cors: {
			origin: 'http://localhost:4200'
		}
	});

	io.on('connection', (socket: Socket) => {

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

		socket.on('p2p_user_media_message', data => {
			console.log(data);
			socket.to(data.id).emit('p2p_user_media_message', {
				type: data.type,
				message: {
					type: data.type,
					...data.message
				}
			});
		});

		socket.on('p2p_display_media_message', data => {
			console.log('display ',data);
			socket.to(data.id).emit('p2p_display_media_message', {
				type: data.type,
				message: {
					type: data.type,
					...data.message
				}
			});
		});

	});

	return

}
