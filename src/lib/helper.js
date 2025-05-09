export const formatDateToTime = (_date) => {
    if (_date) {
        const date = new Date(_date);
        const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });
        return time;
    }
}

export const getNextDate = () => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
}


export function generateHourlySlots(start, end) {
    const slots = [];
    const [startHour, startMinute] = start?.split(":").map(Number);
    const [endHour, endMinute] = end?.split(":").map(Number);

    let current = new Date();
    current.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0);

    while (current <= endTime) {
        const formatted = current.toTimeString().slice(0, 5); // HH:MM format
        slots.push(formatted);
        current.setHours(current.getHours() + 1); // move 1 hour ahead
    }

    return slots;
}

export function convertEnglishToSwedish(englishDay) {
    const dayMap = {
        Monday: "Måndag",
        Tuesday: "Tisdag",
        Wednesday: "Onsdag",
        Thursday: "Torsdag",
        Friday: "Fredag",
        Saturday: "Lördag",
        Sunday: "Söndag",
    };

    return dayMap[englishDay] || englishDay; // If not found, return the original
}

export function getWeekdayIndex(weekday) {
    const dayMap = {
        Sunday: 0,
        "Söndag": 0,

        Monday: 1,
        "Måndag": 1,

        Tuesday: 2,
        "Tisdag": 2,

        Wednesday: 3,
        "Onsdag": 3,

        Thursday: 4,
        "Torsdag": 4,

        Friday: 5,
        "Fredag": 5,

        Saturday: 6,
        "Söndag": 6
    };

    return dayMap[weekday];
}

export function getCurrentTime24hr() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    // return `${hours}:${minutes}`;
    return hours;
}
