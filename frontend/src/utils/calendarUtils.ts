import { Dictionary } from "@fullcalendar/core/internal";
import { Reservation as ReservationModel } from "../models/reservation";
import { Project as ProjectModel } from "../models/project";
import styled from "@emotion/styled";
// import { formatDuration } from "./formatDate";

export interface Event {
    id: string,
    title: string,
    start: Date,
    end: Date,
    color: string,
    textColor: string,
    extendedProps?: Dictionary,
}

enum EventColor {
    PAST = "#B8B8B8",
    PRIMARY = "#373b86",
}

const resolveEventColor = (reservation: ReservationModel): EventColor => {
    const now = new Date();
    if (new Date(reservation.dateTo) < now) {
        return EventColor.PAST
    } else {
        return EventColor.PRIMARY
    }
}

function mapReservationToEvent(reservation: ReservationModel, projects: ProjectModel[]): Event {
    // const projectContainingReservation = projects.find((project) =>
    //     project.reservations.some((projectReservation) => projectReservation._id === reservation._id)
    // );
    const textColor = resolveEventColor(reservation) === EventColor.PAST ? "#000" : "#FFF";
    const event: Event = {
        id: reservation._id,
        title: reservation.title,
        start: new Date(reservation.dateFrom),
        end: new Date(reservation.dateTo),
        color: resolveEventColor(reservation),
        textColor: textColor,
        // extendedProps: {
        //     title: reservation.title,
        //     duration: `${formatDuration(""+reservation.dateFrom, ""+reservation.dateTo)}`,
        //     projectTitle: projectContainingReservation ? projectContainingReservation.name : "Project Not Found",
        // },
    };

    return event;
}

export function reservationsToEvents(items: ReservationModel[], projects: ProjectModel[]) {
    const events: Event[] = items.map((reservation) => mapReservationToEvent(reservation, projects));
    return events;
};

export const StyleWrapperDatePicker = styled.div`
    .react-datepicker__input-container input {
        padding: 8px;
        border: 1px solid var(--tetriary-background-color);
        border-radius: 4px;
        width: 94%;
    }

    .react-datepicker__input-container input[disabled] {
        background-color: var(--secondary-background-color);
    }

    .react-datepicker-wrapper {
        width: 100%;
    }

    .react-datepicker__input-container {
        min-width: 135.5px;
    }

    .react-datepicker__input-container input:not([disabled]):hover {
        border: 1px solid var(--hover-outline-color);
    }

    .react-datepicker__input-container input:not([disabled]):focus {
        border: 1px solid var(--active-outline-color);
    }

    .react-datepicker__triangle {
        opacity: 0;
    }

    .react-datepicker {
        font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    }

    .react-datepicker__day--keyboard-selected:hover {
        background-color: var(--hover-outline-color);
    }

    .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {
        background-color: #559190;
    }

    .react-datepicker__day--selected {
        background-color: #559190;
    }
`;