export function get_message_with_time(el: any) {
	const date = el['date'];
	const curr_date = date.getDate();
	const hours = date.getHours().toString();
	const minutes = date.getMinutes().toString();
	const valid_hours = `${hours.length > 1 ? hours : '0'+hours}`;
	const valid_minutes = `${minutes.length > 1 ? minutes : '0'+minutes}`;
	const time = valid_hours + ':' + valid_minutes;

	return {
		...el,
		_id: undefined,
		time,
		is_owner: el['sender_id'] === '1'
	}
}
