const useTimestampToDate = (date, locales) => {

    // Convert the parsed Date object to a Firestore Timestamp
    const timestampDate = date.toDate();

    // Format the Timestamp to a string in "YYYY/MM/DD" format
    const formattedDate = timestampDate.toLocaleDateString(locales, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    return formattedDate;
}

export default useTimestampToDate;