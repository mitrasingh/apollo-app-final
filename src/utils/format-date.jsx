function formatDate(date) {
    const formatDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
    return formatDate.toLocaleTimeString("en-us", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default formatDate;
