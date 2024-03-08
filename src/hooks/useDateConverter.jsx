import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

const useDateConverter = () => {
	// Converts received timestamp and allows `dayjs` to calculate and display relative time
	const createTimestamp = () => {
		const currentDate = new Date(); // Javascript date object
		const dateToTimestamp = Timestamp.fromDate(currentDate); // Converts date object into a firestore timestamp

		return dateToTimestamp;
	};

	// Converts received timestamp and allows `dayjs` to calculate and display relative time
	const convertToRelativeTime = (date) => {
		dayjs.extend(relativeTime);
		const convertTimestamp = date.toDate();
		const convertRelativeTime = dayjs(convertTimestamp).fromNow();

		return convertRelativeTime;
	};

	// Converts date to UTC ensuring date is converted to proper format as a firestore timestamp
	const convertToTimestamp = (date) => {
		dayjs.extend(utc);
		const formattedDate = dayjs.utc(date).format("MM/DD/YYYY");
		const [month, day, year] = formattedDate.split("/").map(Number);
		const parsedDate = new Date(year, month - 1, day); // Note: Month is zero-based in JavaScript Dates
		const timestampDate = Timestamp.fromDate(parsedDate);

		return timestampDate;
	};

	// Convert the parsed Date object to a Firestore Timestamp
	const convertToDate = (date, locales) => {
		const timestampToDate = date.toDate();
		const formattedDate = timestampToDate.toLocaleDateString(locales, {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});

		return formattedDate;
	};

	// When passing Fire Timestamp as a prop, value is changed and becomes object
	// This function converts new object to proper date formatting
	const convertLostTimestampToDate = (date) => {
		const convertedTimestamp = new Date(date.seconds * 1000).toDateString();
		const newDate = new Date(convertedTimestamp);
		const year = newDate.getFullYear();
		const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Month starts from 0
		const day = String(newDate.getDate()).padStart(2, '0');
		const formattedDate = `${year}-${month}-${day}`;

		return formattedDate;
	};

	return {
		createTimestamp,
		convertToRelativeTime,
		convertToTimestamp,
		convertToDate,
		convertLostTimestampToDate
	};
};

export default useDateConverter;
