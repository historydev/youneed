import {Socket} from "socket.io";
import {query} from "../databases/mongodb";
import {ObjectId} from "mongodb";

export default function (io: any) {

	io.on('connection', async (socket: Socket) => {

		const messages = await query('messages');

		console.log(socket.id, ' connected')

		let interval:any;
		socket.on('change_message_status', async (id: string) => {
			const _id = id.replace('id', '');
			const message = await messages.collection.findOne({_id: new ObjectId(_id)});
			console.log(message);
			const updated = await messages.collection.updateOne({_id: new ObjectId(_id)}, {$set: { status: 'read' }});
			console.log(updated);
			socket.to(message.sender_id).emit('change_message_status', {
				...message,
				status: 'read'
			});
		});

		socket.on('start_timer', (data) => {
			const timer = {
				hours: 0,
				minutes: 0,
				seconds: 0
			}

			interval = setInterval(() => {

				timer.seconds += 1;

				if(timer.seconds === 60) {
					timer.minutes += 1;
					timer.seconds = 0;
				}

				if(timer.minutes === 60) {
					timer.hours += 1;
					timer.minutes = 0;
				}

				const hours = timer.hours.toString();
				const minutes = timer.minutes.toString();
				const seconds = timer.seconds.toString();

				const timer_string = {
					hours: hours.length < 2 ? '0' + timer.hours : hours,
					minutes: minutes.length < 2 ? '0' + timer.minutes : minutes,
					seconds: seconds.length < 2 ? '0' + timer.seconds : seconds,
				}

				// console.log(timer_string);

				socket.to(data.sender_id).emit('start_timer', timer_string);
				socket.to(data.receiver_id).emit('start_timer', timer_string);
			}, 10);

		});

		socket.on('you_online', (user_id: string, member_id: string) => {
			socket.to(member_id).emit('you_online', user_id);
			console.log('you_online', 'user:' + user_id, 'member: ' + member_id);
		});

		socket.on('im_online', (user_id: string, member_id: string) => {
			socket.to(user_id).emit('im_online', member_id);
			console.log('im_online', 'user:' + user_id, 'member: ' + member_id);
		});

		socket.on('stop_timer', () => {
			clearInterval(interval);
		});

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

		socket.on('message', async meeting_id => {
			const meetings = await query('meetings');
			const response = await meetings.collection.findOne({id: meeting_id});

			console.log(response);

			response?.['members'].forEach((user_id: string) => {
				console.log(user_id);
				socket.to(user_id).emit('message', meeting_id);
			});
		});

		socket.on('p2p-accept-call', data => {
			socket.to(data.call.sender_id).emit('p2p-accept-call', data);
		});

		socket.on('decline-call', data => {
			socket.to(data.call.sender_id).emit('decline-call', data);
			socket.to(data.call.receiver_id).emit('decline-call', data);
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

	return io

}
