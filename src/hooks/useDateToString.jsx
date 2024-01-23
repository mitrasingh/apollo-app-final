// import { useState } from "react";

const useDateToString = (date, locales) => {
    // Convert the parsed Date object to a Firestore Timestamp
    const timestampDueDate = date.toDate();
    // Format the Timestamp to a string in "YYYY/MM/DD" format
    const formattedDueDate = timestampDueDate.toLocaleDateString(locales, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    return formattedDueDate;
}

export default useDateToString;