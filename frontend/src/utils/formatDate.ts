const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
};

const optionsWithoutYear: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
};

const optionsWithTime: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
};


export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString("cs-CZ", options)
}

export function formatReservationDate(dateFrom: string, dateTo: string): string {
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);

    const isSameYear = startDate.getFullYear() === endDate.getFullYear();

    if (startDate.toDateString() === endDate.toDateString()) {
        const startTime = startDate.toLocaleTimeString("cs-CZ", isSameYear ? optionsWithoutYear : options);
        const endTime = endDate.toLocaleTimeString("cs-CZ", { hour: "numeric", minute: "numeric" });
        return `${startTime} - ${endTime}`;
    } else {
        const startTime = startDate.toLocaleTimeString("cs-CZ", isSameYear ? optionsWithoutYear : options);
        const endTime = endDate.toLocaleTimeString("cs-CZ", isSameYear ? optionsWithoutYear : options);
        return `${startTime} - ${endTime}`;
    }
}

export function formatDateToTime(dateString: string): string {
    return new Date(dateString).toLocaleString("cs-CZ", optionsWithTime)
}

export function formatDuration(startDateString: string, endDateString: string): string {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
  
    const formattedStartTime = startDate.toLocaleString('cs-CZ', optionsWithTime);
    const formattedEndTime = endDate.toLocaleString('cs-CZ', optionsWithTime);
  
    return `${formattedStartTime} - ${formattedEndTime}`;
  }