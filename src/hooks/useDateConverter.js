import { Timestamp } from "firebase/firestore";
import * as dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

const useDateConverter = () => {
	const convertToTimestamp = (date) => {
		// Converts date to UTC ensuring dates match from user input to display via database
		dayjs.extend(utc);
		const formattedDate = dayjs.utc(date).format("MM/DD/YYYY");
		const [month, day, year] = formattedDate.split("/").map(Number);
		const parsedDate = new Date(year, month - 1, day); // Note: Month is zero-based in JavaScript Dates
		const timestampDate = Timestamp.fromDate(parsedDate);

		return timestampDate;
	};

	const convertToDate = (date, locales) => {
		// Convert the parsed Date object to a Firestore Timestamp
		const timestampToDate = date.toDate();

		// Format the Timestamp to a string in "YYYY/MM/DD" format
		const formattedDate = timestampToDate.toLocaleDateString(locales, {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});

		return formattedDate;
	};

	return { convertToTimestamp, convertToDate };
};

export default useDateConverter;
