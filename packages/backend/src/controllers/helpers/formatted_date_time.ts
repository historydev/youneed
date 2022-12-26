export function formatted_date_time() {
	const date = new Date();
	const day = date.getDate().toString();
	const month = (1+date.getMonth()).toString();
	const curr_day = day.length < 2 ? '0' + day : day;

	const seconds = date.getSeconds().toString();
	const curr_seconds = seconds.length < 2 ? '0' + seconds : seconds;
	const minutes = date.getMinutes().toString();
	const curr_minutes = minutes.length < 2 ? '0' + minutes : minutes;
	const hours = date.getHours().toString();
	const curr_hours = hours.length < 2 ? '0' + hours : hours;

	const curr_date = curr_day + '.' + month + '.' + date.getFullYear();
	const curr_time = curr_hours + ':' + curr_minutes + ':' + curr_seconds;

	return {
		date: curr_date,
		time: curr_time,
		full_date: date
	}
}
